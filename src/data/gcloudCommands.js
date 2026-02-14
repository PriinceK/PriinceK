// GCloud CLI Lab — Command catalog and lesson definitions

export const GCLOUD_LESSONS = [
  {
    id: 'compute-basics',
    title: 'Compute Engine Basics',
    category: 'compute',
    difficulty: 'Beginner',
    description: 'Create, list, and manage Compute Engine VM instances using gcloud commands.',
    icon: '🖥️',
    steps: [
      {
        instruction: 'List all Compute Engine instances in the current project.',
        hint: 'Use gcloud compute instances list',
        expectedCommand: 'gcloud compute instances list',
        validation: (cmd) => cmd.trim() === 'gcloud compute instances list',
        successMessage: '✅ Listed all instances. Currently 2 running in us-central1.',
      },
      {
        instruction: 'Create a new VM instance named "web-server" in zone us-central1-a with machine type e2-medium.',
        hint: 'Use gcloud compute instances create with --zone and --machine-type flags',
        expectedCommand: 'gcloud compute instances create web-server --zone=us-central1-a --machine-type=e2-medium',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud compute instances create') &&
            c.includes('web-server') &&
            (c.includes('--zone=us-central1-a') || c.includes('--zone us-central1-a')) &&
            (c.includes('--machine-type=e2-medium') || c.includes('--machine-type e2-medium'))
        },
        successMessage: '✅ Instance "web-server" created successfully in us-central1-a.',
      },
      {
        instruction: 'SSH into the "web-server" instance in zone us-central1-a.',
        hint: 'Use gcloud compute ssh',
        expectedCommand: 'gcloud compute ssh web-server --zone=us-central1-a',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud compute ssh') && c.includes('web-server') && c.includes('us-central1-a')
        },
        successMessage: '✅ SSH connection established to web-server.',
      },
      {
        instruction: 'Stop the "web-server" instance in zone us-central1-a.',
        hint: 'Use gcloud compute instances stop',
        expectedCommand: 'gcloud compute instances stop web-server --zone=us-central1-a',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud compute instances stop') && c.includes('web-server') && c.includes('us-central1-a')
        },
        successMessage: '✅ Instance "web-server" stopped.',
      },
      {
        instruction: 'Delete the "web-server" instance in zone us-central1-a.',
        hint: 'Use gcloud compute instances delete',
        expectedCommand: 'gcloud compute instances delete web-server --zone=us-central1-a',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud compute instances delete') && c.includes('web-server') && c.includes('us-central1-a')
        },
        successMessage: '✅ Instance "web-server" deleted.',
      },
    ],
  },
  {
    id: 'cloud-storage',
    title: 'Cloud Storage with gsutil',
    category: 'storage',
    difficulty: 'Beginner',
    description: 'Manage Cloud Storage buckets and objects using gsutil commands.',
    icon: '🪣',
    steps: [
      {
        instruction: 'List all Cloud Storage buckets in the current project.',
        hint: 'Use gsutil ls',
        expectedCommand: 'gsutil ls',
        validation: (cmd) => cmd.trim() === 'gsutil ls',
        successMessage: '✅ Listed 3 buckets in the project.',
      },
      {
        instruction: 'Create a new bucket named "my-app-data-bucket" in us-central1.',
        hint: 'Use gsutil mb with -l flag for location',
        expectedCommand: 'gsutil mb -l us-central1 gs://my-app-data-bucket',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gsutil mb') && c.includes('gs://my-app-data-bucket')
        },
        successMessage: '✅ Bucket gs://my-app-data-bucket created in us-central1.',
      },
      {
        instruction: 'Copy a local file "index.html" to the bucket "my-app-data-bucket".',
        hint: 'Use gsutil cp',
        expectedCommand: 'gsutil cp index.html gs://my-app-data-bucket/',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gsutil cp') && c.includes('index.html') && c.includes('gs://my-app-data-bucket')
        },
        successMessage: '✅ index.html uploaded to gs://my-app-data-bucket/.',
      },
      {
        instruction: 'List the contents of the bucket "my-app-data-bucket".',
        hint: 'Use gsutil ls with the bucket URI',
        expectedCommand: 'gsutil ls gs://my-app-data-bucket/',
        validation: (cmd) => cmd.trim().includes('gsutil ls') && cmd.includes('gs://my-app-data-bucket'),
        successMessage: '✅ Bucket contents listed.',
      },
      {
        instruction: 'Make the object "index.html" in "my-app-data-bucket" publicly readable.',
        hint: 'Use gsutil acl ch with -u AllUsers:R',
        expectedCommand: 'gsutil acl ch -u AllUsers:R gs://my-app-data-bucket/index.html',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gsutil acl') && c.includes('AllUsers') && c.includes('my-app-data-bucket')
        },
        successMessage: '✅ Object gs://my-app-data-bucket/index.html is now publicly readable.',
      },
    ],
  },
  {
    id: 'iam-management',
    title: 'IAM & Access Management',
    category: 'iam',
    difficulty: 'Intermediate',
    description: 'Manage IAM policies, service accounts, and role bindings.',
    icon: '🔐',
    steps: [
      {
        instruction: 'List all IAM service accounts in the current project.',
        hint: 'Use gcloud iam service-accounts list',
        expectedCommand: 'gcloud iam service-accounts list',
        validation: (cmd) => cmd.trim() === 'gcloud iam service-accounts list',
        successMessage: '✅ Listed 4 service accounts.',
      },
      {
        instruction: 'Create a new service account with ID "app-sa" and display name "Application Service Account".',
        hint: 'Use gcloud iam service-accounts create with --display-name',
        expectedCommand: 'gcloud iam service-accounts create app-sa --display-name="Application Service Account"',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud iam service-accounts create') && c.includes('app-sa') && c.includes('--display-name')
        },
        successMessage: '✅ Service account "app-sa" created.',
      },
      {
        instruction: 'Bind the role "roles/storage.objectViewer" to the service account "app-sa@my-project.iam.gserviceaccount.com" on the current project.',
        hint: 'Use gcloud projects add-iam-policy-binding with --member and --role',
        expectedCommand: 'gcloud projects add-iam-policy-binding my-project --member=serviceAccount:app-sa@my-project.iam.gserviceaccount.com --role=roles/storage.objectViewer',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('add-iam-policy-binding') && c.includes('--member') && c.includes('--role') && c.includes('storage.objectViewer')
        },
        successMessage: '✅ Role binding added: roles/storage.objectViewer → app-sa.',
      },
      {
        instruction: 'View the IAM policy for the current project.',
        hint: 'Use gcloud projects get-iam-policy',
        expectedCommand: 'gcloud projects get-iam-policy my-project',
        validation: (cmd) => cmd.trim().includes('get-iam-policy'),
        successMessage: '✅ IAM policy retrieved.',
      },
      {
        instruction: 'Create a key file for the service account "app-sa@my-project.iam.gserviceaccount.com".',
        hint: 'Use gcloud iam service-accounts keys create',
        expectedCommand: 'gcloud iam service-accounts keys create key.json --iam-account=app-sa@my-project.iam.gserviceaccount.com',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('keys create') && c.includes('--iam-account')
        },
        successMessage: '✅ Key file "key.json" created for app-sa.',
      },
    ],
  },
  {
    id: 'cloud-run',
    title: 'Cloud Run Deployments',
    category: 'serverless',
    difficulty: 'Intermediate',
    description: 'Deploy and manage containerized applications on Cloud Run.',
    icon: '🚀',
    steps: [
      {
        instruction: 'List all Cloud Run services in the current project.',
        hint: 'Use gcloud run services list',
        expectedCommand: 'gcloud run services list',
        validation: (cmd) => cmd.trim() === 'gcloud run services list',
        successMessage: '✅ Listed 2 Cloud Run services.',
      },
      {
        instruction: 'Deploy a container image "gcr.io/my-project/my-app:v1" to Cloud Run as service "my-app" in region us-central1, allowing unauthenticated access.',
        hint: 'Use gcloud run deploy with --image, --region, and --allow-unauthenticated',
        expectedCommand: 'gcloud run deploy my-app --image=gcr.io/my-project/my-app:v1 --region=us-central1 --allow-unauthenticated',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud run deploy') && c.includes('my-app') &&
            c.includes('--image') && c.includes('--region') && c.includes('--allow-unauthenticated')
        },
        successMessage: '✅ Service "my-app" deployed to https://my-app-abc123-uc.a.run.app',
      },
      {
        instruction: 'Update the Cloud Run service "my-app" to set max instances to 10.',
        hint: 'Use gcloud run services update with --max-instances',
        expectedCommand: 'gcloud run services update my-app --max-instances=10 --region=us-central1',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud run') && c.includes('my-app') && c.includes('--max-instances')
        },
        successMessage: '✅ Service "my-app" updated with max-instances=10.',
      },
      {
        instruction: 'View the logs for the Cloud Run service "my-app".',
        hint: 'Use gcloud logging read or gcloud run services logs',
        expectedCommand: 'gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=my-app"',
        validation: (cmd) => {
          const c = cmd.trim()
          return (c.includes('gcloud logging read') || c.includes('gcloud run services logs')) && c.includes('my-app')
        },
        successMessage: '✅ Showing last 50 log entries for "my-app".',
      },
      {
        instruction: 'Delete the Cloud Run service "my-app" in region us-central1.',
        hint: 'Use gcloud run services delete',
        expectedCommand: 'gcloud run services delete my-app --region=us-central1',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud run services delete') && c.includes('my-app')
        },
        successMessage: '✅ Service "my-app" deleted.',
      },
    ],
  },
  {
    id: 'gke-basics',
    title: 'GKE Cluster Management',
    category: 'containers',
    difficulty: 'Advanced',
    description: 'Create and manage Google Kubernetes Engine clusters.',
    icon: '⚓',
    steps: [
      {
        instruction: 'List all GKE clusters in the current project.',
        hint: 'Use gcloud container clusters list',
        expectedCommand: 'gcloud container clusters list',
        validation: (cmd) => cmd.trim() === 'gcloud container clusters list',
        successMessage: '✅ Listed 1 GKE cluster.',
      },
      {
        instruction: 'Create a GKE cluster named "prod-cluster" in zone us-central1-a with 3 nodes.',
        hint: 'Use gcloud container clusters create with --zone and --num-nodes',
        expectedCommand: 'gcloud container clusters create prod-cluster --zone=us-central1-a --num-nodes=3',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud container clusters create') && c.includes('prod-cluster') && c.includes('--num-nodes')
        },
        successMessage: '✅ Cluster "prod-cluster" created with 3 nodes in us-central1-a.',
      },
      {
        instruction: 'Get credentials for the "prod-cluster" to configure kubectl.',
        hint: 'Use gcloud container clusters get-credentials',
        expectedCommand: 'gcloud container clusters get-credentials prod-cluster --zone=us-central1-a',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('get-credentials') && c.includes('prod-cluster')
        },
        successMessage: '✅ kubectl configured for cluster "prod-cluster".',
      },
      {
        instruction: 'Deploy a nginx pod using kubectl.',
        hint: 'Use kubectl run or kubectl create deployment',
        expectedCommand: 'kubectl run nginx --image=nginx',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('kubectl') && c.includes('nginx') && (c.includes('run') || c.includes('create'))
        },
        successMessage: '✅ Pod "nginx" created and running.',
      },
      {
        instruction: 'Expose the nginx deployment as a LoadBalancer service on port 80.',
        hint: 'Use kubectl expose with --type=LoadBalancer',
        expectedCommand: 'kubectl expose deployment nginx --type=LoadBalancer --port=80',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('kubectl expose') && c.includes('LoadBalancer') && c.includes('80')
        },
        successMessage: '✅ Service exposed. External IP: 34.123.45.67:80',
      },
    ],
  },
  {
    id: 'networking',
    title: 'VPC & Networking',
    category: 'networking',
    difficulty: 'Intermediate',
    description: 'Create VPC networks, subnets, and firewall rules.',
    icon: '🌐',
    steps: [
      {
        instruction: 'List all VPC networks in the current project.',
        hint: 'Use gcloud compute networks list',
        expectedCommand: 'gcloud compute networks list',
        validation: (cmd) => cmd.trim() === 'gcloud compute networks list',
        successMessage: '✅ Listed 2 VPC networks: default, prod-vpc.',
      },
      {
        instruction: 'Create a custom-mode VPC network named "staging-vpc".',
        hint: 'Use gcloud compute networks create with --subnet-mode=custom',
        expectedCommand: 'gcloud compute networks create staging-vpc --subnet-mode=custom',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('gcloud compute networks create') && c.includes('staging-vpc') && c.includes('custom')
        },
        successMessage: '✅ VPC network "staging-vpc" created in custom mode.',
      },
      {
        instruction: 'Create a subnet named "staging-subnet" in "staging-vpc" with range 10.0.1.0/24 in region us-central1.',
        hint: 'Use gcloud compute networks subnets create with --network, --region, --range',
        expectedCommand: 'gcloud compute networks subnets create staging-subnet --network=staging-vpc --region=us-central1 --range=10.0.1.0/24',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('subnets create') && c.includes('staging-subnet') && c.includes('staging-vpc') && c.includes('10.0.1.0/24')
        },
        successMessage: '✅ Subnet "staging-subnet" (10.0.1.0/24) created in staging-vpc.',
      },
      {
        instruction: 'Create a firewall rule named "allow-http" in "staging-vpc" that allows TCP port 80 from all sources.',
        hint: 'Use gcloud compute firewall-rules create with --network, --allow, --source-ranges',
        expectedCommand: 'gcloud compute firewall-rules create allow-http --network=staging-vpc --allow=tcp:80 --source-ranges=0.0.0.0/0',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('firewall-rules create') && c.includes('allow-http') && c.includes('tcp:80')
        },
        successMessage: '✅ Firewall rule "allow-http" created: allow TCP:80 from 0.0.0.0/0.',
      },
      {
        instruction: 'List all firewall rules in the project.',
        hint: 'Use gcloud compute firewall-rules list',
        expectedCommand: 'gcloud compute firewall-rules list',
        validation: (cmd) => cmd.trim() === 'gcloud compute firewall-rules list',
        successMessage: '✅ Listed 5 firewall rules across all networks.',
      },
    ],
  },
  {
    id: 'bigquery',
    title: 'BigQuery with bq',
    category: 'data',
    difficulty: 'Intermediate',
    description: 'Query and manage BigQuery datasets and tables using the bq tool.',
    icon: '📊',
    steps: [
      {
        instruction: 'List all BigQuery datasets in the current project.',
        hint: 'Use bq ls',
        expectedCommand: 'bq ls',
        validation: (cmd) => cmd.trim() === 'bq ls',
        successMessage: '✅ Listed 3 datasets: analytics, logs, staging.',
      },
      {
        instruction: 'Create a new dataset named "reports".',
        hint: 'Use bq mk',
        expectedCommand: 'bq mk reports',
        validation: (cmd) => cmd.trim().includes('bq mk') && cmd.includes('reports'),
        successMessage: '✅ Dataset "reports" created.',
      },
      {
        instruction: 'Run a SQL query to count all rows in the "analytics.events" table.',
        hint: 'Use bq query with a SQL statement',
        expectedCommand: 'bq query "SELECT COUNT(*) FROM analytics.events"',
        validation: (cmd) => {
          const c = cmd.trim().toLowerCase()
          return c.includes('bq query') && c.includes('count') && c.includes('analytics.events')
        },
        successMessage: '✅ Query result: 1,234,567 rows.',
      },
      {
        instruction: 'Load a CSV file "data.csv" into the table "reports.monthly" with auto-detect schema.',
        hint: 'Use bq load with --autodetect and --source_format=CSV',
        expectedCommand: 'bq load --autodetect --source_format=CSV reports.monthly data.csv',
        validation: (cmd) => {
          const c = cmd.trim()
          return c.includes('bq load') && c.includes('reports.monthly') && c.includes('data.csv')
        },
        successMessage: '✅ Loaded 5,432 rows into reports.monthly.',
      },
      {
        instruction: 'Show the schema of the "reports.monthly" table.',
        hint: 'Use bq show',
        expectedCommand: 'bq show reports.monthly',
        validation: (cmd) => cmd.trim().includes('bq show') && cmd.includes('reports.monthly'),
        successMessage: '✅ Schema displayed for reports.monthly: 6 columns.',
      },
    ],
  },
  {
    id: 'project-config',
    title: 'Project & Config Management',
    category: 'config',
    difficulty: 'Beginner',
    description: 'Manage GCP projects, configurations, and authentication.',
    icon: '⚙️',
    steps: [
      {
        instruction: 'List all available GCP projects.',
        hint: 'Use gcloud projects list',
        expectedCommand: 'gcloud projects list',
        validation: (cmd) => cmd.trim() === 'gcloud projects list',
        successMessage: '✅ Listed 3 projects: my-project, staging-project, dev-sandbox.',
      },
      {
        instruction: 'Set the active project to "staging-project".',
        hint: 'Use gcloud config set project',
        expectedCommand: 'gcloud config set project staging-project',
        validation: (cmd) => cmd.trim().includes('gcloud config set project') && cmd.includes('staging-project'),
        successMessage: '✅ Active project set to "staging-project".',
      },
      {
        instruction: 'View the current gcloud configuration.',
        hint: 'Use gcloud config list',
        expectedCommand: 'gcloud config list',
        validation: (cmd) => cmd.trim() === 'gcloud config list',
        successMessage: '✅ Current config: project=staging-project, region=us-central1, zone=us-central1-a.',
      },
      {
        instruction: 'Set the default compute region to "europe-west1".',
        hint: 'Use gcloud config set compute/region',
        expectedCommand: 'gcloud config set compute/region europe-west1',
        validation: (cmd) => cmd.trim().includes('gcloud config set') && cmd.includes('region') && cmd.includes('europe-west1'),
        successMessage: '✅ Default compute region set to "europe-west1".',
      },
      {
        instruction: 'List all available regions for Compute Engine.',
        hint: 'Use gcloud compute regions list',
        expectedCommand: 'gcloud compute regions list',
        validation: (cmd) => cmd.trim() === 'gcloud compute regions list',
        successMessage: '✅ Listed 35 available regions.',
      },
    ],
  },
]

export const GCLOUD_CATEGORIES = {
  compute: 'Compute',
  storage: 'Storage',
  iam: 'IAM & Security',
  serverless: 'Serverless',
  containers: 'Containers',
  networking: 'Networking',
  data: 'Data & Analytics',
  config: 'Config & Setup',
}

export const GCLOUD_CATEGORY_COLORS = {
  compute: '#4285f4',
  storage: '#34a853',
  iam: '#fbbc04',
  serverless: '#e91e63',
  containers: '#00bcd4',
  networking: '#ea4335',
  data: '#9c27b0',
  config: '#94a3b8',
}
