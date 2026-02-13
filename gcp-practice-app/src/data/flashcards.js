export const FLASHCARDS = [
  // ============================================================
  // COMPUTE (10 cards) — Compute Engine, GKE, App Engine
  // ============================================================
  {
    id: 'fc-001',
    front: 'What is the maximum number of vCPUs you can assign to a single Compute Engine N2 VM instance?',
    back: '128 vCPUs. N2 machines support up to 128 vCPUs and 864 GB of memory. For even larger workloads, M3 memory-optimized machines support up to 128 vCPUs with up to 3.9 TB of memory.',
    domain: 'compute',
    tags: ['compute-engine', 'limits', 'machine-types'],
  },
  {
    id: 'fc-002',
    front: 'What is the difference between a managed instance group (MIG) and an unmanaged instance group in Compute Engine?',
    back: 'A managed instance group (MIG) uses an instance template to create identical VMs and supports autoscaling, autohealing, rolling updates, and load balancing. An unmanaged instance group is a collection of potentially dissimilar VMs that you manage yourself, with no autoscaling or autohealing.',
    domain: 'compute',
    tags: ['compute-engine', 'instance-groups', 'best-practices'],
  },
  {
    id: 'fc-003',
    front: 'What is the default boot disk size for a Compute Engine instance, and what is the maximum?',
    back: 'The default boot disk size is 10 GB for most Linux images and 50 GB for Windows images. The maximum persistent disk size is 64 TB.',
    domain: 'compute',
    tags: ['compute-engine', 'disks', 'limits'],
  },
  {
    id: 'fc-004',
    front: 'What are the three environment types available in App Engine, and how do they differ?',
    back: 'App Engine offers the Standard environment (sandbox-based, scales to zero, limited runtimes, fast startup) and the Flexible environment (Docker container-based, minimum 1 instance, custom runtimes, slower scaling). There is no third type — it is Standard vs. Flexible.',
    domain: 'compute',
    tags: ['app-engine', 'key-differences'],
  },
  {
    id: 'fc-005',
    front: 'What gcloud command creates a GKE cluster with 3 nodes in the us-central1-a zone?',
    back: '`gcloud container clusters create my-cluster --zone us-central1-a --num-nodes 3`. By default this creates an e2-medium machine type. Add --machine-type to override.',
    domain: 'compute',
    tags: ['gke', 'cli-commands'],
  },
  {
    id: 'fc-006',
    front: 'What is the difference between a zonal and a regional GKE cluster?',
    back: 'A zonal cluster has a single control plane in one zone — if that zone goes down, the control plane is unavailable. A regional cluster replicates the control plane across three zones in a region, providing higher availability. Node pools in regional clusters also span three zones by default.',
    domain: 'compute',
    tags: ['gke', 'key-differences', 'high-availability'],
  },
  {
    id: 'fc-007',
    front: 'What are preemptible VMs in Compute Engine, and what is their maximum lifetime?',
    back: 'Preemptible VMs are short-lived instances available at 60-91% discount. They can be terminated by GCP at any time and have a maximum lifetime of 24 hours. Spot VMs are the newer version with no maximum runtime but the same preemption behavior.',
    domain: 'compute',
    tags: ['compute-engine', 'pricing', 'preemptible'],
  },
  {
    id: 'fc-008',
    front: 'What committed use discount tiers does Compute Engine offer, and what are the savings?',
    back: 'Compute Engine offers 1-year commitments (up to 37% discount) and 3-year commitments (up to 55% discount) for vCPUs and memory. Committed use discounts apply at the project level and are not cancellable.',
    domain: 'compute',
    tags: ['compute-engine', 'pricing', 'discounts'],
  },
  {
    id: 'fc-009',
    front: 'What is the gcloud command to SSH into a Compute Engine instance named "web-server" in zone us-east1-b?',
    back: '`gcloud compute ssh web-server --zone us-east1-b`. This automatically manages SSH keys, creates them if needed, and adds the public key to the instance metadata.',
    domain: 'compute',
    tags: ['compute-engine', 'cli-commands'],
  },
  {
    id: 'fc-010',
    front: 'In GKE, what is the difference between a DaemonSet and a Deployment?',
    back: 'A Deployment manages a specified number of identical pod replicas and supports rolling updates and rollbacks. A DaemonSet ensures that exactly one copy of a pod runs on every node (or a subset of nodes), commonly used for log collectors, monitoring agents, or storage daemons.',
    domain: 'compute',
    tags: ['gke', 'kubernetes', 'key-differences'],
  },

  // ============================================================
  // STORAGE (10 cards) — Cloud Storage, Cloud SQL, Spanner,
  //                       Firestore, Bigtable, Memorystore
  // ============================================================
  {
    id: 'fc-011',
    front: 'What is the maximum size of a single Cloud Storage object?',
    back: '5 TiB (5,497,558,138,880 bytes). For larger data, use composite objects or split across multiple objects.',
    domain: 'storage',
    tags: ['cloud-storage', 'limits'],
  },
  {
    id: 'fc-012',
    front: 'What are the four Cloud Storage classes, and how do their minimum storage durations differ?',
    back: 'Standard (no minimum), Nearline (30-day minimum), Coldline (90-day minimum), and Archive (365-day minimum). Early deletion before the minimum duration incurs a charge for the remaining days.',
    domain: 'storage',
    tags: ['cloud-storage', 'storage-classes', 'pricing'],
  },
  {
    id: 'fc-013',
    front: 'What is the maximum instance storage size for Cloud SQL, and which database engines does it support?',
    back: 'Cloud SQL supports up to 64 TB of storage. It supports MySQL, PostgreSQL, and SQL Server. Cloud SQL handles replication, backups, and patching automatically.',
    domain: 'storage',
    tags: ['cloud-sql', 'limits', 'key-differences'],
  },
  {
    id: 'fc-014',
    front: 'What makes Cloud Spanner unique compared to Cloud SQL?',
    back: 'Cloud Spanner is a globally distributed, horizontally scalable relational database with strong consistency and up to 99.999% availability (multi-region). Unlike Cloud SQL, it scales horizontally by adding nodes and offers external consistency, the strongest form of consistency.',
    domain: 'storage',
    tags: ['cloud-spanner', 'cloud-sql', 'key-differences'],
  },
  {
    id: 'fc-015',
    front: 'What are the two modes of Firestore, and when would you choose each?',
    back: 'Native mode supports real-time listeners, offline support, and mobile/web SDKs — ideal for mobile and web apps. Datastore mode removes real-time and offline features but offers a Datastore-compatible API — ideal for server-side workloads migrating from legacy Datastore. The mode cannot be changed after creation.',
    domain: 'storage',
    tags: ['firestore', 'datastore', 'key-differences'],
  },
  {
    id: 'fc-016',
    front: 'What is Cloud Bigtable optimized for, and what is its minimum recommended cluster size for production?',
    back: 'Bigtable is a wide-column NoSQL database optimized for high-throughput, low-latency reads and writes of large analytical and operational workloads (time-series, IoT, ad-tech). The minimum recommended production cluster is 3 nodes, each handling ~10,000 reads/writes per second.',
    domain: 'storage',
    tags: ['bigtable', 'best-practices', 'limits'],
  },
  {
    id: 'fc-017',
    front: 'What is the gsutil command to copy a local file to a Cloud Storage bucket with the Nearline storage class?',
    back: '`gsutil cp -s nearline local-file.txt gs://my-bucket/`. The -s flag sets the storage class. You can also use `gcloud storage cp --storage-class=NEARLINE`.',
    domain: 'storage',
    tags: ['cloud-storage', 'cli-commands'],
  },
  {
    id: 'fc-018',
    front: 'What is Memorystore, and which in-memory engines does it support?',
    back: 'Memorystore is a fully managed in-memory data store service. It supports Redis and Memcached. Redis instances can scale up to 300 GB and support high availability with automatic failover. It is commonly used for caching, session management, and leaderboards.',
    domain: 'storage',
    tags: ['memorystore', 'redis', 'memcached'],
  },
  {
    id: 'fc-019',
    front: 'What is Object Versioning in Cloud Storage, and how does it affect deletions?',
    back: 'When Object Versioning is enabled, Cloud Storage retains a noncurrent version of an object when it is deleted or overwritten. Deleting a versioned object creates a noncurrent version rather than permanently removing it. Noncurrent versions continue to incur storage costs until they are explicitly deleted or removed by a lifecycle rule.',
    domain: 'storage',
    tags: ['cloud-storage', 'versioning', 'default-behaviors'],
  },
  {
    id: 'fc-020',
    front: 'What is the default replication behavior of Cloud Storage buckets?',
    back: 'By default, Cloud Storage objects in multi-region and dual-region buckets are geo-redundant (replicated across at least two regions). Regional buckets are redundant across zones within a single region. Turbo replication for dual-region buckets provides a 15-minute RPO.',
    domain: 'storage',
    tags: ['cloud-storage', 'replication', 'default-behaviors'],
  },

  // ============================================================
  // NETWORKING (8 cards) — VPC, Load Balancing, CDN, DNS,
  //                         Cloud Armor, Cloud NAT
  // ============================================================
  {
    id: 'fc-021',
    front: 'What is the difference between auto mode and custom mode VPC networks?',
    back: 'Auto mode VPCs automatically create one subnet in each GCP region using predefined 10.128.0.0/9 ranges. Custom mode VPCs have no subnets created automatically and give you full control over subnet IP ranges and regions. Production workloads should use custom mode for better IP range management.',
    domain: 'networking',
    tags: ['vpc', 'key-differences', 'best-practices'],
  },
  {
    id: 'fc-022',
    front: 'What are the three types of external load balancers in GCP, and when do you use each?',
    back: 'HTTP(S) Load Balancer is a global Layer 7 proxy for web traffic. Network Load Balancer (TCP/UDP) is a regional Layer 4 pass-through for non-HTTP traffic. SSL Proxy Load Balancer is a global Layer 4 proxy for SSL traffic on non-HTTPS ports. Use HTTP(S) LB for web apps, Network LB for raw TCP/UDP, and SSL Proxy for non-web TLS.',
    domain: 'networking',
    tags: ['load-balancing', 'key-differences'],
  },
  {
    id: 'fc-023',
    front: 'What does Cloud CDN cache, and how is cache invalidation performed?',
    back: 'Cloud CDN caches HTTP(S) content at Google edge locations worldwide. Cache invalidation is done via `gcloud compute url-maps invalidate-cdn-cache URL_MAP --path "/images/*"`. Invalidation takes effect within seconds but is rate-limited to one invalidation per minute per URL map.',
    domain: 'networking',
    tags: ['cloud-cdn', 'cli-commands', 'limits'],
  },
  {
    id: 'fc-024',
    front: 'What is Cloud DNS, and what are its supported record types?',
    back: 'Cloud DNS is a scalable, reliable, managed authoritative DNS service. It supports A, AAAA, CNAME, MX, NS, PTR, SOA, SPF, SRV, and TXT records. It offers 100% availability SLA and supports both public and private DNS zones.',
    domain: 'networking',
    tags: ['cloud-dns', 'limits'],
  },
  {
    id: 'fc-025',
    front: 'What is Cloud Armor, and what types of attacks does it protect against?',
    back: 'Cloud Armor is a DDoS protection and web application firewall (WAF) service that works with the external HTTP(S) Load Balancer. It protects against DDoS attacks, cross-site scripting (XSS), SQL injection, and other OWASP Top 10 threats. Rules are based on IP addresses, geographies, and L7 parameters.',
    domain: 'networking',
    tags: ['cloud-armor', 'security', 'best-practices'],
  },
  {
    id: 'fc-026',
    front: 'What is Cloud NAT, and why would you use it?',
    back: 'Cloud NAT (Network Address Translation) lets VM instances without external IP addresses access the internet for outbound connections (e.g., downloading updates, calling APIs) without exposing them to inbound internet traffic. It is regional and operates at the VPC network level.',
    domain: 'networking',
    tags: ['cloud-nat', 'best-practices'],
  },
  {
    id: 'fc-027',
    front: 'What are the default firewall rules in a new VPC network?',
    back: 'A new auto-mode VPC includes default-allow-internal (allows ingress from the VPC CIDR on all ports), default-allow-ssh (TCP 22), default-allow-rdp (TCP 3389), and default-allow-icmp. An implied deny-all ingress and allow-all egress rule exist at the lowest priority (65535) and cannot be deleted.',
    domain: 'networking',
    tags: ['vpc', 'firewall', 'default-behaviors'],
  },
  {
    id: 'fc-028',
    front: 'What is VPC Network Peering, and what are its limitations?',
    back: 'VPC Network Peering connects two VPC networks so resources can communicate using internal IPs. It works across projects and organizations. Key limitations: peering is non-transitive (if A peers with B and B peers with C, A cannot reach C), subnet IP ranges must not overlap, and a single VPC supports up to 25 peering connections.',
    domain: 'networking',
    tags: ['vpc', 'peering', 'limits'],
  },

  // ============================================================
  // SECURITY (8 cards) — IAM, KMS, Secret Manager, SCC
  // ============================================================
  {
    id: 'fc-029',
    front: 'What are the three components of an IAM policy binding?',
    back: 'A binding consists of a member (who — user, group, service account, or domain), a role (what permissions — e.g., roles/storage.objectViewer), and a condition (optional — when the binding applies, such as time or resource attributes). Together they answer: who can do what on which resource.',
    domain: 'security',
    tags: ['iam', 'best-practices'],
  },
  {
    id: 'fc-030',
    front: 'What is the difference between basic, predefined, and custom IAM roles?',
    back: 'Basic roles (Owner, Editor, Viewer) are broad, legacy roles that apply across all services — avoid in production. Predefined roles are curated by Google for specific services (e.g., roles/storage.admin). Custom roles let you define your own set of permissions for least-privilege access.',
    domain: 'security',
    tags: ['iam', 'key-differences', 'best-practices'],
  },
  {
    id: 'fc-031',
    front: 'What is the maximum number of IAM policy bindings per resource, and what is the policy size limit?',
    back: 'Each IAM policy is limited to 1,500 members across all bindings and a maximum size of 10 policy bindings per member per role. The total policy document size cannot exceed 64 KB. For large organizations, use Google Groups to reduce binding count.',
    domain: 'security',
    tags: ['iam', 'limits'],
  },
  {
    id: 'fc-032',
    front: 'What is Cloud KMS, and what key protection levels does it offer?',
    back: 'Cloud Key Management Service (KMS) lets you create, import, and manage cryptographic keys. It offers three protection levels: SOFTWARE (keys in software), HSM (keys in FIPS 140-2 Level 3 hardware security modules), and EXTERNAL (keys managed outside GCP via Cloud EKM). Keys can be symmetric or asymmetric.',
    domain: 'security',
    tags: ['kms', 'key-differences'],
  },
  {
    id: 'fc-033',
    front: 'What is Secret Manager, and how does it differ from Cloud KMS?',
    back: 'Secret Manager stores, manages, and accesses secrets (API keys, passwords, certificates) as binary blobs or text. Cloud KMS manages encryption keys and performs cryptographic operations but does not store secret values. Use Secret Manager to store the secret itself; use KMS to encrypt data or to add an extra encryption layer to secrets.',
    domain: 'security',
    tags: ['secret-manager', 'kms', 'key-differences'],
  },
  {
    id: 'fc-034',
    front: 'What is a service account key, and what is the recommended alternative?',
    back: 'A service account key is a public/private key pair that allows external applications to authenticate as a service account. Google recommends avoiding user-managed keys because they are a security risk if leaked. The recommended alternative is Workload Identity Federation, which lets external identities impersonate service accounts without keys.',
    domain: 'security',
    tags: ['iam', 'service-accounts', 'best-practices'],
  },
  {
    id: 'fc-035',
    front: 'What is Security Command Center (SCC), and what are its two tiers?',
    back: 'SCC is a centralized vulnerability and threat reporting service for GCP. The Standard tier is free and includes Security Health Analytics with basic scanning. The Premium tier adds Event Threat Detection, Container Threat Detection, Virtual Machine Threat Detection, Web Security Scanner, and compliance reporting (CIS, PCI DSS, NIST).',
    domain: 'security',
    tags: ['scc', 'key-differences', 'pricing'],
  },
  {
    id: 'fc-036',
    front: 'What is the Organization Policy Service, and how does it differ from IAM?',
    back: 'Organization Policy Service sets constraints on resource configurations across the organization (e.g., restrict VM external IPs, restrict resource locations). IAM controls who can do what. Organization policies control what can be done regardless of who has permission. Policies inherit down the resource hierarchy: Org > Folder > Project.',
    domain: 'security',
    tags: ['iam', 'org-policy', 'key-differences'],
  },

  // ============================================================
  // DATA (10 cards) — BigQuery, Dataflow, Dataproc, Pub/Sub,
  //                    Cloud Composer
  // ============================================================
  {
    id: 'fc-037',
    front: 'What is the BigQuery free tier, and how is on-demand pricing charged?',
    back: 'BigQuery offers 1 TB of free querying per month and 10 GB of free storage per month. On-demand pricing charges $6.25 per TB of data processed by queries (as of current pricing). You can also purchase flat-rate slots (capacity-based pricing) for predictable costs.',
    domain: 'data',
    tags: ['bigquery', 'pricing'],
  },
  {
    id: 'fc-038',
    front: 'What is a BigQuery partitioned table, and what partition types are available?',
    back: 'A partitioned table is divided into segments (partitions) to improve query performance and reduce costs by scanning less data. Partition types: ingestion time (_PARTITIONTIME), a TIMESTAMP/DATE/DATETIME column, or an INTEGER range column. Partition limit is 4,000 partitions per table.',
    domain: 'data',
    tags: ['bigquery', 'best-practices', 'limits'],
  },
  {
    id: 'fc-039',
    front: 'What is the difference between BigQuery datasets, tables, and views?',
    back: 'A dataset is a top-level container for tables and views within a project (access control is at this level). A table stores data in columnar format. A view is a virtual table defined by a SQL query. Materialized views physically store the query results and auto-refresh, offering faster performance at the cost of storage.',
    domain: 'data',
    tags: ['bigquery', 'key-differences'],
  },
  {
    id: 'fc-040',
    front: 'What is Dataflow, and what programming model does it use?',
    back: 'Dataflow is a fully managed service for stream and batch data processing. It uses the Apache Beam programming model, which provides a unified API for both batch and streaming pipelines. Dataflow auto-scales workers, handles fault tolerance, and supports Java, Python, and Go SDKs.',
    domain: 'data',
    tags: ['dataflow', 'apache-beam'],
  },
  {
    id: 'fc-041',
    front: 'What is the difference between Dataflow and Dataproc?',
    back: 'Dataflow is a fully managed, serverless service using Apache Beam — choose it for new pipelines and when you want zero infrastructure management. Dataproc is a managed Spark/Hadoop cluster service — choose it when migrating existing Spark/Hadoop jobs or when you need specific Hadoop ecosystem tools (Hive, Pig, Presto).',
    domain: 'data',
    tags: ['dataflow', 'dataproc', 'key-differences'],
  },
  {
    id: 'fc-042',
    front: 'What is the default machine type for Dataproc worker nodes, and what is the minimum cluster size?',
    back: 'The default machine type is n1-standard-4 (4 vCPUs, 15 GB RAM) for both master and worker nodes. The minimum cluster configuration is a single-node cluster (1 master, 0 workers), but a standard cluster has 1 master and 2 workers. Preemptible/Spot VMs can be added as secondary workers to reduce cost.',
    domain: 'data',
    tags: ['dataproc', 'default-behaviors', 'limits'],
  },
  {
    id: 'fc-043',
    front: 'What is Cloud Pub/Sub, and what is its maximum message size?',
    back: 'Pub/Sub is a fully managed, real-time messaging service for event-driven architectures. The maximum message size is 10 MB. Messages are retained for up to 31 days (configurable, default 7 days). It supports both push and pull delivery, and exactly-once delivery in Dataflow.',
    domain: 'data',
    tags: ['pub-sub', 'limits'],
  },
  {
    id: 'fc-044',
    front: 'What is the difference between Pub/Sub push and pull subscriptions?',
    back: 'In a pull subscription, the subscriber client calls the Pub/Sub API to retrieve messages and must acknowledge them. In a push subscription, Pub/Sub sends messages as HTTP POST requests to a subscriber endpoint (e.g., Cloud Run URL). Pull is better for high-throughput processing; push is simpler for serverless targets.',
    domain: 'data',
    tags: ['pub-sub', 'key-differences'],
  },
  {
    id: 'fc-045',
    front: 'What is Cloud Composer, and what open-source tool is it based on?',
    back: 'Cloud Composer is a fully managed workflow orchestration service built on Apache Airflow. It uses Directed Acyclic Graphs (DAGs) written in Python to author, schedule, and monitor workflows across clouds and on-premises data centers. Composer 2 runs on GKE Autopilot for better resource efficiency.',
    domain: 'data',
    tags: ['cloud-composer', 'apache-airflow'],
  },
  {
    id: 'fc-046',
    front: 'What is the bq command to load a CSV file from Cloud Storage into a BigQuery table?',
    back: '`bq load --source_format=CSV --autodetect mydataset.mytable gs://my-bucket/data.csv`. The --autodetect flag infers the schema from the file. You can also specify a schema with --schema or a JSON schema file.',
    domain: 'data',
    tags: ['bigquery', 'cli-commands'],
  },

  // ============================================================
  // AI / ML (5 cards) — Vertex AI, Vision AI, Natural Language AI
  // ============================================================
  {
    id: 'fc-047',
    front: 'What is Vertex AI, and how does it differ from the legacy AI Platform?',
    back: 'Vertex AI is the unified ML platform that combines AutoML and custom model training into a single API and UI. It replaces the legacy AI Platform (Training and Prediction) and AutoML products. It offers managed notebooks, feature store, model monitoring, pipelines, and endpoints for serving predictions.',
    domain: 'ai',
    tags: ['vertex-ai', 'key-differences'],
  },
  {
    id: 'fc-048',
    front: 'What is Vertex AI AutoML, and what data types does it support?',
    back: 'AutoML lets you train high-quality custom models with minimal ML expertise by providing labeled data. It supports image classification/detection, text classification/extraction/sentiment, video classification/tracking, tabular classification/regression/forecasting. Training is fully managed with no code required.',
    domain: 'ai',
    tags: ['vertex-ai', 'automl'],
  },
  {
    id: 'fc-049',
    front: 'What does the Cloud Vision API detect, and what is the maximum image size?',
    back: 'The Vision API detects labels, faces, landmarks, logos, text (OCR), explicit content (SafeSearch), image properties, and web references. Maximum image size is 20 MB for most features. It supports JPEG, PNG, GIF, BMP, WEBP, RAW, ICO, and PDF (up to 2000 pages for batch).',
    domain: 'ai',
    tags: ['vision-ai', 'limits'],
  },
  {
    id: 'fc-050',
    front: 'What features does the Cloud Natural Language API provide?',
    back: 'The Natural Language API provides sentiment analysis (document and entity-level), entity analysis (identifies people, places, events), syntax analysis (tokenization, POS tagging, parse trees), content classification (700+ categories), and entity sentiment analysis. It supports multiple languages.',
    domain: 'ai',
    tags: ['natural-language-ai', 'key-differences'],
  },
  {
    id: 'fc-051',
    front: 'What is Vertex AI Feature Store, and why is it important?',
    back: 'Feature Store is a centralized repository for organizing, storing, and serving ML features. It enables feature sharing and reuse across teams, ensures consistency between training and serving (avoiding training-serving skew), provides point-in-time lookups for historical features, and supports both batch and online serving.',
    domain: 'ai',
    tags: ['vertex-ai', 'feature-store', 'best-practices'],
  },

  // ============================================================
  // DEVOPS (8 cards) — Cloud Build, Artifact Registry,
  //                     Cloud Monitoring, Cloud Logging
  // ============================================================
  {
    id: 'fc-052',
    front: 'What is Cloud Build, and how many free build-minutes per day does it provide?',
    back: 'Cloud Build is a fully managed CI/CD service that executes builds on GCP infrastructure. It provides 120 free build-minutes per day using the e2-standard-2 machine type. Builds are defined in a cloudbuild.yaml or Dockerfile, and it integrates with Cloud Source Repositories, GitHub, and Bitbucket.',
    domain: 'devops',
    tags: ['cloud-build', 'pricing', 'limits'],
  },
  {
    id: 'fc-053',
    front: 'What is Artifact Registry, and how does it differ from Container Registry?',
    back: 'Artifact Registry is a universal package manager that supports Docker images, Maven, npm, Python, Go, and other formats. Container Registry (deprecated) only supports Docker images. Artifact Registry offers fine-grained IAM per repository, regional and multi-regional repos, vulnerability scanning, and CMEK encryption.',
    domain: 'devops',
    tags: ['artifact-registry', 'container-registry', 'key-differences'],
  },
  {
    id: 'fc-054',
    front: 'What is Cloud Monitoring, and what are its key components?',
    back: 'Cloud Monitoring collects metrics, events, and metadata from GCP, AWS, and on-premises resources. Key components: dashboards (visualization), alerting policies (notifications on conditions), uptime checks (HTTP/TCP/HTTPS probes), groups (logical resource grouping), and the Monitoring Query Language (MQL) for advanced queries.',
    domain: 'devops',
    tags: ['cloud-monitoring', 'best-practices'],
  },
  {
    id: 'fc-055',
    front: 'What is the default retention period for Cloud Logging logs, and can it be changed?',
    back: 'Admin Activity audit logs are retained for 400 days (cannot be changed). Data Access audit logs and user-written logs are retained for 30 days by default. You can configure custom retention from 1 to 3,650 days per log bucket. Logs routed to Cloud Storage or BigQuery are retained according to those services\u2019 policies.',
    domain: 'devops',
    tags: ['cloud-logging', 'default-behaviors', 'limits'],
  },
  {
    id: 'fc-056',
    front: 'What is the gcloud command to stream logs from a specific Cloud Run service in real-time?',
    back: '`gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=my-service" --format=json --freshness=1m` or more simply `gcloud run services logs read my-service --tail`. The --tail flag streams logs continuously.',
    domain: 'devops',
    tags: ['cloud-logging', 'cloud-run', 'cli-commands'],
  },
  {
    id: 'fc-057',
    front: 'What are log sinks in Cloud Logging, and what are the supported destinations?',
    back: 'Log sinks route log entries to external destinations for long-term storage or analysis. Supported destinations: Cloud Storage buckets (archival), BigQuery datasets (analytics), Pub/Sub topics (streaming to external systems), Cloud Logging buckets in other projects, and Splunk via Pub/Sub. Sinks use inclusion and exclusion filters.',
    domain: 'devops',
    tags: ['cloud-logging', 'best-practices'],
  },
  {
    id: 'fc-058',
    front: 'What is an alerting policy in Cloud Monitoring, and what notification channels are supported?',
    back: 'An alerting policy defines a condition (metric threshold, absence, or MQL query), a duration (how long the condition must hold), and notification channels. Supported channels include email, SMS, Slack, PagerDuty, webhooks, Pub/Sub, and mobile app push notifications.',
    domain: 'devops',
    tags: ['cloud-monitoring', 'alerting'],
  },
  {
    id: 'fc-059',
    front: 'What is the Cloud Build trigger, and what events can trigger a build?',
    back: 'A Cloud Build trigger automatically starts a build when source code changes occur. Trigger events include: push to a branch, push of a new tag, pull request creation/update (GitHub/Bitbucket), manual invocation, Pub/Sub message, and webhook events. Each trigger can filter by branch name, tag pattern, or file path.',
    domain: 'devops',
    tags: ['cloud-build', 'ci-cd', 'best-practices'],
  },

  // ============================================================
  // SERVERLESS (6 cards) — Cloud Run, Cloud Functions
  // ============================================================
  {
    id: 'fc-060',
    front: 'What is the maximum request timeout for Cloud Run, and what is the default?',
    back: 'The maximum request timeout for Cloud Run is 3,600 seconds (60 minutes). The default is 300 seconds (5 minutes). For longer background processing, use Cloud Run jobs instead of services, which have no request timeout as they are not triggered by HTTP requests.',
    domain: 'serverless',
    tags: ['cloud-run', 'limits', 'default-behaviors'],
  },
  {
    id: 'fc-061',
    front: 'What is the difference between Cloud Run services and Cloud Run jobs?',
    back: 'Cloud Run services respond to HTTP requests and scale automatically from 0 to N container instances. Cloud Run jobs run a container to completion without serving requests — ideal for batch processing, data migration, or scheduled tasks. Jobs can run multiple parallel tasks and do not require listening on a port.',
    domain: 'serverless',
    tags: ['cloud-run', 'key-differences'],
  },
  {
    id: 'fc-062',
    front: 'What are the two generations of Cloud Functions, and what are the key differences?',
    back: '1st gen functions have a max timeout of 540s, 8 GB memory, and are deployed on proprietary infrastructure. 2nd gen functions (built on Cloud Run) support up to 60 minutes timeout, 32 GB memory, concurrency up to 1000 requests per instance, traffic splitting, and Eventarc triggers. Use 2nd gen for all new development.',
    domain: 'serverless',
    tags: ['cloud-functions', 'key-differences', 'limits'],
  },
  {
    id: 'fc-063',
    front: 'What is the gcloud command to deploy a Cloud Run service from a container image?',
    back: '`gcloud run deploy my-service --image gcr.io/my-project/my-image --region us-central1 --allow-unauthenticated`. The --allow-unauthenticated flag makes the service publicly accessible. Omit it to require IAM authentication (roles/run.invoker).',
    domain: 'serverless',
    tags: ['cloud-run', 'cli-commands'],
  },
  {
    id: 'fc-064',
    front: 'What is the maximum memory and vCPU allocation for a single Cloud Run container instance?',
    back: 'Cloud Run supports up to 32 GiB of memory and 8 vCPUs per container instance. The minimum is 128 MiB memory. CPU can be set to "always allocated" for background tasks or "only during request processing" to reduce costs when idle.',
    domain: 'serverless',
    tags: ['cloud-run', 'limits', 'pricing'],
  },
  {
    id: 'fc-065',
    front: 'What event trigger sources does Cloud Functions 2nd gen support via Eventarc?',
    back: 'Cloud Functions 2nd gen supports over 130 event sources via Eventarc including: Cloud Storage (object finalized, deleted, archived), Firestore (document create, update, delete), Pub/Sub messages, Cloud Audit Logs (any audited API call), Firebase Authentication, Firebase Analytics, and custom events. This is a significant expansion over 1st gen triggers.',
    domain: 'serverless',
    tags: ['cloud-functions', 'eventarc', 'key-differences'],
  },
];
