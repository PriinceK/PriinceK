export const SERVICE_DEEP_DIVES = [
  {
    id: 'compute-engine',
    name: 'Compute Engine',
    category: 'compute',
    tagline: 'Virtual machines running on Google\'s infrastructure',
    overview: `Compute Engine delivers configurable virtual machines running on Google's infrastructure. You can launch VMs with your choice of OS, machine type, and storage — from single-core micro instances to massive multi-GPU machines for ML workloads.\n\nCompute Engine supports live migration, automatic restart, custom and predefined machine types, sole-tenant nodes, and preemptible/spot VMs for cost savings. It integrates tightly with VPC networking, Cloud Load Balancing, and managed instance groups for auto-scaling.\n\nFor the ACE exam, understand when to pick Compute Engine over GKE, Cloud Run, or App Engine. Compute Engine is the right choice when you need full control over the OS, custom kernel modules, or specific hardware (GPUs/TPUs).`,
    keyFeatures: [
      'Predefined, custom, and shared-core machine types',
      'Live migration keeps VMs running during host maintenance',
      'Preemptible and Spot VMs offer up to 91% discount',
      'Managed instance groups with autoscaling and autohealing',
      'Persistent disks (SSD & standard) and local SSDs',
    ],
    useCases: [
      {
        title: 'Lift-and-Shift Migration',
        description: 'Migrate existing on-premises VMs to the cloud with minimal changes using Migrate for Compute Engine.',
        services: ['Compute Engine', 'Cloud Storage', 'VPC'],
      },
      {
        title: 'High-Performance Computing',
        description: 'Run large-scale simulations, genomics pipelines, or rendering workloads using custom machine types with many vCPUs and high memory.',
        services: ['Compute Engine', 'Filestore', 'Cloud Storage'],
      },
      {
        title: 'GPU/ML Training',
        description: 'Attach NVIDIA GPUs or TPUs for machine learning training jobs that need full OS-level control.',
        services: ['Compute Engine', 'Cloud Storage', 'Vertex AI'],
      },
    ],
    pricing: {
      model: 'Per-second billing (minimum 1 minute). Price depends on machine type, region, and OS. Sustained-use discounts apply automatically.',
      tiers: [
        'On-demand: Full price, pay per second',
        'Committed use: 1- or 3-year commitments for up to 57% discount',
        'Preemptible/Spot: Up to 91% discount, can be reclaimed anytime',
        'Sustained use: Automatic discounts for running VMs 25%+ of the month',
      ],
      tips: [
        'Use Spot VMs for fault-tolerant batch workloads',
        'Right-size VMs using Recommender — most are over-provisioned',
        'Schedule non-prod VMs to stop during off-hours',
        'Use committed use discounts for stable production workloads',
      ],
    },
    vsAlternatives: [
      { service: 'GKE', comparison: 'Use GKE when running containers at scale with orchestration. Use Compute Engine for VM-level control or non-containerized workloads.' },
      { service: 'Cloud Run', comparison: 'Cloud Run is fully managed and auto-scales to zero. Choose Compute Engine when you need persistent VMs, GPUs, or custom OS configurations.' },
      { service: 'App Engine', comparison: 'App Engine is a PaaS that auto-manages infrastructure. Prefer Compute Engine when you need SSH access, custom networking, or specific OS packages.' },
    ],
    gotchas: [
      'Preemptible VMs last at most 24 hours and can be reclaimed with 30 seconds notice — always handle graceful shutdown.',
      'Default service account has Editor role on all project resources — follow least-privilege by using custom service accounts.',
      'External IPs are ephemeral by default. Reserve a static IP if you need it to persist across restarts.',
      'Persistent disk performance scales with disk size — a 10 GB PD-SSD is much slower than a 500 GB one.',
      'Live migration doesn\'t apply to VMs with GPUs or local SSDs — they will be terminated during maintenance events.',
    ],
    quiz: [
      {
        question: 'Which discount type is applied automatically without any commitment?',
        options: [
          { text: 'Committed use discount', correct: false, explanation: 'Committed use discounts require a 1- or 3-year commitment.' },
          { text: 'Sustained use discount', correct: true, explanation: 'Sustained use discounts are applied automatically when a VM runs for more than 25% of the month.' },
          { text: 'Preemptible discount', correct: false, explanation: 'Preemptible VMs are a separate VM type, not an automatic discount on regular VMs.' },
        ],
      },
      {
        question: 'What happens to a Compute Engine VM during a host maintenance event by default?',
        options: [
          { text: 'It is terminated and restarted', correct: false, explanation: 'By default, VMs are live-migrated, not terminated.' },
          { text: 'It is live-migrated to another host', correct: true, explanation: 'Live migration transparently moves VMs to another host with no reboot required.' },
          { text: 'It is stopped until maintenance completes', correct: false, explanation: 'VMs are live-migrated, not paused.' },
        ],
      },
      {
        question: 'Which machine type should you choose for a workload that needs 96 vCPUs and 200 GB RAM?',
        options: [
          { text: 'e2-standard-96', correct: false, explanation: 'E2 standard provides a fixed memory-to-CPU ratio. 96 vCPUs gives 384 GB RAM — more than needed and possibly not available.' },
          { text: 'Custom machine type', correct: true, explanation: 'Custom machine types let you specify exact vCPU and memory combinations to avoid over-provisioning.' },
          { text: 'n2-highmem-96', correct: false, explanation: 'Highmem gives even more RAM per CPU than needed. A custom type is more cost-effective.' },
        ],
      },
    ],
  },
  {
    id: 'cloud-run',
    name: 'Cloud Run',
    category: 'serverless',
    tagline: 'Fully managed serverless platform for containerized applications',
    overview: `Cloud Run is a fully managed compute platform that lets you run stateless containers triggered by HTTP requests, Pub/Sub events, or on a schedule. It abstracts away all infrastructure management while giving you the flexibility of containers.\n\nCloud Run automatically scales from zero to thousands of instances based on traffic, and you only pay for the resources consumed during request processing. It supports any language, library, or binary — if it fits in a container, it runs on Cloud Run.\n\nFor the ACE exam, Cloud Run is the go-to answer for containerized stateless workloads that need auto-scaling, fast deployment, and minimal ops overhead.`,
    keyFeatures: [
      'Scale to zero — pay nothing when idle',
      'Any language or framework via container images',
      'Automatic HTTPS endpoints with custom domain support',
      'Revision-based traffic splitting for canary deployments',
      'Integrated with Cloud Build, Artifact Registry, and IAM',
    ],
    useCases: [
      {
        title: 'REST APIs & Microservices',
        description: 'Deploy containerized APIs that scale automatically with request volume, with zero infrastructure management.',
        services: ['Cloud Run', 'Cloud SQL', 'Secret Manager'],
      },
      {
        title: 'Event-Driven Processing',
        description: 'Process Pub/Sub messages, Cloud Storage events, or Eventarc triggers in a serverless container.',
        services: ['Cloud Run', 'Pub/Sub', 'Eventarc', 'Cloud Storage'],
      },
      {
        title: 'Scheduled Jobs',
        description: 'Run periodic tasks using Cloud Run Jobs triggered by Cloud Scheduler.',
        services: ['Cloud Run', 'Cloud Scheduler'],
      },
    ],
    pricing: {
      model: 'Pay per use — billed for CPU, memory, and requests only while handling requests (or always-on if configured).',
      tiers: [
        'Free tier: 2 million requests/month, 360,000 GiB-seconds memory, 180,000 vCPU-seconds',
        'CPU: $0.00002400 per vCPU-second',
        'Memory: $0.00000250 per GiB-second',
        'Requests: $0.40 per million',
      ],
      tips: [
        'Use minimum instances = 0 for dev/staging to avoid costs when idle',
        'Set concurrency > 1 (default 80) to handle multiple requests per instance',
        'Use CPU allocation "only during request processing" for HTTP workloads to minimize costs',
        'Committed use discounts apply to always-allocated Cloud Run instances',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud Functions', comparison: 'Cloud Functions is limited to supported runtimes and single-purpose functions. Cloud Run supports any container with more flexibility.' },
      { service: 'GKE', comparison: 'GKE gives full Kubernetes control but requires cluster management. Cloud Run is simpler for stateless HTTP workloads.' },
      { service: 'App Engine', comparison: 'App Engine Flex also runs containers but has slower deployments and no scale-to-zero. Cloud Run is the modern replacement.' },
    ],
    gotchas: [
      'Cloud Run services are stateless — local file writes are lost between requests. Use Cloud Storage or a database for persistence.',
      'Default request timeout is 5 minutes (max 60 minutes). Long-running jobs should use Cloud Run Jobs instead.',
      'Container must listen on the PORT environment variable (default 8080), not a hardcoded port.',
      'Cold starts can add latency. Set minimum instances > 0 for latency-sensitive production services.',
      'VPC connector is required to access private resources like Cloud SQL via private IP.',
    ],
    quiz: [
      {
        question: 'What is the maximum request timeout for a Cloud Run service?',
        options: [
          { text: '5 minutes', correct: false, explanation: '5 minutes is the default, but it can be extended.' },
          { text: '60 minutes', correct: true, explanation: 'Cloud Run services support a maximum timeout of 60 minutes per request.' },
          { text: '24 hours', correct: false, explanation: '24 hours is not supported. Cloud Run Jobs can run longer but services max at 60 minutes.' },
        ],
      },
      {
        question: 'How do you eliminate cold start latency in Cloud Run?',
        options: [
          { text: 'Use a smaller container image', correct: false, explanation: 'Smaller images help but don\'t eliminate cold starts entirely.' },
          { text: 'Set minimum instances greater than 0', correct: true, explanation: 'Minimum instances keeps warm instances ready, eliminating cold starts for initial requests.' },
          { text: 'Enable HTTP/2', correct: false, explanation: 'HTTP/2 improves connection reuse but doesn\'t affect cold starts.' },
        ],
      },
    ],
  },
  {
    id: 'gke',
    name: 'Google Kubernetes Engine',
    category: 'compute',
    tagline: 'Managed Kubernetes for deploying and scaling containerized applications',
    overview: `Google Kubernetes Engine (GKE) provides a managed environment for deploying, managing, and scaling containerized applications using Google infrastructure and Kubernetes.\n\nGKE offers two modes: Standard (you manage node pools) and Autopilot (Google manages everything including nodes). It handles cluster provisioning, upgrades, scaling, monitoring, and security — while giving you full Kubernetes API compatibility.\n\nFor the ACE exam, choose GKE when you need container orchestration with features like service mesh, advanced networking policies, stateful workloads, or multi-container pods. It's the middle ground between full IaaS (Compute Engine) and fully managed serverless (Cloud Run).`,
    keyFeatures: [
      'Autopilot mode for fully managed nodes and pod-level billing',
      'Auto-scaling at both node and pod levels (HPA, VPA, cluster autoscaler)',
      'Integrated with Cloud Logging, Monitoring, and Binary Authorization',
      'Multi-cluster management with GKE Enterprise (Anthos)',
      'Workload Identity for secure pod-to-GCP-service authentication',
    ],
    useCases: [
      {
        title: 'Microservices Architecture',
        description: 'Run dozens of interdependent microservices with service discovery, load balancing, and rolling updates managed by Kubernetes.',
        services: ['GKE', 'Cloud SQL', 'Memorystore', 'Cloud Armor'],
      },
      {
        title: 'Stateful Applications',
        description: 'Deploy databases, message queues, or other stateful workloads with persistent volumes and StatefulSets.',
        services: ['GKE', 'Persistent Disk', 'Cloud Storage'],
      },
      {
        title: 'CI/CD Pipelines',
        description: 'Use GKE as the deployment target for Cloud Build pipelines with rolling updates and canary deployments.',
        services: ['GKE', 'Cloud Build', 'Artifact Registry'],
      },
    ],
    pricing: {
      model: 'Standard: free control plane + pay for nodes. Autopilot: pay per pod resource request. Both modes bill for compute, storage, and networking.',
      tiers: [
        'Standard cluster management: Free (one zonal), $0.10/hr for regional',
        'Autopilot: $0.10/hr management fee + per-pod vCPU/memory/storage',
        'Node compute: Same as Compute Engine pricing',
        'GKE Enterprise: Additional per-vCPU fee for advanced features',
      ],
      tips: [
        'Use Autopilot to avoid paying for unused node capacity',
        'Enable cluster autoscaler to right-size node pools',
        'Use Spot VMs for fault-tolerant workloads in Standard mode',
        'Set resource requests and limits on all pods to enable efficient bin-packing',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud Run', comparison: 'Cloud Run is simpler and scales to zero. Use GKE when you need Kubernetes features like StatefulSets, DaemonSets, or custom networking.' },
      { service: 'Compute Engine', comparison: 'Compute Engine provides raw VMs. Use GKE when you want container orchestration, service discovery, and declarative deployments.' },
    ],
    gotchas: [
      'Standard mode charges for idle node capacity even if pods aren\'t using it — consider Autopilot for better cost efficiency.',
      'Workload Identity should always be used instead of node service accounts for security best practices.',
      'GKE master upgrades happen automatically and can briefly disrupt API access — plan maintenance windows.',
      'Default pod-to-pod communication is unrestricted — use Network Policies to enforce microsegmentation.',
    ],
    quiz: [
      {
        question: 'What is the key difference between GKE Standard and Autopilot modes?',
        options: [
          { text: 'Autopilot doesn\'t support persistent volumes', correct: false, explanation: 'Autopilot supports persistent volumes. The key difference is node management.' },
          { text: 'Autopilot manages nodes automatically and bills per pod', correct: true, explanation: 'In Autopilot, Google manages node provisioning and you pay only for pod resource requests.' },
          { text: 'Standard mode doesn\'t support auto-scaling', correct: false, explanation: 'Standard mode supports cluster autoscaler and HPA/VPA.' },
        ],
      },
      {
        question: 'What is the recommended way for GKE pods to authenticate to GCP services?',
        options: [
          { text: 'Store service account keys in Kubernetes secrets', correct: false, explanation: 'Service account keys are a security risk. Workload Identity is the recommended approach.' },
          { text: 'Use the node\'s default service account', correct: false, explanation: 'Node service accounts give all pods on the node the same permissions, violating least privilege.' },
          { text: 'Use Workload Identity', correct: true, explanation: 'Workload Identity maps Kubernetes service accounts to GCP service accounts without managing keys.' },
        ],
      },
    ],
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage',
    category: 'storage',
    tagline: 'Unified object storage for any amount of data',
    overview: `Cloud Storage is a globally durable object store for any amount of unstructured data — images, videos, backups, logs, data lake files, and more. Objects are stored in buckets and accessed via HTTP or client libraries.\n\nIt offers four storage classes (Standard, Nearline, Coldline, Archive) with identical APIs but different pricing and access patterns. Data is redundant across zones or regions depending on bucket location type.\n\nFor the ACE exam, Cloud Storage appears in nearly every scenario. Know the storage classes, lifecycle policies, IAM vs ACLs, signed URLs, and when to use it vs Filestore, Persistent Disk, or Cloud SQL.`,
    keyFeatures: [
      'Four storage classes: Standard, Nearline, Coldline, Archive',
      'Object Lifecycle Management for automatic class transitions and deletion',
      'Object Versioning to protect against accidental deletes',
      'Signed URLs for time-limited access without authentication',
      'Strong global consistency for read-after-write operations',
    ],
    useCases: [
      {
        title: 'Static Website Hosting',
        description: 'Host static assets directly from a Cloud Storage bucket with a Cloud CDN frontend for global distribution.',
        services: ['Cloud Storage', 'Cloud CDN', 'Cloud Load Balancing'],
      },
      {
        title: 'Data Lake',
        description: 'Store raw and processed data at scale for analytics with BigQuery, Dataflow, and Dataproc.',
        services: ['Cloud Storage', 'BigQuery', 'Dataflow'],
      },
      {
        title: 'Backup & Disaster Recovery',
        description: 'Store backups in Nearline or Coldline storage with lifecycle policies to move to Archive after retention periods.',
        services: ['Cloud Storage', 'Transfer Service'],
      },
    ],
    pricing: {
      model: 'Pay for storage (per GB/month), operations (per 10K), network egress, and early deletion fees for Nearline/Coldline/Archive.',
      tiers: [
        'Standard: ~$0.020/GB/month (frequently accessed)',
        'Nearline: ~$0.010/GB/month (accessed < once per 30 days)',
        'Coldline: ~$0.004/GB/month (accessed < once per 90 days)',
        'Archive: ~$0.0012/GB/month (accessed < once per year)',
      ],
      tips: [
        'Use Object Lifecycle Management to auto-transition data to cheaper classes',
        'Choose regional buckets for compute co-location, dual/multi-region for availability',
        'Nearline has a 30-day minimum storage duration — don\'t use it for short-lived data',
        'Avoid many small files — operations costs add up; batch when possible',
      ],
    },
    vsAlternatives: [
      { service: 'Persistent Disk', comparison: 'Persistent Disk is block storage for VMs. Cloud Storage is object storage accessed via HTTP — not mountable as a filesystem (without FUSE).' },
      { service: 'Filestore', comparison: 'Filestore is managed NFS for shared file access. Use Cloud Storage for web-accessible object storage at scale.' },
      { service: 'Cloud SQL', comparison: 'Cloud SQL is for structured relational data. Use Cloud Storage for unstructured data like images, logs, and backups.' },
    ],
    gotchas: [
      'Bucket names are globally unique across all GCP projects — choose carefully as they cannot be renamed.',
      'Nearline, Coldline, and Archive have minimum storage durations (30, 90, 365 days). You pay early deletion fees if objects are removed sooner.',
      'Uniform bucket-level access is recommended over ACLs for simpler IAM management.',
      'Object names are flat — "folders" are just prefixes with slashes. There\'s no real directory structure.',
      'Requester Pays buckets shift egress costs to the requester — useful for public datasets.',
    ],
    quiz: [
      {
        question: 'Which storage class has a minimum storage duration of 365 days?',
        options: [
          { text: 'Coldline', correct: false, explanation: 'Coldline has a 90-day minimum storage duration.' },
          { text: 'Nearline', correct: false, explanation: 'Nearline has a 30-day minimum storage duration.' },
          { text: 'Archive', correct: true, explanation: 'Archive storage has a 365-day minimum storage duration and the lowest per-GB cost.' },
        ],
      },
      {
        question: 'What is the recommended access control method for Cloud Storage buckets?',
        options: [
          { text: 'ACLs on individual objects', correct: false, explanation: 'ACLs are legacy and harder to manage at scale.' },
          { text: 'Uniform bucket-level access with IAM', correct: true, explanation: 'Uniform bucket-level access disables ACLs and uses IAM exclusively for simpler, consistent access control.' },
          { text: 'Signed URLs for all access', correct: false, explanation: 'Signed URLs are for temporary access, not permanent access control.' },
        ],
      },
    ],
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    category: 'data',
    tagline: 'Serverless, highly scalable enterprise data warehouse',
    overview: `BigQuery is Google's fully managed, serverless data warehouse that enables super-fast SQL queries against petabyte-scale datasets. It separates storage and compute, allowing independent scaling and cost optimization.\n\nBigQuery supports standard SQL, streaming inserts, ML directly in SQL (BigQuery ML), BI Engine for fast dashboards, and federated queries to external data sources like Cloud Storage and Cloud SQL.\n\nFor the ACE exam, know BigQuery's pricing models (on-demand vs flat-rate), partitioning and clustering for cost optimization, and when to use BigQuery vs Cloud SQL vs Bigtable.`,
    keyFeatures: [
      'Serverless — no infrastructure to provision or manage',
      'Separate storage and compute for independent scaling',
      'Built-in ML with BigQuery ML (no data movement needed)',
      'Streaming inserts for real-time data ingestion',
      'Federated queries across Cloud Storage, Drive, and Cloud SQL',
    ],
    useCases: [
      {
        title: 'Enterprise Data Warehouse',
        description: 'Centralize data from multiple sources for business intelligence and reporting using standard SQL.',
        services: ['BigQuery', 'Dataflow', 'Looker', 'Cloud Storage'],
      },
      {
        title: 'Real-Time Analytics',
        description: 'Stream events via Pub/Sub and Dataflow into BigQuery for near real-time dashboards and alerting.',
        services: ['BigQuery', 'Pub/Sub', 'Dataflow'],
      },
      {
        title: 'Machine Learning on Warehouse Data',
        description: 'Build and deploy ML models directly in BigQuery using SQL with BigQuery ML — no data export needed.',
        services: ['BigQuery', 'BigQuery ML', 'Vertex AI'],
      },
    ],
    pricing: {
      model: 'Separate pricing for storage and queries. On-demand query pricing charges per TB scanned; flat-rate pricing provides dedicated slot capacity.',
      tiers: [
        'Free tier: 1 TB queries/month, 10 GB storage/month',
        'Active storage: ~$0.020/GB/month',
        'Long-term storage (90+ days untouched): ~$0.010/GB/month',
        'On-demand queries: $5.00/TB scanned',
        'Editions (flat-rate): Starting at $0.04/slot-hour',
      ],
      tips: [
        'Always preview queries to check bytes scanned before running',
        'Use partitioned and clustered tables to reduce query costs dramatically',
        'Avoid SELECT * — specify only needed columns',
        'Set up custom cost controls with per-user and per-project query quotas',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud SQL', comparison: 'Cloud SQL is a transactional (OLTP) database for app backends. BigQuery is for analytics (OLAP) on large datasets.' },
      { service: 'Bigtable', comparison: 'Bigtable is a NoSQL wide-column store for high-throughput, low-latency key-value access. BigQuery is for complex SQL analytics.' },
      { service: 'Dataproc', comparison: 'Dataproc runs Hadoop/Spark for custom ETL. BigQuery handles analytics directly with SQL — no cluster management.' },
    ],
    gotchas: [
      'On-demand queries charge for ALL bytes scanned, even if your query only returns a few rows. Use LIMIT only to limit output, not cost.',
      'Streaming inserts have a cost ($0.010 per 200 MB) and a brief buffer before data is queryable.',
      'Query results are cached for 24 hours (free), but only for identical queries with no non-deterministic functions.',
      'DML (UPDATE/DELETE) operations scan the entire table partition — they can be expensive on large tables.',
    ],
    quiz: [
      {
        question: 'What is the most effective way to reduce BigQuery on-demand query costs?',
        options: [
          { text: 'Add LIMIT clauses to queries', correct: false, explanation: 'LIMIT reduces output rows but BigQuery still scans the same amount of data.' },
          { text: 'Use partitioned and clustered tables', correct: true, explanation: 'Partitioning and clustering reduce the amount of data scanned, directly reducing costs.' },
          { text: 'Use streaming inserts instead of batch loads', correct: false, explanation: 'Streaming inserts actually cost more. Batch loads are free.' },
        ],
      },
      {
        question: 'How is BigQuery storage priced after 90 days of no modifications?',
        options: [
          { text: 'It becomes free', correct: false, explanation: 'Long-term storage is cheaper but not free.' },
          { text: 'The price drops to approximately half', correct: true, explanation: 'After 90 days without edits, storage automatically moves to long-term pricing at ~50% discount.' },
          { text: 'You must manually move it to a cheaper tier', correct: false, explanation: 'The transition to long-term pricing is automatic — no action needed.' },
        ],
      },
    ],
  },
  {
    id: 'pub-sub',
    name: 'Pub/Sub',
    category: 'data',
    tagline: 'Global real-time messaging and event ingestion service',
    overview: `Cloud Pub/Sub is a fully managed, real-time messaging service that allows you to send and receive messages between independent applications. It decouples senders (publishers) from receivers (subscribers), enabling asynchronous communication.\n\nPub/Sub supports both push and pull delivery, exactly-once processing, message ordering, dead-letter topics, and schema validation. It scales automatically to handle millions of messages per second.\n\nFor the ACE exam, Pub/Sub is the answer whenever you see "decouple," "asynchronous," "event-driven," or "streaming" in a scenario. Know the difference between push and pull subscriptions.`,
    keyFeatures: [
      'At-least-once delivery with exactly-once processing option',
      'Push (HTTP webhook) and pull (client polls) subscription types',
      'Dead-letter topics for failed message handling',
      'Message ordering with ordering keys',
      'Schema validation with Avro and Protocol Buffers',
    ],
    useCases: [
      {
        title: 'Event-Driven Microservices',
        description: 'Decouple services by publishing events to topics and letting subscribers process them independently.',
        services: ['Pub/Sub', 'Cloud Run', 'Cloud Functions'],
      },
      {
        title: 'Streaming Data Pipeline',
        description: 'Ingest high-volume event streams from IoT devices, clickstreams, or logs into BigQuery via Dataflow.',
        services: ['Pub/Sub', 'Dataflow', 'BigQuery'],
      },
      {
        title: 'Fan-Out Notifications',
        description: 'Publish a single event and have multiple subscribers process it differently (email, SMS, analytics, logging).',
        services: ['Pub/Sub', 'Cloud Functions', 'Cloud Run'],
      },
    ],
    pricing: {
      model: 'Pay per data volume published and delivered. Includes message storage costs for retained messages.',
      tiers: [
        'Free tier: 10 GB/month',
        'Message delivery: $40/TiB',
        'Seek-related message storage: $0.27/GiB-month',
        'Snapshot message backlog storage: $0.27/GiB-month',
      ],
      tips: [
        'Batch messages to reduce overhead and cost',
        'Use message filtering on subscriptions to avoid unnecessary delivery',
        'Set appropriate message retention (default 7 days) — don\'t retain longer than needed',
        'Use Pub/Sub Lite for high-volume, single-zone workloads at lower cost',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud Tasks', comparison: 'Cloud Tasks is for one-to-one task dispatch with rate limiting. Pub/Sub supports one-to-many fan-out messaging.' },
      { service: 'Eventarc', comparison: 'Eventarc uses Pub/Sub under the hood but adds event routing from GCP services to Cloud Run/Functions with less configuration.' },
    ],
    gotchas: [
      'Messages are delivered at least once — your subscriber must be idempotent to handle duplicates.',
      'Unacknowledged messages are redelivered after the acknowledgment deadline (default 10 seconds).',
      'Message ordering requires an ordering key and is per-subscription, not per-topic.',
      'Pull subscribers must actively acknowledge messages or they\'ll be redelivered, potentially causing duplicates.',
      'Maximum message size is 10 MB — use Cloud Storage for larger payloads and send a reference via Pub/Sub.',
    ],
    quiz: [
      {
        question: 'What is the maximum size of a single Pub/Sub message?',
        options: [
          { text: '1 MB', correct: false, explanation: 'The limit is larger than 1 MB.' },
          { text: '10 MB', correct: true, explanation: 'Pub/Sub supports messages up to 10 MB. For larger payloads, store data in Cloud Storage and send a reference.' },
          { text: '100 MB', correct: false, explanation: 'Messages are limited to 10 MB. Use Cloud Storage for larger payloads.' },
        ],
      },
      {
        question: 'Which subscription type should you use when the subscriber is a Cloud Run service?',
        options: [
          { text: 'Pull subscription', correct: false, explanation: 'Pull requires the subscriber to actively poll. Push is more natural for HTTP services.' },
          { text: 'Push subscription', correct: true, explanation: 'Push subscriptions send messages as HTTP POST requests to an endpoint — ideal for Cloud Run services.' },
          { text: 'Both work equally well', correct: false, explanation: 'While both work, push is the recommended pattern for Cloud Run as it triggers the service automatically.' },
        ],
      },
    ],
  },
  {
    id: 'cloud-functions',
    name: 'Cloud Functions',
    category: 'serverless',
    tagline: 'Event-driven serverless functions for lightweight compute tasks',
    overview: `Cloud Functions is a lightweight, event-driven serverless compute platform for running single-purpose functions in response to cloud events. It supports Node.js, Python, Go, Java, .NET, Ruby, and PHP.\n\nCloud Functions (2nd gen) is built on Cloud Run and offers improved performance, longer timeouts (up to 60 minutes), concurrency, and traffic splitting. 1st gen is simpler with faster cold starts but fewer features.\n\nFor the ACE exam, choose Cloud Functions for event-driven glue code — like processing a file upload to Cloud Storage, responding to Pub/Sub messages, or handling Firestore triggers. Choose Cloud Run when you need more control or longer-running processes.`,
    keyFeatures: [
      'Event-driven triggers from 90+ GCP and Firebase event sources',
      '2nd gen built on Cloud Run with concurrency and traffic splitting',
      'Automatic scaling from zero to thousands of instances',
      'Inline code editor in Cloud Console for quick prototyping',
      'VPC connector support for accessing private resources',
    ],
    useCases: [
      {
        title: 'File Processing',
        description: 'Automatically process files uploaded to Cloud Storage — generate thumbnails, extract text, or run virus scans.',
        services: ['Cloud Functions', 'Cloud Storage', 'Vision AI'],
      },
      {
        title: 'Webhook Handler',
        description: 'Receive and process webhooks from third-party services like GitHub, Stripe, or Slack.',
        services: ['Cloud Functions', 'Firestore', 'Secret Manager'],
      },
      {
        title: 'Lightweight API',
        description: 'Build simple API endpoints without managing infrastructure for small-scale or prototype applications.',
        services: ['Cloud Functions', 'Firestore'],
      },
    ],
    pricing: {
      model: 'Pay per invocation, compute time (GB-seconds and GHz-seconds), and networking. Generous free tier.',
      tiers: [
        'Free tier: 2 million invocations/month, 400,000 GB-seconds, 200,000 GHz-seconds',
        'Invocations: $0.40 per million',
        'Compute: $0.0000025 per GB-second, $0.0000100 per GHz-second',
        'Networking: $0.12 per GB outbound (5 GB free)',
      ],
      tips: [
        'Use minimum instances to reduce cold starts in production',
        'Choose the right memory size — CPU scales with memory allocation',
        'Avoid heavy initialization in the function handler — use global scope for reusable connections',
        'Consider 2nd gen for concurrency to handle multiple requests per instance',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud Run', comparison: 'Cloud Run supports any container and longer execution. Cloud Functions is simpler for small event-driven tasks.' },
      { service: 'App Engine', comparison: 'App Engine is for full web applications. Cloud Functions is for single-purpose event handlers.' },
    ],
    gotchas: [
      '1st gen has a 9-minute timeout; 2nd gen supports up to 60 minutes.',
      '1st gen processes one request per instance. 2nd gen supports concurrency — important for cost and performance.',
      'Cold starts can be significant for infrequent functions. Set min instances > 0 for production workloads.',
      'Dependencies are bundled at deploy time — large dependency trees increase deploy time and cold starts.',
      'Environment variables and Secret Manager are the correct ways to pass config — never hardcode secrets.',
    ],
    quiz: [
      {
        question: 'What is a key advantage of Cloud Functions 2nd gen over 1st gen?',
        options: [
          { text: 'Supports more programming languages', correct: false, explanation: 'Both generations support the same set of languages.' },
          { text: 'Supports concurrency (multiple requests per instance)', correct: true, explanation: '2nd gen is built on Cloud Run and supports processing multiple concurrent requests per instance.' },
          { text: 'Has a lower per-invocation cost', correct: false, explanation: 'Pricing is similar; the key advantage is concurrency and longer timeouts.' },
        ],
      },
      {
        question: 'What triggers a Cloud Function to execute?',
        options: [
          { text: 'Only HTTP requests', correct: false, explanation: 'Cloud Functions also support event triggers from Pub/Sub, Cloud Storage, Firestore, and more.' },
          { text: 'Cloud events from various GCP services or HTTP requests', correct: true, explanation: 'Cloud Functions can be triggered by HTTP requests or events from 90+ GCP and Firebase sources.' },
          { text: 'Only Pub/Sub messages', correct: false, explanation: 'Pub/Sub is one trigger source, but HTTP and many other event sources are also supported.' },
        ],
      },
    ],
  },
  {
    id: 'vpc',
    name: 'Virtual Private Cloud',
    category: 'networking',
    tagline: 'Global software-defined network for your GCP resources',
    overview: `VPC provides networking for your GCP resources — Compute Engine VMs, GKE clusters, Cloud SQL instances, and more. Unlike AWS, GCP VPCs are global by default with subnets that are regional.\n\nVPC supports custom and auto-mode subnet creation, firewall rules, routes, VPC peering, Shared VPC, Cloud NAT, Private Google Access, and VPC Service Controls. Understanding VPC is essential for nearly every GCP deployment.\n\nFor the ACE exam, know the VPC hierarchy (project → VPC → subnets → instances), firewall rule evaluation order, Shared VPC vs VPC Peering, and how Private Google Access works.`,
    keyFeatures: [
      'Global VPC with regional subnets — no cross-region peering needed',
      'Firewall rules with priority-based evaluation and service account targets',
      'Shared VPC for multi-project networking under a host project',
      'VPC peering for cross-organization network connectivity',
      'Private Google Access for reaching Google APIs without external IPs',
    ],
    useCases: [
      {
        title: 'Multi-Tier Application Network',
        description: 'Create separate subnets for web, app, and database tiers with firewall rules controlling traffic between them.',
        services: ['VPC', 'Cloud Load Balancing', 'Compute Engine', 'Cloud SQL'],
      },
      {
        title: 'Hybrid Cloud Connectivity',
        description: 'Connect on-premises networks to GCP using Cloud VPN or Cloud Interconnect through the VPC.',
        services: ['VPC', 'Cloud VPN', 'Cloud Interconnect', 'Cloud Router'],
      },
      {
        title: 'Shared VPC for Enterprise',
        description: 'Centralize network management with a host project while letting service projects deploy resources into shared subnets.',
        services: ['VPC', 'IAM', 'Cloud Resource Manager'],
      },
    ],
    pricing: {
      model: 'VPC itself is free. You pay for egress traffic, Cloud NAT, VPN tunnels, Interconnect, and load balancers.',
      tiers: [
        'VPC creation and subnets: Free',
        'Egress within same zone: Free',
        'Egress between zones (same region): $0.01/GB',
        'Egress between regions: $0.01-$0.08/GB',
        'Internet egress: $0.085-$0.12/GB (varies by destination)',
      ],
      tips: [
        'Co-locate communicating resources in the same zone for free networking',
        'Use Private Google Access to avoid egress charges for Google API traffic',
        'Audit unused external IPs — static IPs cost money when unattached',
        'Use VPC Flow Logs selectively — they generate Cloud Logging costs',
      ],
    },
    vsAlternatives: [
      { service: 'Shared VPC', comparison: 'Shared VPC centralizes network management. VPC Peering connects independent VPCs without sharing admin control.' },
      { service: 'Cloud VPN', comparison: 'Cloud VPN connects your VPC to external networks over the internet. Cloud Interconnect provides dedicated private connectivity.' },
    ],
    gotchas: [
      'Auto-mode VPCs create subnets in all regions automatically. Custom-mode gives you full control — recommended for production.',
      'Firewall rules are stateful (return traffic is allowed) and evaluated by priority (lowest number = highest priority).',
      'The default network has permissive firewall rules — delete it and create custom VPCs for production.',
      'VPC peering is non-transitive. If VPC-A peers with VPC-B and VPC-B peers with VPC-C, VPC-A cannot reach VPC-C.',
      'Subnet IP ranges cannot overlap within a VPC, and you cannot shrink a subnet range — only expand it.',
    ],
    quiz: [
      {
        question: 'What is the scope of a GCP VPC?',
        options: [
          { text: 'Regional — one VPC per region', correct: false, explanation: 'In GCP, VPCs are global. Subnets are regional.' },
          { text: 'Global — spans all regions with regional subnets', correct: true, explanation: 'GCP VPCs are global resources. Subnets within a VPC are regional.' },
          { text: 'Zonal — one VPC per zone', correct: false, explanation: 'VPCs are global, not zonal.' },
        ],
      },
      {
        question: 'What happens if two VPC firewall rules conflict?',
        options: [
          { text: 'The deny rule always wins', correct: false, explanation: 'Firewall rules are evaluated by priority number, not by allow/deny type.' },
          { text: 'The rule with the lowest priority number (highest priority) wins', correct: true, explanation: 'GCP firewall rules are evaluated from lowest to highest priority number. The first match wins.' },
          { text: 'Both rules are applied simultaneously', correct: false, explanation: 'Only the highest-priority matching rule is applied.' },
        ],
      },
    ],
  },
  {
    id: 'cloud-sql',
    name: 'Cloud SQL',
    category: 'storage',
    tagline: 'Fully managed relational database for MySQL, PostgreSQL, and SQL Server',
    overview: `Cloud SQL is a fully managed relational database service supporting MySQL, PostgreSQL, and SQL Server. Google handles provisioning, replication, backups, patches, and failover — you focus on your application.\n\nCloud SQL supports high availability with automatic failover, read replicas for scaling reads, point-in-time recovery, and integration with App Engine, Cloud Run, GKE, and Compute Engine via Cloud SQL Auth Proxy.\n\nFor the ACE exam, choose Cloud SQL for transactional (OLTP) relational workloads. Choose Cloud Spanner when you need global distribution, and BigQuery when you need analytics. Know how the Cloud SQL Auth Proxy works.`,
    keyFeatures: [
      'Supports MySQL, PostgreSQL, and SQL Server engines',
      'Automatic backups and point-in-time recovery',
      'High availability with automatic failover in the same region',
      'Read replicas for scaling read-heavy workloads',
      'Cloud SQL Auth Proxy for secure, IAM-based connections',
    ],
    useCases: [
      {
        title: 'Web Application Backend',
        description: 'Store user data, sessions, and application state in a managed MySQL or PostgreSQL database.',
        services: ['Cloud SQL', 'Cloud Run', 'Secret Manager'],
      },
      {
        title: 'Migration from On-Premises',
        description: 'Migrate existing MySQL or PostgreSQL databases to Cloud SQL using Database Migration Service.',
        services: ['Cloud SQL', 'Database Migration Service'],
      },
    ],
    pricing: {
      model: 'Pay for instance type (vCPUs + memory), storage, network egress, and HA/replica instances.',
      tiers: [
        'Instance: $0.0150-$0.4640/hr depending on vCPUs and memory',
        'Storage: $0.170/GB/month (SSD), $0.090/GB/month (HDD)',
        'Backups: $0.080/GB/month',
        'HA instance: ~2x the cost of a standalone instance',
      ],
      tips: [
        'Stop instances in non-production environments when not in use — storage still incurs charges',
        'Use connection pooling (like PgBouncer) to minimize connection overhead',
        'Right-size instances using Cloud SQL Recommender',
        'Use read replicas to offload read traffic instead of scaling up the primary',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud Spanner', comparison: 'Spanner is for globally distributed, horizontally scalable relational data. Cloud SQL is for regional workloads with standard database needs.' },
      { service: 'AlloyDB', comparison: 'AlloyDB is PostgreSQL-compatible with better performance for analytical + transactional mixed workloads. Cloud SQL is the standard managed option.' },
      { service: 'Firestore', comparison: 'Firestore is a serverless NoSQL document database. Use Cloud SQL for structured relational data with SQL queries.' },
    ],
    gotchas: [
      'Cloud SQL has a maximum storage size of 64 TB. For larger datasets, consider Spanner or BigQuery.',
      'HA failover can take 60-120 seconds. Applications must handle brief connection drops.',
      'Cloud SQL Auth Proxy is the recommended connection method — it handles SSL and IAM authentication automatically.',
      'Private IP requires a VPC peering setup. Plan your IP ranges to avoid conflicts.',
    ],
    quiz: [
      {
        question: 'What is the recommended way to connect to Cloud SQL from Cloud Run?',
        options: [
          { text: 'Use the public IP with SSL certificates', correct: false, explanation: 'While possible, the Cloud SQL Auth Proxy (built into Cloud Run) is the recommended approach.' },
          { text: 'Cloud SQL Auth Proxy via Unix socket', correct: true, explanation: 'Cloud Run has built-in Cloud SQL Auth Proxy support via Unix sockets — secure, IAM-authenticated connections with no manual SSL setup.' },
          { text: 'Direct private IP connection', correct: false, explanation: 'Private IP works but requires a VPC connector. The built-in Auth Proxy is simpler and recommended.' },
        ],
      },
      {
        question: 'When should you choose Cloud Spanner over Cloud SQL?',
        options: [
          { text: 'When you need a relational database', correct: false, explanation: 'Both are relational. The difference is scale and distribution.' },
          { text: 'When you need global distribution with strong consistency', correct: true, explanation: 'Spanner provides horizontal scaling and global distribution with strong consistency — capabilities Cloud SQL doesn\'t have.' },
          { text: 'When you need to save money', correct: false, explanation: 'Spanner is significantly more expensive than Cloud SQL.' },
        ],
      },
    ],
  },
  {
    id: 'spanner',
    name: 'Cloud Spanner',
    category: 'storage',
    tagline: 'Globally distributed, strongly consistent relational database',
    overview: `Cloud Spanner is a fully managed, horizontally scalable, globally distributed relational database service. It uniquely combines the benefits of relational structure (schemas, SQL, ACID transactions) with NoSQL-like horizontal scalability.\n\nSpanner uses Google's TrueTime API for external consistency — the strongest form of consistency available in a distributed database. It can handle millions of operations per second across multiple regions while maintaining full transactional consistency.\n\nFor the ACE exam, Spanner is the answer for globally distributed relational workloads that need strong consistency and horizontal scaling. It's expensive, so only recommend it when those specific requirements exist.`,
    keyFeatures: [
      'Horizontal scaling with automatic sharding',
      'Global distribution with strong external consistency via TrueTime',
      'Full SQL support with ACID transactions across regions',
      'Automatic replication and zero-downtime schema changes',
      '99.999% SLA for multi-region configurations',
    ],
    useCases: [
      {
        title: 'Global Financial System',
        description: 'Run financial ledgers and transaction processing across multiple regions with guaranteed consistency.',
        services: ['Cloud Spanner', 'Cloud Run', 'Cloud KMS'],
      },
      {
        title: 'Gaming Leaderboards',
        description: 'Maintain globally consistent leaderboards and player data for online games with millions of concurrent users.',
        services: ['Cloud Spanner', 'GKE', 'Memorystore'],
      },
    ],
    pricing: {
      model: 'Pay for provisioned compute (nodes or processing units), storage, and network. Minimum 1 node or 100 processing units.',
      tiers: [
        'Node: $0.90/hr (~$657/month) per node',
        'Processing unit: $0.0009/hr (100 PU = 1 node)',
        'Storage: $0.30/GB/month',
        'Multi-region replication incurs additional storage costs',
      ],
      tips: [
        'Use processing units instead of nodes for granular scaling below 1 node',
        'Design schema to avoid hotspots — don\'t use sequential primary keys',
        'Monitor CPU utilization — Spanner recommends staying below 65% for optimal performance',
        'Use interleaved tables to co-locate parent-child data for faster joins',
      ],
    },
    vsAlternatives: [
      { service: 'Cloud SQL', comparison: 'Cloud SQL is regional and vertically scaled — much cheaper for most workloads. Choose Spanner only for global scale or strong consistency requirements.' },
      { service: 'Bigtable', comparison: 'Bigtable is NoSQL for high-throughput key-value access. Spanner provides full SQL and ACID transactions.' },
    ],
    gotchas: [
      'Spanner is expensive — starting at ~$657/month for a single node. Don\'t use it when Cloud SQL suffices.',
      'Sequential primary keys (auto-increment IDs, timestamps) cause hotspots. Use UUIDs or bit-reversed sequences.',
      'Spanner doesn\'t support all PostgreSQL or MySQL features — test compatibility before migrating.',
      'Inter-region latency affects transaction performance. Design your schema for locality where possible.',
    ],
    quiz: [
      {
        question: 'What technology enables Cloud Spanner\'s external consistency?',
        options: [
          { text: 'Paxos consensus algorithm', correct: false, explanation: 'Spanner uses Paxos for replication, but TrueTime enables external consistency.' },
          { text: 'TrueTime API', correct: true, explanation: 'Google\'s TrueTime API provides globally synchronized clocks, enabling Spanner\'s external consistency guarantee.' },
          { text: 'Two-phase commit', correct: false, explanation: 'Two-phase commit is used for transactions, but TrueTime is what makes external consistency possible.' },
        ],
      },
      {
        question: 'Why should you avoid auto-incrementing primary keys in Spanner?',
        options: [
          { text: 'They\'re not supported', correct: false, explanation: 'Sequential keys are technically possible but cause performance problems.' },
          { text: 'They cause hotspots by directing writes to a single node', correct: true, explanation: 'Sequential keys concentrate writes on one split, creating hotspots. Use UUIDs or hashed keys for even distribution.' },
          { text: 'They consume more storage', correct: false, explanation: 'The issue is write distribution, not storage consumption.' },
        ],
      },
    ],
  },
  {
    id: 'iam',
    name: 'Identity and Access Management',
    category: 'security',
    tagline: 'Fine-grained access control for GCP resources',
    overview: `IAM lets you manage access control by defining who (identity) has what access (role) for which resource. It follows the principle of least privilege, allowing you to grant only the permissions needed.\n\nIAM uses a hierarchy: Organization → Folder → Project → Resource. Policies are inherited downward, and the effective policy is the union of all policies. IAM supports predefined roles, custom roles, service accounts, and conditional access.\n\nFor the ACE exam, IAM is fundamental. Know the difference between basic, predefined, and custom roles. Understand service accounts, Workload Identity, and the policy hierarchy. Remember that IAM is always "allow" — there's no explicit deny (except Organization Policy constraints).`,
    keyFeatures: [
      'Role-based access control with 1000+ predefined roles',
      'Resource hierarchy with policy inheritance',
      'Service accounts for application-to-service authentication',
      'IAM Conditions for attribute-based access control',
      'Organization policies for guardrails across the hierarchy',
    ],
    useCases: [
      {
        title: 'Multi-Team Access Control',
        description: 'Grant development, staging, and production project access with appropriate roles for each team.',
        services: ['IAM', 'Resource Manager', 'Cloud Identity'],
      },
      {
        title: 'Service-to-Service Authentication',
        description: 'Use service accounts with minimal permissions for applications to access GCP APIs securely.',
        services: ['IAM', 'Cloud Run', 'Cloud SQL', 'Secret Manager'],
      },
      {
        title: 'Conditional Access Policies',
        description: 'Restrict access based on attributes like IP address, time of day, or resource tags.',
        services: ['IAM', 'VPC Service Controls', 'Access Context Manager'],
      },
    ],
    pricing: {
      model: 'IAM itself is free. No charge for managing roles, policies, or service accounts.',
      tiers: [
        'IAM policies and roles: Free',
        'Service accounts: Free (limit of 100 per project)',
        'Audit logging of IAM changes: Cloud Logging costs apply',
        'Organization Policy: Free',
      ],
      tips: [
        'Use predefined roles whenever possible — they\'re maintained by Google',
        'Audit permissions regularly using IAM Recommender',
        'Avoid basic roles (Owner, Editor, Viewer) in production — they\'re too broad',
        'Use service account impersonation instead of downloading keys',
      ],
    },
    vsAlternatives: [
      { service: 'ACLs', comparison: 'ACLs are legacy per-object permissions (e.g., Cloud Storage). IAM is the recommended unified access control layer.' },
      { service: 'VPC Service Controls', comparison: 'VPC-SC creates security perimeters around GCP services. IAM controls who can access resources; VPC-SC controls where access comes from.' },
    ],
    gotchas: [
      'IAM policies are additive (union of all grants). You cannot explicitly deny a permission — only remove the grant.',
      'Basic roles (Owner/Editor/Viewer) grant thousands of permissions. Always prefer predefined roles.',
      'Service account keys are a security liability. Use Workload Identity or impersonation instead.',
      'Policy changes can take up to 60 seconds to propagate. Don\'t panic if a permission doesn\'t work immediately.',
      'The Editor role does NOT include IAM permission management — that requires the Owner role or specific IAM admin roles.',
    ],
    quiz: [
      {
        question: 'In GCP IAM, what happens when two policies grant different permissions to the same user?',
        options: [
          { text: 'The more restrictive policy wins', correct: false, explanation: 'IAM policies are additive, not restrictive.' },
          { text: 'The permissions are unioned — the user gets all granted permissions', correct: true, explanation: 'IAM is additive. The effective permissions are the union of all policies that apply to the user.' },
          { text: 'The policy closer to the resource wins', correct: false, explanation: 'Policies at all levels are combined, not overridden.' },
        ],
      },
      {
        question: 'What is the recommended alternative to service account keys?',
        options: [
          { text: 'OAuth 2.0 tokens', correct: false, explanation: 'While OAuth is used under the hood, the recommended approach is Workload Identity or impersonation.' },
          { text: 'Workload Identity Federation or service account impersonation', correct: true, explanation: 'Workload Identity eliminates the need for long-lived keys by mapping external or Kubernetes identities to GCP service accounts.' },
          { text: 'API keys', correct: false, explanation: 'API keys only identify the calling project, not authenticate the caller. They don\'t replace service accounts.' },
        ],
      },
    ],
  },
  {
    id: 'cloud-cdn',
    name: 'Cloud CDN',
    category: 'networking',
    tagline: 'Global content delivery network built on Google\'s edge infrastructure',
    overview: `Cloud CDN uses Google's globally distributed edge points of presence to cache HTTP(S) content close to users, reducing latency and backend load. It works with Cloud Load Balancing as the frontend.\n\nCloud CDN supports both Google Cloud Storage buckets and backend services (Compute Engine, GKE, Cloud Run) as origins. It offers cache invalidation, signed URLs/cookies, custom cache keys, and CDN-specific logging.\n\nFor the ACE exam, know that Cloud CDN requires an external HTTP(S) load balancer as the frontend. Understand cache hit vs miss, signed URLs for private content, and when CDN helps vs doesn't help (static vs dynamic content).`,
    keyFeatures: [
      'Global anycast with 100+ edge locations',
      'Automatic SSL/TLS termination at the edge',
      'Cache invalidation for stale content removal',
      'Signed URLs and signed cookies for access-controlled content',
      'Custom cache keys for fine-grained caching control',
    ],
    useCases: [
      {
        title: 'Static Asset Delivery',
        description: 'Serve images, CSS, JavaScript, and other static files from edge locations worldwide.',
        services: ['Cloud CDN', 'Cloud Storage', 'Cloud Load Balancing'],
      },
      {
        title: 'Video and Media Streaming',
        description: 'Deliver video content with low latency globally using cache-friendly chunked delivery.',
        services: ['Cloud CDN', 'Cloud Storage', 'Media CDN'],
      },
    ],
    pricing: {
      model: 'Pay for cache egress, cache fill (origin fetch), HTTP(S) requests, and cache invalidation.',
      tiers: [
        'Cache egress: $0.02-$0.20/GB (varies by region)',
        'Cache fill: $0.01-$0.08/GB',
        'HTTP requests: $0.0075 per 10K requests',
        'Cache invalidation: Free (up to rate limits)',
      ],
      tips: [
        'Set appropriate Cache-Control headers to maximize cache hit ratio',
        'Use Cloud CDN logs to monitor hit rate and optimize caching',
        'Combine with Cloud Storage for static content for best price/performance',
        'Use versioned URLs (file.v2.js) instead of cache invalidation for asset updates',
      ],
    },
    vsAlternatives: [
      { service: 'Media CDN', comparison: 'Media CDN is optimized for large-scale video/media delivery with advanced features. Cloud CDN is for general web content and APIs.' },
      { service: 'Firebase Hosting', comparison: 'Firebase Hosting includes CDN for static sites automatically. Cloud CDN is for more complex setups with load balancers.' },
    ],
    gotchas: [
      'Cloud CDN requires an external HTTP(S) load balancer — you cannot use it standalone.',
      'Dynamic, personalized content (e.g., user-specific data) should not be cached. Use cache bypass headers.',
      'Cache invalidation can take a few minutes to propagate to all edge locations.',
      'Signed URLs and cookies have different use cases — signed URLs for individual resources, signed cookies for multiple resources.',
    ],
    quiz: [
      {
        question: 'What is required to enable Cloud CDN?',
        options: [
          { text: 'A Cloud Storage bucket', correct: false, explanation: 'Cloud Storage is one possible backend, but the key requirement is a load balancer.' },
          { text: 'An external HTTP(S) load balancer', correct: true, explanation: 'Cloud CDN is enabled on backend services or buckets behind an external HTTP(S) load balancer.' },
          { text: 'A custom domain name', correct: false, explanation: 'Custom domains are optional. The load balancer is the key requirement.' },
        ],
      },
      {
        question: 'How should you handle updating cached content in Cloud CDN?',
        options: [
          { text: 'Always use cache invalidation for immediate updates', correct: false, explanation: 'Cache invalidation takes time to propagate and has rate limits. Versioned URLs are preferred.' },
          { text: 'Use versioned URLs (e.g., file.v2.js) and update references', correct: true, explanation: 'Versioned URLs ensure users get new content immediately since the new URL has no cached version.' },
          { text: 'Disable and re-enable Cloud CDN', correct: false, explanation: 'This is disruptive and unnecessary. Use versioned URLs or cache invalidation.' },
        ],
      },
    ],
  },
  {
    id: 'dataflow',
    name: 'Dataflow',
    category: 'data',
    tagline: 'Fully managed stream and batch data processing service',
    overview: `Dataflow is a fully managed service for executing Apache Beam pipelines for both batch and stream processing. It automatically handles resource provisioning, scaling, and optimization.\n\nDataflow supports windowing, exactly-once processing, and dynamic work rebalancing. It's deeply integrated with Pub/Sub for streaming input, BigQuery for output, and Cloud Storage for both.\n\nFor the ACE exam, Dataflow is the answer for ETL pipelines, streaming analytics, and data transformation. Know the difference between Dataflow (managed Beam) and Dataproc (managed Hadoop/Spark).`,
    keyFeatures: [
      'Unified batch and stream processing with Apache Beam',
      'Automatic scaling and dynamic work rebalancing',
      'Exactly-once processing semantics for streaming',
      'Dataflow templates for reusable, parameterized pipelines',
      'Integrated monitoring and logging via Cloud Console',
    ],
    useCases: [
      {
        title: 'Real-Time ETL Pipeline',
        description: 'Stream data from Pub/Sub, transform it, and load into BigQuery in near real-time.',
        services: ['Dataflow', 'Pub/Sub', 'BigQuery'],
      },
      {
        title: 'Batch Data Processing',
        description: 'Process large datasets in Cloud Storage — clean, transform, and enrich data for analytics.',
        services: ['Dataflow', 'Cloud Storage', 'BigQuery'],
      },
      {
        title: 'Log Analytics',
        description: 'Parse and aggregate log data from multiple sources for security analysis and operational insights.',
        services: ['Dataflow', 'Pub/Sub', 'BigQuery', 'Cloud Logging'],
      },
    ],
    pricing: {
      model: 'Pay for worker vCPUs, memory, storage, and Dataflow Shuffle (for batch). Streaming and batch pricing differ.',
      tiers: [
        'Batch vCPU: $0.056/hr per vCPU',
        'Batch memory: $0.003557/GB-hr',
        'Streaming vCPU: $0.069/hr per vCPU',
        'Streaming memory: $0.003557/GB-hr',
        'Dataflow Shuffle: $0.011/GB (batch only)',
      ],
      tips: [
        'Use Dataflow Shuffle for batch jobs to reduce worker disk needs and improve performance',
        'Right-size machine types based on pipeline requirements',
        'Use Dataflow templates to avoid recompilation costs',
        'Enable autoscaling to match worker count to actual data volume',
      ],
    },
    vsAlternatives: [
      { service: 'Dataproc', comparison: 'Dataproc runs Hadoop/Spark for existing big data workloads. Dataflow is fully managed and better for new pipelines.' },
      { service: 'Pub/Sub', comparison: 'Pub/Sub is for message delivery. Dataflow processes and transforms the data after ingestion.' },
    ],
    gotchas: [
      'Dataflow uses Apache Beam SDK — there\'s a learning curve if you\'re not familiar with Beam.',
      'Streaming pipelines run continuously and incur costs 24/7. Monitor and right-size workers.',
      'Pipeline updates for streaming jobs require compatible changes — breaking changes need a new pipeline.',
      'Dataflow Shuffle is only for batch pipelines — streaming pipelines use Streaming Engine instead.',
    ],
    quiz: [
      {
        question: 'What is the relationship between Dataflow and Apache Beam?',
        options: [
          { text: 'They are competing products', correct: false, explanation: 'Dataflow executes Apache Beam pipelines as a managed service.' },
          { text: 'Dataflow is a managed runner for Apache Beam pipelines', correct: true, explanation: 'Apache Beam is the programming model; Dataflow is Google\'s managed runner that executes Beam pipelines.' },
          { text: 'Dataflow replaced Apache Beam', correct: false, explanation: 'Beam and Dataflow work together — Beam defines pipelines, Dataflow runs them.' },
        ],
      },
      {
        question: 'When should you choose Dataflow over Dataproc?',
        options: [
          { text: 'When you have existing Hadoop/Spark jobs', correct: false, explanation: 'Existing Hadoop/Spark jobs are better suited for Dataproc.' },
          { text: 'When you need a fully managed, auto-scaling pipeline with no cluster management', correct: true, explanation: 'Dataflow is fully managed and serverless. Dataproc requires cluster configuration and management.' },
          { text: 'When you need to run Python scripts', correct: false, explanation: 'Both support Python. The decision is about management model, not language.' },
        ],
      },
    ],
  },
  {
    id: 'vertex-ai',
    name: 'Vertex AI',
    category: 'ai',
    tagline: 'Unified ML platform for building, deploying, and scaling AI models',
    overview: `Vertex AI is Google Cloud's unified machine learning platform that brings together all GCP ML services under one roof. It provides tools for every stage of the ML lifecycle: data preparation, training, evaluation, deployment, and monitoring.\n\nVertex AI includes AutoML (no-code model training), custom training with your own code, model registry, endpoints for serving predictions, feature store, pipelines, and integration with Generative AI foundation models.\n\nFor the ACE exam, understand when to use Vertex AI vs BigQuery ML. Vertex AI is for advanced ML workflows with custom models and MLOps, while BigQuery ML is for SQL users who want to build models directly on warehouse data.`,
    keyFeatures: [
      'AutoML for training models without writing code',
      'Custom training with TensorFlow, PyTorch, scikit-learn, and XGBoost',
      'Model Registry and Endpoints for serving predictions',
      'Vertex AI Pipelines for MLOps automation',
      'Generative AI with Gemini and PaLM foundation models',
    ],
    useCases: [
      {
        title: 'Image Classification',
        description: 'Train a custom image classification model with AutoML Vision or a custom TensorFlow model.',
        services: ['Vertex AI', 'Cloud Storage', 'Cloud Functions'],
      },
      {
        title: 'MLOps Pipeline',
        description: 'Build end-to-end ML pipelines that automate data prep, training, evaluation, and deployment.',
        services: ['Vertex AI', 'Cloud Storage', 'BigQuery', 'Artifact Registry'],
      },
      {
        title: 'Generative AI Applications',
        description: 'Build applications powered by Gemini models for text generation, summarization, and code generation.',
        services: ['Vertex AI', 'Cloud Run', 'Cloud Storage'],
      },
    ],
    pricing: {
      model: 'Pay for training (compute hours), prediction (node hours or per-request), and storage. AutoML and custom training have different rates.',
      tiers: [
        'AutoML training: $3.15-$18.00/hr depending on data type',
        'Custom training: Based on machine type (same as Compute Engine)',
        'Online prediction: $0.0416-$0.3333/node-hour',
        'Generative AI: Per-token pricing for foundation models',
      ],
      tips: [
        'Use preemptible VMs for custom training to save up to 80%',
        'Start with AutoML for baseline models before investing in custom training',
        'Use batch prediction instead of online prediction for non-real-time workloads',
        'Monitor prediction endpoints and scale down during low-traffic periods',
      ],
    },
    vsAlternatives: [
      { service: 'BigQuery ML', comparison: 'BigQuery ML is for SQL users building models on warehouse data. Vertex AI provides a full MLOps platform for complex workflows.' },
      { service: 'AI Platform (legacy)', comparison: 'Vertex AI is the successor to AI Platform, combining all ML services into a unified platform.' },
    ],
    gotchas: [
      'AutoML has minimum data requirements (e.g., 1000 images for image classification). Check documentation for your data type.',
      'Custom training jobs can be expensive with GPUs. Use preemptible VMs and set training budgets.',
      'Online prediction endpoints charge per node-hour even with no traffic. Use min-replicas = 0 where supported.',
      'Model deployment to an endpoint can take several minutes. Plan for this in CI/CD pipelines.',
    ],
    quiz: [
      {
        question: 'When should you use AutoML instead of custom training?',
        options: [
          { text: 'When you have very little training data', correct: false, explanation: 'AutoML still requires minimum data thresholds. It\'s about expertise, not data size.' },
          { text: 'When you want good results without ML expertise or custom code', correct: true, explanation: 'AutoML is designed for users who want high-quality models without writing training code.' },
          { text: 'When you need the highest possible accuracy', correct: false, explanation: 'Custom training with expert tuning can often exceed AutoML accuracy.' },
        ],
      },
      {
        question: 'What is the difference between Vertex AI and BigQuery ML?',
        options: [
          { text: 'BigQuery ML is more powerful', correct: false, explanation: 'Vertex AI is the full-featured ML platform with more capabilities.' },
          { text: 'BigQuery ML trains models with SQL on warehouse data; Vertex AI is a full MLOps platform', correct: true, explanation: 'BigQuery ML is for SQL users who want in-place model training. Vertex AI provides the complete ML lifecycle.' },
          { text: 'They are the same service', correct: false, explanation: 'They are different products with different use cases, though they can work together.' },
        ],
      },
    ],
  },
  {
    id: 'artifact-registry',
    name: 'Artifact Registry',
    category: 'devops',
    tagline: 'Universal package manager for build artifacts and dependencies',
    overview: `Artifact Registry is Google Cloud's fully managed package manager for storing, managing, and securing build artifacts. It supports Docker container images, language packages (npm, Maven, Python, Go), and OS packages.\n\nArtifact Registry replaces Container Registry with broader format support, fine-grained IAM permissions, regional/multi-regional repositories, and vulnerability scanning. It integrates tightly with Cloud Build, GKE, Cloud Run, and Compute Engine.\n\nFor the ACE exam, know that Artifact Registry is the recommended replacement for Container Registry. Understand how it integrates with CI/CD pipelines and how to control access with IAM.`,
    keyFeatures: [
      'Supports Docker, npm, Maven, Python, Go, Apt, and Yum packages',
      'Fine-grained IAM at the repository level',
      'Vulnerability scanning with on-push and continuous scanning',
      'Immutable tags to prevent overwrites of production images',
      'Cleanup policies for automatic deletion of old artifacts',
    ],
    useCases: [
      {
        title: 'Container Image Registry',
        description: 'Store and manage Docker images for GKE, Cloud Run, and Compute Engine deployments.',
        services: ['Artifact Registry', 'Cloud Build', 'GKE', 'Cloud Run'],
      },
      {
        title: 'Language Package Repository',
        description: 'Host private npm, Maven, or Python packages for your organization with dependency management.',
        services: ['Artifact Registry', 'Cloud Build'],
      },
      {
        title: 'Secure CI/CD Pipeline',
        description: 'Build, scan, and deploy container images with vulnerability checks and Binary Authorization.',
        services: ['Artifact Registry', 'Cloud Build', 'Binary Authorization', 'GKE'],
      },
    ],
    pricing: {
      model: 'Pay for storage and network egress. Vulnerability scanning has additional per-image costs.',
      tiers: [
        'Storage: $0.10/GB/month',
        'Network egress: Same as standard GCP egress pricing',
        'Vulnerability scanning: $0.26 per image scanned (on-push)',
        'Container Analysis: Continuous scanning included with on-demand pricing',
      ],
      tips: [
        'Use cleanup policies to automatically delete old images and reduce storage costs',
        'Co-locate repositories in the same region as your deployment targets to minimize egress',
        'Use immutable tags for production images to prevent accidental overwrites',
        'Enable vulnerability scanning to catch security issues early in the pipeline',
      ],
    },
    vsAlternatives: [
      { service: 'Container Registry', comparison: 'Container Registry is deprecated. Artifact Registry is the successor with broader format support and better IAM.' },
      { service: 'Docker Hub', comparison: 'Docker Hub is public/third-party. Artifact Registry is private, integrated with GCP IAM, and co-located with your infrastructure.' },
    ],
    gotchas: [
      'Container Registry is deprecated — migrate to Artifact Registry for new projects.',
      'Repository format is set at creation time and cannot be changed later.',
      'IAM permissions are at the repository level, not individual artifacts. Plan your repository structure accordingly.',
      'Vulnerability scanning only works for Docker images, not language packages.',
    ],
    quiz: [
      {
        question: 'What is the relationship between Artifact Registry and Container Registry?',
        options: [
          { text: 'They are the same product', correct: false, explanation: 'Artifact Registry is the successor with more features.' },
          { text: 'Artifact Registry is the recommended replacement for Container Registry', correct: true, explanation: 'Container Registry is deprecated. Artifact Registry supports Docker images plus many additional package formats.' },
          { text: 'Container Registry supports more formats', correct: false, explanation: 'Container Registry only supports Docker images. Artifact Registry supports Docker, npm, Maven, Python, and more.' },
        ],
      },
      {
        question: 'How do you secure access to images in Artifact Registry?',
        options: [
          { text: 'With Docker Hub credentials', correct: false, explanation: 'Artifact Registry uses GCP IAM, not Docker Hub credentials.' },
          { text: 'With repository-level IAM roles', correct: true, explanation: 'Artifact Registry provides fine-grained IAM roles like Artifact Registry Reader and Writer at the repository level.' },
          { text: 'Images are always public', correct: false, explanation: 'Artifact Registry repositories are private by default and controlled by IAM.' },
        ],
      },
    ],
  },
]
