// Architecture Diagramming Quizzes — broken architectures for users to identify flaws

export const ARCHITECTURE_QUIZZES = [
    {
        id: 'no-cdn',
        title: 'Static Assets Without CDN',
        difficulty: 'Beginner',
        description: 'A global e-commerce site serves static assets directly from the origin server.',
        nodes: [
            { id: 'users', label: 'Global Users', type: 'external', x: 50, y: 150 },
            { id: 'lb', label: 'Cloud Load Balancer', type: 'networking', x: 250, y: 150, correct: true },
            { id: 'gce', label: 'Compute Engine\n(Web Server)', type: 'compute', x: 450, y: 100, correct: true },
            { id: 'gcs', label: 'Cloud Storage\n(Static Assets)', type: 'storage', x: 450, y: 200, flaw: true, flawType: 'missing-service' },
            { id: 'sql', label: 'Cloud SQL', type: 'database', x: 650, y: 150, correct: true },
        ],
        connections: [
            { from: 'users', to: 'lb' },
            { from: 'lb', to: 'gce' },
            { from: 'gce', to: 'gcs' },
            { from: 'gce', to: 'sql' },
        ],
        flaws: [
            { id: 'flaw-1', description: 'No CDN in front of Cloud Storage for static assets', severity: 'high', fix: 'Add Cloud CDN in front of the load balancer to cache static assets at edge locations. This reduces latency for global users and decreases origin load.', missingService: 'Cloud CDN' },
            { id: 'flaw-2', description: 'No Cloud Armor for DDoS protection', severity: 'medium', fix: 'Add Cloud Armor to the load balancer to protect against DDoS attacks and implement WAF rules.', missingService: 'Cloud Armor' },
        ],
        questions: [
            { question: 'What critical service is missing for serving static assets to global users?', options: ['Cloud CDN', 'Cloud DNS', 'Cloud NAT', 'Cloud Interconnect'], answer: 0, explanation: 'Cloud CDN caches content at Google\'s edge locations worldwide, reducing latency from 200ms+ to <20ms for static assets.' },
            { question: 'What security service should protect the load balancer?', options: ['Cloud KMS', 'Cloud Armor', 'VPC Service Controls', 'Binary Authorization'], answer: 1, explanation: 'Cloud Armor provides DDoS protection and WAF capabilities when attached to a global HTTP(S) load balancer.' },
        ],
    },
    {
        id: 'single-region-db',
        title: 'Single-Region Database for Global App',
        difficulty: 'Intermediate',
        description: 'A globally distributed application uses a single-region database for all traffic.',
        nodes: [
            { id: 'users-us', label: 'US Users', type: 'external', x: 50, y: 80 },
            { id: 'users-eu', label: 'EU Users', type: 'external', x: 50, y: 220 },
            { id: 'lb', label: 'Global LB', type: 'networking', x: 200, y: 150 },
            { id: 'run-us', label: 'Cloud Run\n(us-central1)', type: 'compute', x: 400, y: 80 },
            { id: 'run-eu', label: 'Cloud Run\n(europe-west1)', type: 'compute', x: 400, y: 220 },
            { id: 'sql', label: 'Cloud SQL\n(us-central1 only)', type: 'database', x: 600, y: 150, flaw: true },
        ],
        connections: [
            { from: 'users-us', to: 'lb' },
            { from: 'users-eu', to: 'lb' },
            { from: 'lb', to: 'run-us' },
            { from: 'lb', to: 'run-eu' },
            { from: 'run-us', to: 'sql' },
            { from: 'run-eu', to: 'sql', flaw: true },
        ],
        flaws: [
            { id: 'flaw-1', description: 'EU Cloud Run instances must cross the Atlantic to reach the US-only database, adding 100-150ms latency', severity: 'high', fix: 'Use Cloud Spanner for global consistency or Cloud SQL with read replicas in europe-west1.', missingService: 'Cloud Spanner or Read Replicas' },
            { id: 'flaw-2', description: 'No failover region for the database — single point of failure', severity: 'high', fix: 'Enable Cloud SQL high availability with a failover replica in a different zone, or migrate to Cloud Spanner for multi-region.', missingService: 'HA Failover' },
        ],
        questions: [
            { question: 'What is the main problem with this architecture for EU users?', options: ['No CDN', 'Cross-region database latency', 'Missing firewall rules', 'No autoscaling'], answer: 1, explanation: 'EU users\' requests are processed locally by Cloud Run in europe-west1, but every DB query must cross the Atlantic to us-central1, adding 100-150ms per query.' },
            { question: 'Which GCP service provides globally consistent, multi-region database?', options: ['Cloud SQL', 'Cloud Spanner', 'Firestore', 'Memorystore'], answer: 1, explanation: 'Cloud Spanner is the only GCP database offering synchronous multi-region replication with strong consistency.' },
            { question: 'What happens if us-central1 has an outage?', options: ['Traffic shifts to EU automatically', 'EU service continues but DB is down', 'Everything fails', 'Read replicas take over'], answer: 2, explanation: 'With only a single-region database and no failover, both US and EU services lose database access, causing a complete outage.' },
        ],
    },
    {
        id: 'no-autoscaling',
        title: 'Fixed-Size Compute Without Autoscaling',
        difficulty: 'Beginner',
        description: 'An API service runs on a fixed number of VMs with no autoscaling during traffic spikes.',
        nodes: [
            { id: 'clients', label: 'API Clients', type: 'external', x: 50, y: 150 },
            { id: 'lb', label: 'Cloud LB', type: 'networking', x: 200, y: 150 },
            { id: 'vm1', label: 'VM 1', type: 'compute', x: 400, y: 80 },
            { id: 'vm2', label: 'VM 2', type: 'compute', x: 400, y: 150, flaw: true },
            { id: 'vm3', label: 'VM 3', type: 'compute', x: 400, y: 220 },
            { id: 'db', label: 'Cloud SQL', type: 'database', x: 600, y: 150 },
        ],
        connections: [
            { from: 'clients', to: 'lb' },
            { from: 'lb', to: 'vm1' },
            { from: 'lb', to: 'vm2' },
            { from: 'lb', to: 'vm3' },
            { from: 'vm1', to: 'db' },
            { from: 'vm2', to: 'db' },
            { from: 'vm3', to: 'db' },
        ],
        flaws: [
            { id: 'flaw-1', description: 'Fixed instance count — cannot scale during traffic spikes or scale down during low traffic', severity: 'high', fix: 'Use a Managed Instance Group (MIG) with autoscaling based on CPU utilization or request count.', missingService: 'Managed Instance Group with Autoscaling' },
            { id: 'flaw-2', description: 'No monitoring or alerting for capacity issues', severity: 'medium', fix: 'Add Cloud Monitoring with CPU/memory alerts and uptime checks.', missingService: 'Cloud Monitoring' },
            { id: 'flaw-3', description: 'Consider serverless migration for unpredictable traffic', severity: 'low', fix: 'Evaluate migrating to Cloud Run for automatic scaling including scale-to-zero.', missingService: 'Cloud Run (alternative)' },
        ],
        questions: [
            { question: 'What happens when traffic exceeds the capacity of 3 VMs?', options: ['New VMs are added automatically', 'Requests get queued', 'Users experience errors and timeouts', 'Cloud LB buffers requests'], answer: 2, explanation: 'Without autoscaling, the fixed 3 VMs get overwhelmed. The LB cannot create new VMs — it can only distribute to existing healthy backends.' },
            { question: 'What GCP feature should manage the VM count automatically?', options: ['Cloud Scheduler', 'Managed Instance Group', 'Cloud Tasks', 'Deployment Manager'], answer: 1, explanation: 'Managed Instance Groups with autoscaling policies can automatically add/remove VMs based on load metrics.' },
        ],
    },
    {
        id: 'no-encryption',
        title: 'Missing Encryption and Secrets Management',
        difficulty: 'Intermediate',
        description: 'An application stores API keys in environment variables and connects to the database without SSL.',
        nodes: [
            { id: 'run', label: 'Cloud Run\n(env vars with secrets)', type: 'compute', x: 100, y: 150, flaw: true },
            { id: 'sql', label: 'Cloud SQL\n(no SSL required)', type: 'database', x: 350, y: 80, flaw: true },
            { id: 'gcs', label: 'Cloud Storage\n(CMEK not enabled)', type: 'storage', x: 350, y: 220, flaw: true },
            { id: 'api', label: 'External API\n(key in env var)', type: 'external', x: 600, y: 150 },
        ],
        connections: [
            { from: 'run', to: 'sql', flaw: true },
            { from: 'run', to: 'gcs' },
            { from: 'run', to: 'api' },
        ],
        flaws: [
            { id: 'flaw-1', description: 'API keys stored as plain-text environment variables instead of Secret Manager', severity: 'high', fix: 'Move all secrets to Secret Manager and mount them as volumes in Cloud Run.', missingService: 'Secret Manager' },
            { id: 'flaw-2', description: 'Database connection not using SSL/TLS', severity: 'high', fix: 'Enable SSL on Cloud SQL and require SSL connections from the application.', missingService: 'SSL/TLS' },
            { id: 'flaw-3', description: 'Cloud Storage not using Customer-Managed Encryption Keys', severity: 'medium', fix: 'Enable CMEK using Cloud KMS for Cloud Storage buckets containing sensitive data.', missingService: 'Cloud KMS' },
        ],
        questions: [
            { question: 'Where should API keys and database passwords be stored?', options: ['Environment variables', 'Source code', 'Secret Manager', 'Cloud Storage'], answer: 2, explanation: 'Secret Manager provides versioned, audited, and access-controlled storage for sensitive configuration values.' },
            { question: 'What service provides Customer-Managed Encryption Keys?', options: ['Cloud IAM', 'Cloud KMS', 'Cloud Armor', 'Cloud HSM'], answer: 1, explanation: 'Cloud KMS manages encryption keys that can be used for CMEK across GCP services like Cloud Storage, BigQuery, and Cloud SQL.' },
        ],
    },
    {
        id: 'monolith-scaling',
        title: 'Monolith with Scaling Bottleneck',
        difficulty: 'Advanced',
        description: 'A monolithic application handles all workloads on a single oversized VM with no separation of concerns.',
        nodes: [
            { id: 'users', label: 'Users', type: 'external', x: 50, y: 150 },
            { id: 'monolith', label: 'Single VM\n(n1-highmem-32)\nWeb + API + Worker\n+ Cron', type: 'compute', x: 300, y: 150, flaw: true },
            { id: 'sql', label: 'Cloud SQL\n(oversized)', type: 'database', x: 550, y: 100 },
            { id: 'gcs', label: 'Cloud Storage', type: 'storage', x: 550, y: 200 },
        ],
        connections: [
            { from: 'users', to: 'monolith' },
            { from: 'monolith', to: 'sql' },
            { from: 'monolith', to: 'gcs' },
        ],
        flaws: [
            { id: 'flaw-1', description: 'Single monolithic VM is a single point of failure and scaling bottleneck', severity: 'high', fix: 'Decompose into microservices: web frontend on Cloud Run, API on Cloud Run, background workers on Cloud Tasks + Cloud Functions.' },
            { id: 'flaw-2', description: 'No load balancer — users connect directly to the VM', severity: 'high', fix: 'Add a Cloud Load Balancer for SSL termination, DDoS protection, and traffic distribution.' },
            { id: 'flaw-3', description: 'Cron jobs and workers consume compute resources needed for serving traffic', severity: 'medium', fix: 'Move cron jobs to Cloud Scheduler + Cloud Functions. Move workers to Cloud Tasks.' },
            { id: 'flaw-4', description: 'Cannot scale web and worker tiers independently', severity: 'high', fix: 'Separate into independently scalable services. Web tier can scale based on HTTP traffic, workers based on queue depth.' },
        ],
        questions: [
            { question: 'What is the biggest risk of running everything on a single VM?', options: ['Cost efficiency', 'Single point of failure', 'Network latency', 'Storage limits'], answer: 1, explanation: 'If the VM goes down, the entire application — web, API, workers, and cron — all become unavailable simultaneously.' },
            { question: 'Which GCP service is best for migrating cron jobs off the monolith?', options: ['Cloud Scheduler', 'Compute Engine', 'Cloud Composer', 'Cloud Batch'], answer: 0, explanation: 'Cloud Scheduler triggers Cloud Functions or HTTP endpoints on a cron schedule, replacing traditional VM-based cron jobs.' },
            { question: 'What pattern should be used to decompose the monolith?', options: ['Bigger VM', 'Microservices', 'Multi-region monolith', 'Vertical scaling'], answer: 1, explanation: 'Microservices decomposition allows each component to scale independently, fail independently, and use the most appropriate compute service.' },
        ],
    },
    {
        id: 'data-pipeline-gaps',
        title: 'Data Pipeline Without Error Handling',
        difficulty: 'Advanced',
        description: 'A streaming data pipeline has no dead letter queue, retry logic, or data validation.',
        nodes: [
            { id: 'source', label: 'IoT Devices', type: 'external', x: 50, y: 150 },
            { id: 'pubsub', label: 'Pub/Sub', type: 'data', x: 200, y: 150 },
            { id: 'dataflow', label: 'Dataflow', type: 'data', x: 400, y: 150, flaw: true },
            { id: 'bq', label: 'BigQuery', type: 'data', x: 600, y: 150 },
        ],
        connections: [
            { from: 'source', to: 'pubsub' },
            { from: 'pubsub', to: 'dataflow' },
            { from: 'dataflow', to: 'bq' },
        ],
        flaws: [
            { id: 'flaw-1', description: 'No dead letter topic for failed messages', severity: 'high', fix: 'Configure a dead letter topic on the Pub/Sub subscription. Messages that fail processing after max retries are sent to the DLT for investigation.' },
            { id: 'flaw-2', description: 'No data validation or schema enforcement', severity: 'medium', fix: 'Add a schema to the Pub/Sub topic and validation logic in the Dataflow pipeline to catch malformed data before it reaches BigQuery.' },
            { id: 'flaw-3', description: 'No monitoring on pipeline lag or error rate', severity: 'medium', fix: 'Add Cloud Monitoring alerts for Pub/Sub subscription backlog size and Dataflow job error rates.' },
        ],
        questions: [
            { question: 'What happens to messages that fail processing in Dataflow?', options: ['They are retried forever', 'They are dropped silently', 'They go to a dead letter topic', 'They block the pipeline'], answer: 1, explanation: 'Without a dead letter topic configured, failed messages are eventually dropped after max retries, losing data silently.' },
            { question: 'How should you handle malformed IoT data?', options: ['Ignore it', 'Schema validation at Pub/Sub', 'Bigger BigQuery tables', 'Manual review'], answer: 1, explanation: 'Pub/Sub supports schema validation to reject malformed messages before they enter the pipeline, preventing downstream errors.' },
        ],
    },
]
