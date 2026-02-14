// Troubleshooting Scenarios — break-fix labs with intentional misconfigs

export const TROUBLESHOOTING_SCENARIOS = [
    {
        id: 'lb-502',
        title: '502 Bad Gateway on Load Balancer',
        category: 'Networking',
        difficulty: 'Intermediate',
        icon: '🌐',
        description: 'Users report intermittent 502 errors when accessing your web application through the Cloud Load Balancer.',
        context: 'A global HTTP(S) load balancer fronts a managed instance group running a Node.js application on port 8080. Health checks are configured but backends are showing as UNHEALTHY.',
        symptoms: [
            'Users see "502 Bad Gateway" intermittently',
            'Load balancer backend health shows 0/3 healthy instances',
            'Application works fine when accessed directly via instance IP',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check Backend Health',
                instruction: 'First, let\'s check the backend service health status.',
                command: 'gcloud compute backend-services get-health web-backend --global',
                output: `backend: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instanceGroups/web-mig
status:
  healthStatus:
  - healthState: UNHEALTHY
    instance: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-vm-1
    port: 80
  - healthState: UNHEALTHY
    instance: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-vm-2
    port: 80
  kind: compute#backendServiceGroupHealth`,
                analysis: 'All instances are UNHEALTHY. Notice the health check is hitting port 80, but the app runs on port 8080.',
            },
            {
                id: 'diagnose-2',
                title: 'Check Health Check Configuration',
                instruction: 'The backends are unhealthy. Let\'s inspect the health check configuration.',
                command: 'gcloud compute health-checks describe web-health-check',
                output: `checkIntervalSec: 10
healthyThreshold: 2
httpHealthCheck:
  port: 80
  requestPath: /health
name: web-health-check
timeoutSec: 5
unhealthyThreshold: 3`,
                analysis: 'Found it! The health check is configured for port 80, but the application listens on port 8080. This is the root cause.',
            },
            {
                id: 'diagnose-3',
                title: 'Verify Application Port',
                instruction: 'Confirm the application is running on port 8080.',
                command: 'gcloud compute ssh web-vm-1 --zone=us-central1-a --command="ss -tlnp | grep 8080"',
                output: `LISTEN  0  511  0.0.0.0:8080  0.0.0.0:*  users:(("node",pid=1234,fd=18))`,
                analysis: 'Confirmed: Node.js is listening on port 8080, not port 80.',
            },
            {
                id: 'fix',
                title: 'Fix the Health Check Port',
                instruction: 'Update the health check to use port 8080 instead of port 80.',
                command: 'gcloud compute health-checks update http web-health-check --port=8080',
                output: `Updated [https://www.googleapis.com/compute/v1/projects/my-project/global/healthChecks/web-health-check].`,
                analysis: 'Health check updated to port 8080. Backends should become healthy within 20-30 seconds.',
            },
            {
                id: 'verify',
                title: 'Verify the Fix',
                instruction: 'Wait a moment, then verify backends are now healthy.',
                command: 'gcloud compute backend-services get-health web-backend --global',
                output: `backend: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instanceGroups/web-mig
status:
  healthStatus:
  - healthState: HEALTHY
    instance: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-vm-1
    port: 8080
  - healthState: HEALTHY
    instance: https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-vm-2
    port: 8080
  kind: compute#backendServiceGroupHealth`,
                analysis: 'All backends are now HEALTHY on port 8080. The 502 errors should be resolved.',
            },
        ],
        rootCause: 'The health check was configured to probe port 80, but the application was listening on port 8080. The load balancer marked all backends as unhealthy and returned 502.',
        lesson: 'Always ensure health check port matches the application listening port. Use named ports on instance groups for clarity.',
        tags: ['load-balancer', 'health-check', 'networking'],
    },
    {
        id: 'iam-denied',
        title: 'IAM Permission Denied on Cloud Storage',
        category: 'IAM',
        difficulty: 'Intermediate',
        icon: '🔐',
        description: 'A Cloud Function fails to read objects from a Cloud Storage bucket with "403 Forbidden" errors.',
        context: 'A newly deployed Cloud Function needs to read configuration files from a GCS bucket. The function\'s service account was recently created but may not have the correct permissions.',
        symptoms: [
            'Cloud Function logs show "403 Forbidden" when accessing gs://config-bucket',
            'The function worked in development using your personal credentials',
            'The service account was created last week',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check Function Service Account',
                instruction: 'Identify which service account the Cloud Function is using.',
                command: 'gcloud functions describe config-reader --region=us-central1 --format="value(serviceAccountEmail)"',
                output: `config-reader-sa@my-project.iam.gserviceaccount.com`,
                analysis: 'The function uses a custom service account "config-reader-sa".',
            },
            {
                id: 'diagnose-2',
                title: 'Check IAM Bindings on the Bucket',
                instruction: 'Check what IAM roles are assigned on the storage bucket.',
                command: 'gsutil iam get gs://config-bucket',
                output: `{
  "bindings": [
    {
      "members": [
        "projectEditor:my-project",
        "projectOwner:my-project"
      ],
      "role": "roles/storage.legacyBucketOwner"
    },
    {
      "members": [
        "projectViewer:my-project"
      ],
      "role": "roles/storage.legacyBucketReader"
    }
  ]
}`,
                analysis: 'The config-reader-sa service account has NO roles on this bucket. Only project-level legacy roles exist.',
            },
            {
                id: 'diagnose-3',
                title: 'Check Project-Level IAM',
                instruction: 'Check if the service account has any project-level storage roles.',
                command: 'gcloud projects get-iam-policy my-project --flatten="bindings[].members" --filter="bindings.members:config-reader-sa" --format="table(bindings.role)"',
                output: `ROLE
(empty)`,
                analysis: 'The service account has no project-level IAM roles either. It needs at minimum roles/storage.objectViewer.',
            },
            {
                id: 'fix',
                title: 'Grant Storage Object Viewer Role',
                instruction: 'Grant the service account the Storage Object Viewer role on the bucket.',
                command: 'gsutil iam ch serviceAccount:config-reader-sa@my-project.iam.gserviceaccount.com:roles/storage.objectViewer gs://config-bucket',
                output: `Updated IAM policy for bucket [config-bucket].
bindings:
- members:
  - serviceAccount:config-reader-sa@my-project.iam.gserviceaccount.com
  role: roles/storage.objectViewer`,
                analysis: 'Storage Object Viewer role granted on the config-bucket.',
            },
            {
                id: 'verify',
                title: 'Verify Access',
                instruction: 'Test that the service account can now list objects in the bucket.',
                command: 'gsutil ls gs://config-bucket/',
                output: `gs://config-bucket/app-config.json
gs://config-bucket/feature-flags.json
gs://config-bucket/secrets.enc`,
                analysis: 'Access granted! The Cloud Function should now be able to read from the bucket.',
            },
        ],
        rootCause: 'The Cloud Function\'s service account (config-reader-sa) had no IAM roles granting access to the Cloud Storage bucket. Unlike the developer\'s personal account, new service accounts start with zero permissions.',
        lesson: 'Follow the principle of least privilege. When creating service accounts for Cloud Functions, explicitly grant only the required roles. Use bucket-level IAM for fine-grained access control.',
        tags: ['iam', 'cloud-storage', 'cloud-functions', 'service-account'],
    },
    {
        id: 'vpc-firewall',
        title: 'VPC Firewall Blocking Application Traffic',
        category: 'Networking',
        difficulty: 'Intermediate',
        icon: '🧱',
        description: 'Internal microservices cannot communicate with each other despite being in the same VPC network.',
        context: 'Two services — "frontend" (port 3000) and "api-service" (port 8080) — are deployed on Compute Engine in the same VPC. The frontend cannot reach the API service.',
        symptoms: [
            'Frontend receives "Connection timed out" when calling api-service:8080',
            'Both VMs are in the same VPC network and subnet',
            'Network tags were recently modified during a security audit',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check Network Connectivity',
                instruction: 'Test connectivity from frontend to api-service on port 8080.',
                command: 'gcloud compute ssh frontend-vm --zone=us-central1-a --command="curl -m 5 http://10.128.0.5:8080/health"',
                output: `curl: (28) Connection timed out after 5001 milliseconds`,
                analysis: 'Connection times out. This is typically a firewall issue, not a DNS or routing problem.',
            },
            {
                id: 'diagnose-2',
                title: 'List Firewall Rules',
                instruction: 'Check the firewall rules that apply to the api-service.',
                command: 'gcloud compute firewall-rules list --filter="network=prod-vpc" --format="table(name,direction,priority,allowed,targetTags,sourceTags,sourceRanges)"',
                output: `NAME                    DIRECTION  PRIORITY  ALLOWED    TARGET_TAGS     SOURCE_TAGS   SOURCE_RANGES
prod-allow-ssh          INGRESS    1000      tcp:22     ssh-allowed                   0.0.0.0/0
prod-allow-health       INGRESS    1000      tcp        health-check                  130.211.0.0/22,35.191.0.0/16
prod-deny-all-ingress   INGRESS    2000      deny all`,
                analysis: 'Found the issue! There is a blanket "deny all ingress" rule at priority 2000 and NO rule allowing internal traffic on port 8080.',
            },
            {
                id: 'diagnose-3',
                title: 'Check Instance Tags',
                instruction: 'Verify the network tags on the api-service VM.',
                command: 'gcloud compute instances describe api-vm --zone=us-central1-a --format="value(tags.items)"',
                output: `api-server;health-check`,
                analysis: 'The api-vm has tags "api-server" and "health-check" but there\'s no firewall rule targeting the "api-server" tag to allow port 8080.',
            },
            {
                id: 'fix',
                title: 'Create Firewall Rule for Internal Traffic',
                instruction: 'Create a firewall rule to allow TCP:8080 from frontend instances to api instances.',
                command: 'gcloud compute firewall-rules create prod-allow-api --network=prod-vpc --allow=tcp:8080 --target-tags=api-server --source-tags=frontend --priority=1000',
                output: `Creating firewall...done.
NAME             NETWORK    DIRECTION  PRIORITY  ALLOW     TARGET_TAGS   SOURCE_TAGS
prod-allow-api   prod-vpc   INGRESS    1000      tcp:8080  api-server    frontend`,
                analysis: 'Firewall rule created allowing TCP:8080 from instances tagged "frontend" to instances tagged "api-server".',
            },
            {
                id: 'verify',
                title: 'Verify Connectivity',
                instruction: 'Test the connection again from frontend to api-service.',
                command: 'gcloud compute ssh frontend-vm --zone=us-central1-a --command="curl -m 5 http://10.128.0.5:8080/health"',
                output: `{"status":"ok","uptime":"72h","version":"2.3.1"}`,
                analysis: 'Connection successful! The API is now reachable from the frontend.',
            },
        ],
        rootCause: 'A "deny all ingress" firewall rule at priority 2000 was blocking all incoming traffic except SSH and health checks. No rule existed to allow internal traffic on port 8080 between the frontend and API service.',
        lesson: 'When using deny-all firewall rules, you must explicitly create allow rules for all necessary internal traffic. Use network tags to scope rules precisely.',
        tags: ['firewall', 'vpc', 'networking', 'security'],
    },
    {
        id: 'dns-failure',
        title: 'Cloud DNS Resolution Failure',
        category: 'Networking',
        difficulty: 'Advanced',
        icon: '🔍',
        description: 'A custom domain configured with Cloud DNS is not resolving to the application\'s IP address.',
        context: 'You registered "app.example.com" and configured Cloud DNS, but the domain returns NXDOMAIN errors.',
        symptoms: [
            'dig app.example.com returns NXDOMAIN',
            'Cloud DNS zone exists with records',
            'The load balancer has an external IP: 34.123.45.67',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check DNS Zone',
                instruction: 'List the DNS managed zones to verify the zone exists.',
                command: 'gcloud dns managed-zones describe example-zone',
                output: `creationTime: '2026-02-10T14:30:00.000Z'
description: Example domain zone
dnsName: example.com.
name: example-zone
nameServers:
- ns-cloud-d1.googledomains.com.
- ns-cloud-d2.googledomains.com.
- ns-cloud-d3.googledomains.com.
- ns-cloud-d4.googledomains.com.
visibility: public`,
                analysis: 'Zone exists with Google Cloud nameservers. Let\'s check if the records are correct.',
            },
            {
                id: 'diagnose-2',
                title: 'Check DNS Records',
                instruction: 'List the DNS records in the zone.',
                command: 'gcloud dns record-sets list --zone=example-zone',
                output: `NAME                TYPE   TTL    DATA
example.com.        NS     21600  ns-cloud-d1.googledomains.com.,ns-cloud-d2.googledomains.com.,ns-cloud-d3.googledomains.com.,ns-cloud-d4.googledomains.com.
example.com.        SOA    21600  ns-cloud-d1.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 259200 300
app.example.com.    A      300    34.123.45.67`,
                analysis: 'The A record for app.example.com exists and points to the correct IP. The issue might be with the domain registrar\'s nameservers.',
            },
            {
                id: 'diagnose-3',
                title: 'Check Registrar Nameservers',
                instruction: 'Query the root nameservers to see which NS records the domain registrar has.',
                command: 'dig example.com NS +short',
                output: `ns1.registrar-default.com.
ns2.registrar-default.com.`,
                analysis: 'Found the root cause! The domain registrar is still using default nameservers, NOT the Google Cloud DNS nameservers.',
            },
            {
                id: 'fix',
                title: 'Update Registrar Nameservers',
                instruction: 'Update the domain registrar to use Google Cloud DNS nameservers. (In production, this is done in your registrar\'s dashboard.)',
                command: 'gcloud dns managed-zones describe example-zone --format="value(nameServers)"',
                output: `ns-cloud-d1.googledomains.com.;ns-cloud-d2.googledomains.com.;ns-cloud-d3.googledomains.com.;ns-cloud-d4.googledomains.com.`,
                analysis: 'Copy these nameservers to your domain registrar\'s NS settings. DNS propagation takes up to 48 hours.',
            },
            {
                id: 'verify',
                title: 'Verify DNS Resolution',
                instruction: 'After nameserver propagation, verify DNS resolution works.',
                command: 'dig app.example.com @ns-cloud-d1.googledomains.com',
                output: `;; ANSWER SECTION:
app.example.com.	300	IN	A	34.123.45.67`,
                analysis: 'DNS is resolving correctly through Cloud DNS nameservers. Once propagation completes, the domain will work globally.',
            },
        ],
        rootCause: 'The domain registrar was still using its default nameservers instead of the Google Cloud DNS nameservers. While the Cloud DNS zone had the correct A record, queries were going to the wrong nameservers.',
        lesson: 'When using Cloud DNS, you MUST update your domain registrar\'s nameserver settings to point to the Google Cloud DNS nameservers. This is a commonly missed step.',
        tags: ['dns', 'networking', 'cloud-dns'],
    },
    {
        id: 'cloud-run-timeout',
        title: 'Cloud Run Cold Start Timeout',
        category: 'Serverless',
        difficulty: 'Advanced',
        icon: '⏱️',
        description: 'Cloud Run service intermittently returns 504 Gateway Timeout errors, especially after periods of inactivity.',
        context: 'A Java Spring Boot application deployed on Cloud Run experiences timeouts when scaling from zero. The container takes 15+ seconds to start.',
        symptoms: [
            'First request after idle period returns 504',
            'Subsequent requests are fast (< 200ms)',
            'Container logs show 15s startup time',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check Service Configuration',
                instruction: 'Inspect the Cloud Run service configuration for timeout and concurrency settings.',
                command: 'gcloud run services describe api-service --region=us-central1 --format="yaml(spec.template.spec)"',
                output: `spec:
  template:
    spec:
      containerConcurrency: 80
      containers:
      - image: gcr.io/my-project/api-service:v3
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: '1'
            memory: 512Mi
      serviceAccountName: api-sa@my-project.iam.gserviceaccount.com
      timeoutSeconds: 10`,
                analysis: 'Found issues: timeout is only 10 seconds (too short for a 15s cold start), memory is only 512Mi for a Java app, and min-instances is not set (defaults to 0).',
            },
            {
                id: 'diagnose-2',
                title: 'Check Scaling Configuration',
                instruction: 'Check the min/max instance configuration.',
                command: 'gcloud run services describe api-service --region=us-central1 --format="yaml(spec.template.metadata.annotations)"',
                output: `spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: '10'
        autoscaling.knative.dev/minScale: '0'
        run.googleapis.com/startup-cpu-boost: 'false'`,
                analysis: 'minScale is 0 (scales to zero), startup CPU boost is disabled, and there\'s no startup probe configured.',
            },
            {
                id: 'diagnose-3',
                title: 'Check Container Logs',
                instruction: 'Check the container startup logs to see actual startup time.',
                command: 'gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=api-service AND textPayload:Started" --limit=5 --format="table(timestamp,textPayload)"',
                output: `TIMESTAMP                    TEXT_PAYLOAD
2026-02-13T10:05:00.000Z     Started Application in 14.823 seconds
2026-02-13T09:30:00.000Z     Started Application in 15.112 seconds
2026-02-13T08:15:00.000Z     Started Application in 14.567 seconds`,
                analysis: 'Startup consistently takes ~15 seconds, exceeding the 10-second timeout.',
            },
            {
                id: 'fix',
                title: 'Fix Configuration',
                instruction: 'Update the service with appropriate timeout, min instances, memory, and startup CPU boost.',
                command: 'gcloud run services update api-service --region=us-central1 --timeout=60 --min-instances=1 --memory=1Gi --cpu-boost',
                output: `✓ Deploying... Done.
  ✓ Creating Revision... Revision api-service-00005-xyz is being deployed.
  ✓ Routing traffic...
Done.
Service [api-service] revision [api-service-00005-xyz] has been deployed.`,
                analysis: 'Applied four fixes: increased timeout to 60s, set min-instances to 1 (prevents cold starts), doubled memory to 1Gi, and enabled startup CPU boost.',
            },
            {
                id: 'verify',
                title: 'Verify the Fix',
                instruction: 'Check the updated service configuration.',
                command: 'gcloud run services describe api-service --region=us-central1 --format="value(spec.template.metadata.annotations,spec.template.spec.timeoutSeconds,spec.template.spec.containers[0].resources.limits.memory)"',
                output: `autoscaling.knative.dev/minScale=1,run.googleapis.com/startup-cpu-boost=true
60
1Gi`,
                analysis: 'All fixes applied. With min-instances=1, there will always be a warm instance ready. The startup CPU boost will also reduce cold start time.',
            },
        ],
        rootCause: 'The Cloud Run service had a 10-second timeout but the Java Spring Boot app took 15 seconds to start. Combined with min-instances=0, every cold start resulted in a 504 timeout.',
        lesson: 'For Java/JVM applications on Cloud Run: (1) Set min-instances >= 1 for production workloads, (2) Enable startup CPU boost, (3) Increase memory for JVM apps, (4) Set timeout higher than cold start time.',
        tags: ['cloud-run', 'serverless', 'cold-start', 'timeout'],
    },
    {
        id: 'gke-crashloop',
        title: 'GKE Pod CrashLoopBackOff',
        category: 'Containers',
        difficulty: 'Advanced',
        icon: '🔄',
        description: 'Pods in a GKE deployment are stuck in CrashLoopBackOff after a new deployment.',
        context: 'A microservice was redeployed with a new version, but all pods are crashing repeatedly. The previous version was working fine.',
        symptoms: [
            'kubectl get pods shows CrashLoopBackOff',
            'The new container image builds successfully',
            'Previous version v2.1.0 worked fine, current is v2.2.0',
        ],
        steps: [
            {
                id: 'diagnose-1',
                title: 'Check Pod Status',
                instruction: 'Get the status of the pods in the deployment.',
                command: 'kubectl get pods -l app=user-service',
                output: `NAME                            READY   STATUS             RESTARTS   AGE
user-service-7d4f8b9c6-abc12   0/1     CrashLoopBackOff   5          8m
user-service-7d4f8b9c6-def34   0/1     CrashLoopBackOff   5          8m
user-service-7d4f8b9c6-ghi56   0/1     CrashLoopBackOff   5          8m`,
                analysis: 'All 3 pods are in CrashLoopBackOff with 5 restarts each.',
            },
            {
                id: 'diagnose-2',
                title: 'Check Pod Logs',
                instruction: 'Check the logs of one of the crashing pods.',
                command: 'kubectl logs user-service-7d4f8b9c6-abc12 --previous',
                output: `2026-02-13 10:00:00 INFO  Starting UserService v2.2.0
2026-02-13 10:00:01 INFO  Connecting to database...
2026-02-13 10:00:01 ERROR Failed to connect to database: host "db-primary" not found
2026-02-13 10:00:01 ERROR Environment variable DATABASE_URL is not set
2026-02-13 10:00:01 FATAL Application failed to start. Exiting.`,
                analysis: 'The application is crashing because the DATABASE_URL environment variable is missing. The new version likely requires a new env var that wasn\'t added to the deployment.',
            },
            {
                id: 'diagnose-3',
                title: 'Check Deployment Environment Variables',
                instruction: 'Inspect the current deployment spec for environment variables.',
                command: 'kubectl get deployment user-service -o jsonpath="{.spec.template.spec.containers[0].env[*].name}" | tr " " "\\n"',
                output: `API_KEY
PORT
LOG_LEVEL`,
                analysis: 'Confirmed: DATABASE_URL is not in the environment variables. The v2.2.0 release notes probably mention a new required env var.',
            },
            {
                id: 'fix',
                title: 'Add Missing Environment Variable',
                instruction: 'Set the DATABASE_URL environment variable on the deployment.',
                command: 'kubectl set env deployment/user-service DATABASE_URL="postgresql://db-primary:5432/users"',
                output: `deployment.apps/user-service env updated`,
                analysis: 'Environment variable added. Kubernetes will automatically roll out new pods.',
            },
            {
                id: 'verify',
                title: 'Verify Pods Are Running',
                instruction: 'Check that the new pods start successfully.',
                command: 'kubectl get pods -l app=user-service',
                output: `NAME                            READY   STATUS    RESTARTS   AGE
user-service-8e5f9c0d7-jkl78   1/1     Running   0          30s
user-service-8e5f9c0d7-mno90   1/1     Running   0          28s
user-service-8e5f9c0d7-pqr12   1/1     Running   0          25s`,
                analysis: 'All pods are now running with 0 restarts. The fix was successful.',
            },
        ],
        rootCause: 'The v2.2.0 deployment introduced a new required environment variable (DATABASE_URL) that wasn\'t added to the Kubernetes deployment manifest. Without it, the application failed to connect to the database and crashed on startup.',
        lesson: 'Always review release notes for new environment variables when updating container versions. Use ConfigMaps or Secrets for managing environment configuration, and add readiness/liveness probes to detect startup failures early.',
        tags: ['gke', 'kubernetes', 'containers', 'deployment'],
    },
]
