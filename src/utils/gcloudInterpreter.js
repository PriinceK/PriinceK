// GCloud CLI Interpreter — simulates gcloud, gsutil, kubectl, bq command output

const SIMULATED_OUTPUTS = {
    'gcloud compute instances list': `NAME          ZONE             MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP   EXTERNAL_IP    STATUS
api-server    us-central1-a    e2-medium                  10.128.0.2    34.123.45.67   RUNNING
worker-node   us-central1-b    e2-standard-4              10.128.0.3    35.234.56.78   RUNNING`,

    'gcloud compute instances create': `Created [https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-server].
NAME         ZONE             MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP   EXTERNAL_IP    STATUS
web-server   us-central1-a    e2-medium                  10.128.0.4    34.67.89.12    RUNNING`,

    'gcloud compute ssh': `Updating project ssh metadata...|
Waiting for SSH key to propagate.
Warning: Permanently added 'compute.1234567890' (ED25519) to the list of known hosts.
Linux web-server 5.10.0-18-cloud-amd64 #1 SMP Debian 5.10.140-1 x86_64
clouduser@web-server:~$`,

    'gcloud compute instances stop': `Stopping instance(s) web-server...done.
Updated [https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-server].`,

    'gcloud compute instances delete': `The following instances will be deleted:
 - [web-server] in [us-central1-a]
Deleted [https://www.googleapis.com/compute/v1/projects/my-project/zones/us-central1-a/instances/web-server].`,

    'gsutil ls': `gs://my-project-assets/
gs://my-project-backups/
gs://my-project-logs/`,

    'gsutil mb': `Creating gs://my-app-data-bucket/...`,

    'gsutil cp': `Copying file://index.html [Content-Type=text/html]...
/ [1 files][  4.2 KiB/  4.2 KiB]
Operation completed over 1 objects/4.2 KiB.`,

    'gsutil ls gs://': `gs://my-app-data-bucket/index.html
gs://my-app-data-bucket/style.css
gs://my-app-data-bucket/app.js`,

    'gsutil acl': `Updated ACL on gs://my-app-data-bucket/index.html`,

    'gcloud iam service-accounts list': `DISPLAY NAME                  EMAIL                                              DISABLED
Compute Engine default        123456-compute@developer.gserviceaccount.com        False
App Engine default            my-project@appspot.gserviceaccount.com              False
Cloud Build SA                my-project@cloudbuild.gserviceaccount.com           False
Custom Worker SA              worker@my-project.iam.gserviceaccount.com           False`,

    'gcloud iam service-accounts create': `Created service account [app-sa].`,

    'add-iam-policy-binding': `Updated IAM policy for project [my-project].
bindings:
- members:
  - serviceAccount:app-sa@my-project.iam.gserviceaccount.com
  role: roles/storage.objectViewer`,

    'get-iam-policy': `bindings:
- members:
  - user:admin@example.com
  role: roles/owner
- members:
  - serviceAccount:app-sa@my-project.iam.gserviceaccount.com
  role: roles/storage.objectViewer
- members:
  - serviceAccount:123456-compute@developer.gserviceaccount.com
  role: roles/editor
etag: BwXx1234==
version: 1`,

    'keys create': `created key [a1b2c3d4e5] of type [json] as [key.json] for [app-sa@my-project.iam.gserviceaccount.com]`,

    'gcloud run services list': `SERVICE    REGION         URL                                        LAST DEPLOYED
api-svc    us-central1    https://api-svc-abc123-uc.a.run.app         2026-02-10T14:30:00Z
web-app    us-east1       https://web-app-def456-ue.a.run.app         2026-02-12T09:15:00Z`,

    'gcloud run deploy': `Deploying container to Cloud Run service [my-app] in project [my-project] region [us-central1]
✓ Deploying new service... Done.
  ✓ Creating Revision...
  ✓ Routing traffic...
  ✓ Setting IAM Policy...
Done.
Service [my-app] revision [my-app-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://my-app-abc123-uc.a.run.app`,

    'gcloud run services update': `✓ Deploying... Done.
  ✓ Creating Revision...
  ✓ Routing traffic...
Done.`,

    'gcloud logging read': `2026-02-13 10:01:00  INFO  Request: GET /api/health - 200 (12ms)
2026-02-13 10:01:15  INFO  Request: POST /api/data - 201 (45ms)
2026-02-13 10:01:30  WARN  High memory usage: 78%
2026-02-13 10:02:00  INFO  Request: GET /api/users - 200 (23ms)
2026-02-13 10:02:15  ERROR Connection pool exhausted, retrying...`,

    'gcloud run services delete': `Service [my-app] will be deleted.
Deleting [my-app]...done.
Deleted service [my-app].`,

    'gcloud container clusters list': `NAME           LOCATION         MASTER_VERSION    MASTER_IP       MACHINE_TYPE   NODE_VERSION      NUM_NODES  STATUS
prod-cluster   us-central1-a    1.28.3-gke.1200   34.123.45.100   e2-medium      1.28.3-gke.1200   3          RUNNING`,

    'gcloud container clusters create': `Creating cluster prod-cluster in us-central1-a...
Cluster is being health-checked (master is healthy)...done.
Created [https://container.googleapis.com/v1/projects/my-project/zones/us-central1-a/clusters/prod-cluster].
kubeconfig entry generated for prod-cluster.
NAME           LOCATION         MASTER_VERSION    MASTER_IP       MACHINE_TYPE   NODE_VERSION      NUM_NODES  STATUS
prod-cluster   us-central1-a    1.28.3-gke.1200   34.123.45.100   e2-medium      1.28.3-gke.1200   3          RUNNING`,

    'get-credentials': `Fetching cluster endpoint and auth data.
kubeconfig entry generated for prod-cluster.`,

    'kubectl run': `pod/nginx created`,

    'kubectl expose': `service/nginx exposed
NAME    TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
nginx   LoadBalancer   10.0.0.123    34.123.45.67   80:31234/TCP   5s`,

    'gcloud compute networks list': `NAME       SUBNET_MODE   BGP_ROUTING_MODE   IPV4_RANGE   GATEWAY_IPV4
default    AUTO          REGIONAL
prod-vpc   CUSTOM        REGIONAL`,

    'gcloud compute networks create': `Created [https://www.googleapis.com/compute/v1/projects/my-project/global/networks/staging-vpc].
NAME         SUBNET_MODE   BGP_ROUTING_MODE   IPV4_RANGE   GATEWAY_IPV4
staging-vpc  CUSTOM        REGIONAL`,

    'subnets create': `Created [https://www.googleapis.com/compute/v1/projects/my-project/regions/us-central1/subnetworks/staging-subnet].
NAME             REGION         NETWORK       RANGE          STACK_TYPE
staging-subnet   us-central1    staging-vpc   10.0.1.0/24    IPV4_ONLY`,

    'firewall-rules create': `Creating firewall...done.
NAME         NETWORK       DIRECTION   PRIORITY   ALLOW    DENY   DISABLED
allow-http   staging-vpc   INGRESS     1000       tcp:80          False`,

    'gcloud compute firewall-rules list': `NAME                     NETWORK       DIRECTION   PRIORITY   ALLOW                  DENY   DISABLED
default-allow-icmp       default       INGRESS     65534      icmp                          False
default-allow-internal   default       INGRESS     65534      tcp:0-65535,udp:0-65535,icmp   False
default-allow-rdp        default       INGRESS     65534      tcp:3389                       False
default-allow-ssh        default       INGRESS     65534      tcp:22                         False
allow-http               staging-vpc   INGRESS     1000       tcp:80                         False`,

    'bq ls': `  datasetId
 -----------
  analytics
  logs
  staging`,

    'bq mk': `Dataset 'my-project:reports' successfully created.`,

    'bq query': `+----------+
| f0_      |
+----------+
| 1234567  |
+----------+`,

    'bq load': `Upload complete.
Waiting on bqjob_r1234_000001 ... (2s) Current status: DONE
Loaded 5,432 rows.`,

    'bq show': `  Table my-project:reports.monthly

   Last modified         Schema             Total Rows   Total Bytes
 ------------------- -------------------- ------------ -----------
  13 Feb 10:30:00     |- date: DATE           5432        245760
                      |- revenue: FLOAT
                      |- region: STRING
                      |- users: INTEGER
                      |- sessions: INTEGER
                      |- conversion: FLOAT`,

    'gcloud projects list': `PROJECT_ID          NAME              PROJECT_NUMBER
my-project          My Project        123456789
staging-project     Staging Project   234567890
dev-sandbox         Dev Sandbox       345678901`,

    'gcloud config set project': `Updated property [core/project].`,

    'gcloud config list': `[compute]
region = us-central1
zone = us-central1-a
[core]
account = admin@example.com
project = staging-project`,

    'gcloud config set compute/region': `Updated property [compute/region].`,

    'gcloud compute regions list': `NAME                     CPUS   DISKS_GB   ADDRESSES   RESERVED_ADDRESSES   STATUS
asia-east1               0/24   0/4096     0/8         0/8                  UP
asia-east2               0/24   0/4096     0/8         0/8                  UP
asia-northeast1          0/24   0/4096     0/8         0/8                  UP
asia-south1              0/24   0/4096     0/8         0/8                  UP
australia-southeast1     0/24   0/4096     0/8         0/8                  UP
europe-west1             0/24   0/4096     0/8         0/8                  UP
europe-west2             0/24   0/4096     0/8         0/8                  UP
europe-west3             0/24   0/4096     0/8         0/8                  UP
us-central1              0/24   0/4096     0/8         0/8                  UP
us-east1                 0/24   0/4096     0/8         0/8                  UP
us-east4                 0/24   0/4096     0/8         0/8                  UP
us-west1                 0/24   0/4096     0/8         0/8                  UP`,
}

