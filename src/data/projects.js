// Project Mode — guided multi-step projects chaining GCP concepts

export const PROJECTS = [
    {
        id: 'three-tier-webapp',
        title: 'Deploy a 3-Tier Web App',
        description: 'Build a production-ready 3-tier architecture: VPC network, Cloud SQL database, Cloud Run application, load balancer, and monitoring.',
        difficulty: 'Advanced',
        estimatedTime: '45 min',
        icon: '🏗️',
        tags: ['VPC', 'Cloud SQL', 'Cloud Run', 'Load Balancer', 'Monitoring'],
        phases: [
            {
                id: 'network',
                title: 'Set Up VPC Network',
                description: 'Create an isolated VPC with custom subnets for the application tier and database tier.',
                objectives: ['Create a custom VPC', 'Create application and database subnets', 'Configure firewall rules'],
                tasks: [
                    { instruction: 'Create a custom-mode VPC named "webapp-vpc"', command: 'gcloud compute networks create webapp-vpc --subnet-mode=custom', hint: 'Use --subnet-mode=custom for manual subnet control' },
                    { instruction: 'Create an app subnet (10.1.0.0/24) in us-central1', command: 'gcloud compute networks subnets create app-subnet --network=webapp-vpc --region=us-central1 --range=10.1.0.0/24', hint: 'Specify --network, --region, and --range' },
                    { instruction: 'Create a db subnet (10.2.0.0/24) in us-central1', command: 'gcloud compute networks subnets create db-subnet --network=webapp-vpc --region=us-central1 --range=10.2.0.0/24', hint: 'Same pattern as the app subnet' },
                    { instruction: 'Create a firewall rule allowing HTTP (80) from any source', command: 'gcloud compute firewall-rules create webapp-allow-http --network=webapp-vpc --allow=tcp:80 --source-ranges=0.0.0.0/0', hint: 'Use --allow=tcp:80 and --source-ranges=0.0.0.0/0' },
                ],
            },
            {
                id: 'database',
                title: 'Provision Cloud SQL',
                description: 'Create a Cloud SQL PostgreSQL instance for the application database.',
                objectives: ['Create Cloud SQL instance', 'Set up database and user', 'Configure private IP'],
                tasks: [
                    { instruction: 'Create a Cloud SQL PostgreSQL 15 instance named "webapp-db" (db-f1-micro)', command: 'gcloud sql instances create webapp-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=us-central1', hint: 'Use --database-version, --tier, and --region flags' },
                    { instruction: 'Create a database named "webapp" on the instance', command: 'gcloud sql databases create webapp --instance=webapp-db', hint: 'Use gcloud sql databases create' },
                    { instruction: 'Set the password for the default "postgres" user', command: 'gcloud sql users set-password postgres --instance=webapp-db --password=securepass123', hint: 'Use gcloud sql users set-password' },
                ],
            },
            {
                id: 'application',
                title: 'Deploy to Cloud Run',
                description: 'Deploy the web application container to Cloud Run with the database connection.',
                objectives: ['Build container image', 'Deploy to Cloud Run', 'Configure environment variables'],
                tasks: [
                    { instruction: 'Submit a build to Cloud Build from the current directory', command: 'gcloud builds submit --tag gcr.io/my-project/webapp:v1', hint: 'Use gcloud builds submit with --tag' },
                    { instruction: 'Deploy the container to Cloud Run as "webapp-service"', command: 'gcloud run deploy webapp-service --image=gcr.io/my-project/webapp:v1 --region=us-central1 --allow-unauthenticated', hint: 'Use gcloud run deploy with --image and --allow-unauthenticated' },
                    { instruction: 'Set the DATABASE_URL environment variable on the service', command: 'gcloud run services update webapp-service --region=us-central1 --set-env-vars=DATABASE_URL=postgresql://postgres:securepass123@webapp-db:5432/webapp', hint: 'Use --set-env-vars flag' },
                ],
            },
            {
                id: 'loadbalancer',
                title: 'Configure Load Balancer',
                description: 'Set up a global HTTP(S) load balancer in front of Cloud Run for custom domain and CDN.',
                objectives: ['Create serverless NEG', 'Configure backend service', 'Set up frontend'],
                tasks: [
                    { instruction: 'Create a serverless NEG for the Cloud Run service', command: 'gcloud compute network-endpoint-groups create webapp-neg --region=us-central1 --network-endpoint-type=serverless --cloud-run-service=webapp-service', hint: 'Use --network-endpoint-type=serverless' },
                    { instruction: 'Create a backend service and attach the NEG', command: 'gcloud compute backend-services create webapp-backend --global --load-balancing-scheme=EXTERNAL_MANAGED', hint: 'Use --global and --load-balancing-scheme' },
                    { instruction: 'Create a URL map routing all traffic to the backend', command: 'gcloud compute url-maps create webapp-urlmap --default-service=webapp-backend', hint: 'Use --default-service flag' },
                    { instruction: 'Create a target HTTP proxy', command: 'gcloud compute target-http-proxies create webapp-proxy --url-map=webapp-urlmap', hint: 'Use --url-map flag' },
                    { instruction: 'Create a global forwarding rule on port 80', command: 'gcloud compute forwarding-rules create webapp-frontend --global --target-http-proxy=webapp-proxy --ports=80', hint: 'Use --global and --ports=80' },
                ],
            },
            {
                id: 'monitoring',
                title: 'Set Up Monitoring',
                description: 'Configure Cloud Monitoring with uptime checks and alerting policies.',
                objectives: ['Create uptime check', 'Set up alert policy', 'Create dashboard'],
                tasks: [
                    { instruction: 'Create an uptime check for the application URL', command: 'gcloud monitoring uptime create webapp-uptime --resource-type=uptime-url --hostname=webapp.example.com --path=/health --period=60', hint: 'Use gcloud monitoring uptime create' },
                    { instruction: 'Create a notification channel (email)', command: 'gcloud alpha monitoring channels create --type=email --display-name="Ops Team" --channel-labels=email_address=ops@example.com', hint: 'Use gcloud alpha monitoring channels create' },
                    { instruction: 'List existing alert policies to confirm configuration', command: 'gcloud alpha monitoring policies list', hint: 'Use gcloud alpha monitoring policies list' },
                ],
            },
        ],
    },
    {
        id: 'data-pipeline',
        title: 'Build a Data Pipeline',
        description: 'Create an end-to-end data pipeline: Pub/Sub ingestion, Dataflow processing, BigQuery storage, and analytics.',
        difficulty: 'Advanced',
        estimatedTime: '40 min',
        icon: '📊',
        tags: ['Pub/Sub', 'Dataflow', 'BigQuery', 'Cloud Storage'],
        phases: [
            {
                id: 'ingestion',
                title: 'Set Up Data Ingestion',
                description: 'Create Pub/Sub topic and subscription for streaming data ingestion.',
                objectives: ['Create Pub/Sub topic', 'Create subscription', 'Test message publishing'],
                tasks: [
                    { instruction: 'Create a Pub/Sub topic named "events-stream"', command: 'gcloud pubsub topics create events-stream', hint: 'Use gcloud pubsub topics create' },
                    { instruction: 'Create a pull subscription for the topic', command: 'gcloud pubsub subscriptions create events-sub --topic=events-stream --ack-deadline=60', hint: 'Use --topic and --ack-deadline flags' },
                    { instruction: 'Publish a test message to the topic', command: 'gcloud pubsub topics publish events-stream --message=\'{"event":"test","timestamp":"2026-02-13T10:00:00Z"}\'', hint: 'Use gcloud pubsub topics publish with --message' },
                ],
            },
            {
                id: 'storage',
                title: 'Prepare BigQuery Storage',
                description: 'Set up BigQuery dataset and tables for processed data.',
                objectives: ['Create dataset', 'Create table with schema', 'Configure partitioning'],
                tasks: [
                    { instruction: 'Create a BigQuery dataset named "analytics"', command: 'bq mk --dataset --location=US analytics', hint: 'Use bq mk --dataset' },
                    { instruction: 'Create a partitioned events table', command: 'bq mk --table --time_partitioning_field=timestamp analytics.events event_id:STRING,event_type:STRING,timestamp:TIMESTAMP,data:STRING', hint: 'Use bq mk --table with schema and --time_partitioning_field' },
                    { instruction: 'Verify the table was created', command: 'bq show analytics.events', hint: 'Use bq show' },
                ],
            },
            {
                id: 'processing',
                title: 'Deploy Dataflow Pipeline',
                description: 'Create and launch a Dataflow streaming job to process events.',
                objectives: ['Create staging bucket', 'Launch Dataflow job', 'Verify pipeline running'],
                tasks: [
                    { instruction: 'Create a GCS bucket for Dataflow staging', command: 'gsutil mb -l us-central1 gs://my-project-dataflow-staging', hint: 'Use gsutil mb with -l for location' },
                    { instruction: 'Launch a Dataflow streaming job from template', command: 'gcloud dataflow jobs run events-pipeline --gcs-location=gs://dataflow-templates/latest/PubSub_to_BigQuery --region=us-central1 --parameters=inputTopic=projects/my-project/topics/events-stream,outputTableSpec=my-project:analytics.events', hint: 'Use gcloud dataflow jobs run with --gcs-location and --parameters' },
                    { instruction: 'Check that the Dataflow job is running', command: 'gcloud dataflow jobs list --region=us-central1 --status=active', hint: 'Use --status=active filter' },
                ],
            },
            {
                id: 'analytics',
                title: 'Query and Analyze',
                description: 'Run analytical queries on the processed data.',
                objectives: ['Run aggregation query', 'Create scheduled query', 'Verify results'],
                tasks: [
                    { instruction: 'Query the count of events by type from the last hour', command: 'bq query "SELECT event_type, COUNT(*) as count FROM analytics.events WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) GROUP BY event_type ORDER BY count DESC"', hint: 'Use bq query with SQL' },
                    { instruction: 'Export query results to Cloud Storage', command: 'bq extract analytics.events gs://my-project-dataflow-staging/exports/events-*.json', hint: 'Use bq extract' },
                ],
            },
        ],
    },
    {
        id: 'cicd-pipeline',
        title: 'Set Up CI/CD Pipeline',
        description: 'Build a complete CI/CD pipeline: source repository, Cloud Build triggers, Artifact Registry, and Cloud Deploy to GKE.',
        difficulty: 'Expert',
        estimatedTime: '50 min',
        icon: '🔄',
        tags: ['Cloud Build', 'Artifact Registry', 'Cloud Deploy', 'GKE'],
        phases: [
            {
                id: 'registry',
                title: 'Set Up Artifact Registry',
                description: 'Create a Docker repository in Artifact Registry.',
                objectives: ['Create Docker repository', 'Configure Docker auth'],
                tasks: [
                    { instruction: 'Create a Docker repository named "app-images" in us-central1', command: 'gcloud artifacts repositories create app-images --repository-format=docker --location=us-central1 --description="Application container images"', hint: 'Use gcloud artifacts repositories create with --repository-format=docker' },
                    { instruction: 'Configure Docker to authenticate with Artifact Registry', command: 'gcloud auth configure-docker us-central1-docker.pkg.dev', hint: 'Use gcloud auth configure-docker' },
                    { instruction: 'List repositories to verify creation', command: 'gcloud artifacts repositories list --location=us-central1', hint: 'Use gcloud artifacts repositories list' },
                ],
            },
            {
                id: 'build',
                title: 'Configure Cloud Build',
                description: 'Set up automated builds with Cloud Build triggers.',
                objectives: ['Create build trigger', 'Test the build', 'Verify image pushed'],
                tasks: [
                    { instruction: 'Create a build trigger connected to the GitHub repo main branch', command: 'gcloud builds triggers create github --repo-name=my-app --repo-owner=myorg --branch-pattern="^main$" --build-config=cloudbuild.yaml', hint: 'Use gcloud builds triggers create github' },
                    { instruction: 'Manually run a build to test the trigger', command: 'gcloud builds submit --config=cloudbuild.yaml --substitutions=_IMAGE_TAG=v1.0.0', hint: 'Use gcloud builds submit with --config and --substitutions' },
                    { instruction: 'List the build history', command: 'gcloud builds list --limit=5', hint: 'Use gcloud builds list with --limit' },
                ],
            },
            {
                id: 'gke',
                title: 'Prepare GKE Cluster',
                description: 'Create a GKE cluster and configure it for deployments.',
                objectives: ['Create GKE Autopilot cluster', 'Get credentials', 'Create namespace'],
                tasks: [
                    { instruction: 'Create a GKE Autopilot cluster named "prod-cluster"', command: 'gcloud container clusters create-auto prod-cluster --region=us-central1', hint: 'Use create-auto for Autopilot clusters' },
                    { instruction: 'Get cluster credentials for kubectl', command: 'gcloud container clusters get-credentials prod-cluster --region=us-central1', hint: 'Use get-credentials with --region' },
                    { instruction: 'Create a production namespace', command: 'kubectl create namespace production', hint: 'Use kubectl create namespace' },
                ],
            },
            {
                id: 'deploy',
                title: 'Set Up Cloud Deploy',
                description: 'Configure Cloud Deploy pipeline for progressive delivery.',
                objectives: ['Create delivery pipeline', 'Create release', 'Promote to production'],
                tasks: [
                    { instruction: 'Register the delivery pipeline with Cloud Deploy', command: 'gcloud deploy apply --file=deploy/pipeline.yaml --region=us-central1', hint: 'Use gcloud deploy apply with --file' },
                    { instruction: 'Create a release for v1.0.0', command: 'gcloud deploy releases create release-v1 --delivery-pipeline=my-app-pipeline --region=us-central1 --images=my-app=us-central1-docker.pkg.dev/my-project/app-images/my-app:v1.0.0', hint: 'Use gcloud deploy releases create with --images' },
                    { instruction: 'Check the rollout status', command: 'gcloud deploy rollouts list --delivery-pipeline=my-app-pipeline --release=release-v1 --region=us-central1', hint: 'Use gcloud deploy rollouts list' },
                ],
            },
        ],
    },
]