export function executeGcloudCommand(cmd) {
    const trimmed = cmd.trim()

    if (!trimmed) return { output: '', valid: true }

    // Check for help flag
    if (trimmed.endsWith('--help') || trimmed.endsWith('-h')) {
        const base = trimmed.replace(/\s*--help\s*$/, '').replace(/\s*-h\s*$/, '').trim()
        return {
            output: getHelpText(base),
            valid: true,
        }
    }

    // Find best matching output
    for (const [key, output] of Object.entries(SIMULATED_OUTPUTS)) {
        if (trimmed.includes(key) || trimmed.startsWith(key)) {
            return { output, valid: true }
        }
    }

    // Unknown command — provide helpful error
    if (trimmed.startsWith('gcloud') || trimmed.startsWith('gsutil') ||
        trimmed.startsWith('kubectl') || trimmed.startsWith('bq')) {
        return {
            output: `ERROR: (gcloud) Invalid command: "${trimmed}"\nTry 'gcloud help' for available commands.\nHint: Check the command syntax and required flags.`,
            valid: false,
        }
    }

    return {
        output: `bash: ${trimmed.split(' ')[0]}: command not found\nHint: Use gcloud, gsutil, kubectl, or bq commands in this lab.`,
        valid: false,
    }
}

function getHelpText(base) {
    const helpTexts = {
        'gcloud compute instances': `NAME
    gcloud compute instances - read and manage Compute Engine VM instances

SYNOPSIS
    gcloud compute instances COMMAND [GCLOUD_WIDE_FLAG ...]

COMMANDS
    create      Create Compute Engine virtual machine instances.
    delete      Delete Compute Engine virtual machine instances.
    describe    Display details about a VM instance.
    list        List Compute Engine instances.
    start       Start a stopped VM instance.
    stop        Stop a running VM instance.
    ssh         SSH into a VM instance.`,

        'gcloud run': `NAME
    gcloud run - manage Cloud Run services

SYNOPSIS
    gcloud run GROUP | COMMAND [GCLOUD_WIDE_FLAG ...]

COMMANDS
    deploy      Deploy a container to Cloud Run.
    services    Manage Cloud Run services.

FLAGS
    --image         Container image to deploy
    --region        Region to deploy to
    --allow-unauthenticated   Allow unauthenticated access`,

        'gsutil': `NAME
    gsutil - Cloud Storage command line tool

SYNOPSIS
    gsutil [OPTION]... COMMAND [ARGS...]

COMMANDS
    ls      List buckets or objects
    mb      Make a new bucket
    cp      Copy files and objects
    mv      Move/rename objects
    rm      Remove objects
    acl     Get, set, or change ACLs`,

        'bq': `NAME
    bq - BigQuery command-line tool

SYNOPSIS
    bq [FLAGS] COMMAND [ARGS...]

COMMANDS
    ls        List datasets or tables
    mk        Create a dataset or table
    query     Execute a SQL query
    load      Load data into a table
    show      Show details of a dataset or table`,
    }

    for (const [key, text] of Object.entries(helpTexts)) {
        if (base.includes(key)) return text
    }

    return `Usage: ${base || 'gcloud'} [COMMAND] [FLAGS]
Run '${base || 'gcloud'} --help' for more information about available commands.`
}
