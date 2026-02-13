export const SERVICE_COMPARISONS = [
  // 1. Cloud Run vs GKE vs App Engine
  {
    id: 'cloud-run-vs-gke-vs-app-engine',
    title: 'Cloud Run vs GKE vs App Engine',
    subtitle: 'Choosing the right compute platform',
    category: 'compute',
    services: ['Cloud Run', 'GKE', 'App Engine'],
    comparison: [
      { feature: 'Scaling', values: ['Auto-scales to zero', 'Manual or HPA autoscaling', 'Auto-scales (standard) / manual (flex)'] },
      { feature: 'Container Support', values: ['Any container', 'Any container + pods', 'Buildpacks or containers (flex)'] },
      { feature: 'Pricing Model', values: ['Per-request + CPU/memory time', 'Per-node (cluster) time', 'Per-instance hour'] },
      { feature: 'Min Cost (idle)', values: ['$0 (scales to zero)', '~$70/mo (1 node)', 'Free tier available'] },
      { feature: 'Stateful Apps', values: ['No (stateless only)', 'Yes (StatefulSets)', 'Limited'] },
      { feature: 'Customization', values: ['Limited (container-level)', 'Full (OS, networking, storage)', 'Limited'] },
      { feature: 'Complexity', values: ['Low', 'High', 'Low-Medium'] },
      { feature: 'Best For', values: ['Stateless microservices, APIs', 'Complex multi-container apps', 'Simple web apps, APIs'] },
    ],
    decisionGuide: 'Choose Cloud Run when you want zero-ops serverless containers. Choose GKE when you need full Kubernetes features, multi-container pods, or stateful workloads. Choose App Engine when you want a simple PaaS with built-in versioning and traffic splitting.',
    exercises: [
      {
        scenario: 'A startup needs to deploy a REST API that handles 100 requests/day on weekdays but zero on weekends. Budget is critical.',
        options: [
          { service: 'Cloud Run', points: 10, feedback: 'Perfect choice! Cloud Run scales to zero, so you pay nothing on weekends. Low traffic makes per-request pricing very cost-effective.' },
          { service: 'GKE', points: 3, feedback: 'Overkill for this use case. GKE requires at least one node running 24/7, costing ~$70/month even when idle.' },
          { service: 'App Engine', points: 7, feedback: 'Decent choice. App Engine Standard can scale to zero, but Cloud Run offers more flexibility with containers.' },
        ],
      },
      {
        scenario: 'An enterprise needs to run 50 microservices with service mesh, custom networking policies, and GPU-accelerated ML inference.',
        options: [
          { service: 'Cloud Run', points: 4, feedback: 'Cloud Run can run individual containers but lacks service mesh, custom networking, and GPU support.' },
          { service: 'GKE', points: 10, feedback: 'Correct! GKE supports Istio service mesh, network policies, GPU node pools, and complex multi-service architectures.' },
          { service: 'App Engine', points: 2, feedback: 'App Engine is not designed for complex microservice architectures with custom networking requirements.' },
        ],
      },
    ],
  },

  // 2. Cloud SQL vs Spanner vs AlloyDB
  {
    id: 'cloud-sql-vs-spanner-vs-alloydb',
    title: 'Cloud SQL vs Spanner vs AlloyDB',
    subtitle: 'Choosing the right relational database',
    category: 'storage',
    services: ['Cloud SQL', 'Spanner', 'AlloyDB'],
    comparison: [
      { feature: 'Database Type', values: ['MySQL, PostgreSQL, SQL Server', 'Google-proprietary relational', 'PostgreSQL-compatible'] },
      { feature: 'Max Storage', values: ['64 TB', 'Unlimited (petabytes)', '64 TB+ with clustering'] },
      { feature: 'Horizontal Scaling', values: ['Read replicas only', 'Fully distributed reads/writes', 'Read pools with write primary'] },
      { feature: 'Global Distribution', values: ['Regional with cross-region replicas', 'Multi-region with strong consistency', 'Regional'] },
      { feature: 'Pricing (entry)', values: ['~$7/mo (db-f1-micro)', '~$65/mo (100 processing units)', '~$200/mo (2 vCPUs)'] },
      { feature: 'Consistency', values: ['Strong (single region)', 'External consistency (global)', 'Strong (single region)'] },
      { feature: 'Migration Ease', values: ['High (standard engines)', 'Low (proprietary dialect)', 'High (PostgreSQL wire-compatible)'] },
      { feature: 'Best For', values: ['Standard web apps, lift-and-shift', 'Global-scale, mission-critical apps', 'High-performance PostgreSQL workloads'] },
    ],
    decisionGuide: 'Choose Cloud SQL for standard relational workloads that fit within a single region and when you need MySQL, PostgreSQL, or SQL Server compatibility. Choose Spanner when you need global distribution with strong consistency, unlimited scale, and can invest in its proprietary SQL dialect. Choose AlloyDB when you have PostgreSQL workloads that demand high performance, especially for transactional and analytical hybrid queries.',
    exercises: [
      {
        scenario: 'A fintech company is building a global payments platform processing transactions across 5 continents. They need strong consistency for every transaction regardless of where it originates.',
        options: [
          { service: 'Cloud SQL', points: 3, feedback: 'Cloud SQL is regional and cannot provide strong consistency for globally distributed writes. Cross-region replicas have replication lag.' },
          { service: 'Spanner', points: 10, feedback: 'Excellent! Spanner is purpose-built for this. It provides external consistency across global regions, making it ideal for financial transactions that need correctness everywhere.' },
          { service: 'AlloyDB', points: 4, feedback: 'AlloyDB is high-performance but regional. It cannot serve globally distributed transactions with strong consistency across continents.' },
        ],
      },
      {
        scenario: 'A team is migrating a legacy on-premise PostgreSQL database (500 GB) powering an internal HR application used by 200 employees in one office. They want minimal code changes.',
        options: [
          { service: 'Cloud SQL', points: 9, feedback: 'Great choice. Cloud SQL for PostgreSQL is the simplest migration path with full compatibility. For a 200-user internal app, it provides more than enough performance at the lowest cost.' },
          { service: 'Spanner', points: 2, feedback: 'Massive overkill. Spanner requires rewriting queries in its own SQL dialect and costs far more than needed for a small internal application.' },
          { service: 'AlloyDB', points: 7, feedback: 'AlloyDB is PostgreSQL-compatible and would work well, but its higher starting price (~$200/mo) is hard to justify for a small internal HR app when Cloud SQL starts at ~$7/mo.' },
        ],
      },
    ],
  },

  // 3. Pub/Sub vs Cloud Tasks
  {
    id: 'pubsub-vs-cloud-tasks',
    title: 'Pub/Sub vs Cloud Tasks',
    subtitle: 'Choosing the right asynchronous messaging service',
    category: 'data',
    services: ['Pub/Sub', 'Cloud Tasks'],
    comparison: [
      { feature: 'Message Model', values: ['Publish/Subscribe (fan-out)', 'Task queue (point-to-point)'] },
      { feature: 'Delivery', values: ['Multiple subscribers per message', 'Exactly one handler per task'] },
      { feature: 'Rate Control', values: ['No built-in rate limiting', 'Configurable dispatch rate and concurrency'] },
      { feature: 'Scheduling', values: ['Immediate delivery only', 'Schedule tasks up to 30 days in future'] },
      { feature: 'Deduplication', values: ['Exactly-once delivery available', 'Automatic task deduplication'] },
      { feature: 'Message Retention', values: ['Up to 31 days', 'Up to 30 days'] },
      { feature: 'Ordering', values: ['Ordering keys available', 'FIFO within queue'] },
      { feature: 'Best For', values: ['Event streaming, decoupling services', 'Rate-limited work dispatch, delayed tasks'] },
    ],
    decisionGuide: 'Choose Pub/Sub when you need to broadcast events to multiple subscribers, decouple producers from consumers, or build event-driven architectures where the publisher does not care who processes the message. Choose Cloud Tasks when you need explicit control over task dispatch rate, want to schedule future execution, or need point-to-point delivery where a specific service must handle each task exactly once.',
    exercises: [
      {
        scenario: 'An e-commerce platform needs to notify the inventory service, email service, and analytics service every time an order is placed. Each service processes the event independently.',
        options: [
          { service: 'Pub/Sub', points: 10, feedback: 'Perfect! Pub/Sub\'s fan-out model lets you publish one order event and have all three services receive it via separate subscriptions. Adding new subscribers later requires zero changes to the publisher.' },
          { service: 'Cloud Tasks', points: 3, feedback: 'Cloud Tasks delivers each task to a single handler. You would need to create three separate tasks per order, tightly coupling the publisher to all consumers.' },
        ],
      },
      {
        scenario: 'A SaaS application needs to call a third-party API to generate PDF invoices, but the API allows only 10 requests per second. Invoices can be generated within a few hours of the order.',
        options: [
          { service: 'Pub/Sub', points: 4, feedback: 'Pub/Sub would push messages as fast as possible, likely overwhelming the 10 req/s API limit. You would need to build your own rate limiter on the subscriber side.' },
          { service: 'Cloud Tasks', points: 10, feedback: 'Excellent! Cloud Tasks lets you set a maxDispatchesPerSecond of 10, perfectly matching the API rate limit. Tasks queue up and dispatch at the controlled rate without custom code.' },
        ],
      },
    ],
  },

  // 4. BigQuery vs Dataflow vs Dataproc
  {
    id: 'bigquery-vs-dataflow-vs-dataproc',
    title: 'BigQuery vs Dataflow vs Dataproc',
    subtitle: 'Choosing the right data processing platform',
    category: 'data',
    services: ['BigQuery', 'Dataflow', 'Dataproc'],
    comparison: [
      { feature: 'Primary Use', values: ['Analytics and data warehousing', 'Stream and batch ETL pipelines', 'Hadoop/Spark workloads'] },
      { feature: 'Processing Model', values: ['SQL queries on stored data', 'Apache Beam pipelines', 'Hadoop, Spark, Flink, Presto'] },
      { feature: 'Serverless', values: ['Yes', 'Yes', 'No (managed clusters)'] },
      { feature: 'Streaming Support', values: ['Streaming inserts + materialized views', 'Native streaming with windowing', 'Spark Streaming, Flink'] },
      { feature: 'Infrastructure Mgmt', values: ['None', 'None (auto-scaling workers)', 'Cluster creation and sizing required'] },
      { feature: 'Pricing Model', values: ['Per TB scanned (on-demand) or slots', 'Per vCPU-hour and GB-hour of workers', 'Per VM hour in cluster'] },
      { feature: 'Learning Curve', values: ['Low (SQL)', 'Medium (Beam SDK)', 'Medium-High (Spark/Hadoop ecosystem)'] },
      { feature: 'Best For', values: ['Ad-hoc analytics, dashboards, BI', 'Real-time ETL, event processing', 'Existing Spark/Hadoop migration'] },
    ],
    decisionGuide: 'Choose BigQuery when you need to run analytical SQL queries against large datasets, build dashboards, or serve as your data warehouse. Choose Dataflow when you need to build streaming or batch ETL pipelines that transform data between systems in real time. Choose Dataproc when you have existing Apache Spark or Hadoop workloads to migrate, need specific ecosystem tools, or your team already has deep Spark expertise.',
    exercises: [
      {
        scenario: 'A retail company wants their business analysts to run ad-hoc SQL queries against 5 years of sales data (10 TB) to find trends and generate monthly reports. The analysts know SQL but not programming languages.',
        options: [
          { service: 'BigQuery', points: 10, feedback: 'Perfect! BigQuery is ideal for ad-hoc SQL analytics on large datasets. Analysts can query 10 TB without managing infrastructure, and BigQuery\'s columnar storage makes these analytical queries extremely fast.' },
          { service: 'Dataflow', points: 2, feedback: 'Dataflow requires writing Apache Beam pipelines in Java or Python. It is designed for data transformation, not ad-hoc analyst queries.' },
          { service: 'Dataproc', points: 4, feedback: 'While you could run Spark SQL on Dataproc, it requires cluster management and is far more complex than BigQuery for analysts who just need SQL access.' },
        ],
      },
      {
        scenario: 'A gaming company needs to process player events in real time (millions per second), enrich them with player profile data, detect cheating patterns within 30-second windows, and write results to BigQuery and Pub/Sub simultaneously.',
        options: [
          { service: 'BigQuery', points: 3, feedback: 'BigQuery can ingest streaming data but cannot perform complex event-time windowing, real-time enrichment, or route outputs to multiple sinks as part of a pipeline.' },
          { service: 'Dataflow', points: 10, feedback: 'Excellent! Dataflow\'s Apache Beam model excels at real-time stream processing with windowing, side-input enrichment, and multiple output sinks. It auto-scales to handle millions of events per second.' },
          { service: 'Dataproc', points: 5, feedback: 'Spark Streaming on Dataproc could work but requires manual cluster management and tuning. Dataflow is serverless and natively designed for this exact use case.' },
        ],
      },
    ],
  },

  // 5. Cloud Functions vs Cloud Run
  {
    id: 'cloud-functions-vs-cloud-run',
    title: 'Cloud Functions vs Cloud Run',
    subtitle: 'Choosing the right serverless platform',
    category: 'serverless',
    services: ['Cloud Functions', 'Cloud Run'],
    comparison: [
      { feature: 'Deployment Unit', values: ['Single function', 'Container image'] },
      { feature: 'Concurrency', values: ['1 request per instance (gen1) / configurable (gen2)', 'Up to 1000 concurrent requests per instance'] },
      { feature: 'Max Timeout', values: ['9 minutes (gen1) / 60 minutes (gen2)', '60 minutes'] },
      { feature: 'Language Support', values: ['Node.js, Python, Go, Java, .NET, Ruby, PHP', 'Any language (containerized)'] },
      { feature: 'Trigger Types', values: ['HTTP, Pub/Sub, Cloud Storage, Firestore, etc.', 'HTTP (+ Pub/Sub push, Eventarc)'] },
      { feature: 'Cold Start', values: ['Typically higher (instance per request in gen1)', 'Lower with min instances and concurrency'] },
      { feature: 'Portability', values: ['Vendor-locked function signature', 'Portable containers (run anywhere)'] },
      { feature: 'Best For', values: ['Event-driven glue code, simple webhooks', 'Full web apps, APIs, microservices'] },
    ],
    decisionGuide: 'Choose Cloud Functions when you need lightweight event-driven functions triggered by GCP events like file uploads to Cloud Storage, Firestore changes, or Pub/Sub messages, and your logic is simple enough to fit in a single function. Choose Cloud Run when you need to serve a full web application or API, want container portability, need multi-concurrency to handle many requests per instance, or require more control over your runtime environment.',
    exercises: [
      {
        scenario: 'You need to automatically generate a thumbnail every time a user uploads an image to a Cloud Storage bucket. The function takes 2 seconds to process each image.',
        options: [
          { service: 'Cloud Functions', points: 10, feedback: 'Ideal! Cloud Functions has a native Cloud Storage trigger that fires on object creation. For a simple single-purpose event handler like thumbnail generation, it is the simplest and most cost-effective option.' },
          { service: 'Cloud Run', points: 6, feedback: 'You could use Cloud Run with Eventarc to listen for Cloud Storage events, but it adds unnecessary complexity. For a simple event handler, Cloud Functions is more straightforward.' },
        ],
      },
      {
        scenario: 'You are building a REST API with 15 endpoints that uses a custom C++ library for video transcoding. The API receives bursty traffic with up to 500 simultaneous users during peak hours.',
        options: [
          { service: 'Cloud Functions', points: 4, feedback: 'Cloud Functions would require separate functions per endpoint or a routing hack, and installing custom C++ libraries in the function environment is difficult. Gen1 concurrency of 1 means 500 instances for 500 users.' },
          { service: 'Cloud Run', points: 10, feedback: 'Perfect! Cloud Run lets you package the C++ library in a Docker container, serve all 15 endpoints from one service, and handle 500 concurrent users with far fewer instances thanks to multi-concurrency support.' },
        ],
      },
    ],
  },

  // 6. Memorystore vs Firestore vs Bigtable
  {
    id: 'memorystore-vs-firestore-vs-bigtable',
    title: 'Memorystore vs Firestore vs Bigtable',
    subtitle: 'Choosing the right NoSQL or caching solution',
    category: 'storage',
    services: ['Memorystore', 'Firestore', 'Bigtable'],
    comparison: [
      { feature: 'Type', values: ['In-memory cache (Redis/Memcached)', 'Document database', 'Wide-column store'] },
      { feature: 'Latency', values: ['Sub-millisecond', 'Low (single-digit ms)', 'Low (single-digit ms at scale)'] },
      { feature: 'Data Persistence', values: ['Optional (Redis RDB/AOF)', 'Fully persistent, multi-region', 'Fully persistent, replicated'] },
      { feature: 'Max Data Size', values: ['300 GB (Redis)', 'Practically unlimited', 'Petabytes'] },
      { feature: 'Query Capability', values: ['Key-value lookups, data structures', 'Rich queries, indexes, real-time listeners', 'Row key scan, single-row lookups'] },
      { feature: 'Serverless', values: ['No (provisioned instances)', 'Yes (Firestore Native mode)', 'No (provisioned nodes)'] },
      { feature: 'Pricing (entry)', values: ['~$35/mo (1 GB Redis)', 'Pay per read/write/storage (generous free tier)', '~$465/mo (1 node)'] },
      { feature: 'Best For', values: ['Session caching, leaderboards, rate limiting', 'Mobile/web apps, user profiles, real-time sync', 'IoT time-series, analytics, high-throughput'] },
    ],
    decisionGuide: 'Choose Memorystore when you need sub-millisecond caching for session data, frequently accessed objects, or rate limiting and can tolerate potential data loss. Choose Firestore when you need a serverless document database with rich querying, real-time listeners, and offline sync for web and mobile applications. Choose Bigtable when you need to store and query massive volumes of time-series, IoT, or analytical data with consistent low-latency at petabyte scale.',
    exercises: [
      {
        scenario: 'A mobile fitness app needs to store user workout logs, sync data across devices in real time, and work offline when users exercise in areas with no connectivity. Expected scale is 500K users.',
        options: [
          { service: 'Memorystore', points: 2, feedback: 'Memorystore is an in-memory cache with no offline support, no real-time sync to mobile clients, and no rich querying. It is not designed as a primary database for mobile apps.' },
          { service: 'Firestore', points: 10, feedback: 'Perfect! Firestore provides real-time listeners for cross-device sync, built-in offline persistence for mobile SDKs, rich querying on workout data, and a generous free tier that keeps costs low at 500K users.' },
          { service: 'Bigtable', points: 3, feedback: 'Bigtable can store the data but has no real-time listeners, no mobile SDK, no offline support, and its minimum cost of ~$465/month is excessive for 500K users with moderate data.' },
        ],
      },
      {
        scenario: 'An IoT platform ingests 2 million sensor readings per second from 100,000 industrial devices. Each reading must be stored for 2 years and queried by device ID and time range for anomaly detection dashboards.',
        options: [
          { service: 'Memorystore', points: 1, feedback: 'Memorystore maxes out at 300 GB and is not designed for persistent storage of massive time-series data. The cost of keeping 2 years of sensor data in memory would be astronomical.' },
          { service: 'Firestore', points: 3, feedback: 'Firestore charges per read/write operation. At 2 million writes per second, costs would be prohibitive, and it is not optimized for time-series scan patterns.' },
          { service: 'Bigtable', points: 10, feedback: 'Excellent! Bigtable is purpose-built for this. It handles millions of writes per second, stores petabytes affordably, and its row-key design is ideal for device_id + timestamp queries used in time-series dashboards.' },
        ],
      },
    ],
  },

  // 7. Cloud Storage Classes
  {
    id: 'storage-standard-vs-nearline-vs-coldline-vs-archive',
    title: 'Cloud Storage: Standard vs Nearline vs Coldline vs Archive',
    subtitle: 'Choosing the right storage class for your data lifecycle',
    category: 'storage',
    services: ['Standard', 'Nearline', 'Coldline', 'Archive'],
    comparison: [
      { feature: 'Min Storage Duration', values: ['None', '30 days', '90 days', '365 days'] },
      { feature: 'Storage Cost (per GB/mo)', values: ['$0.020', '$0.010', '$0.004', '$0.0012'] },
      { feature: 'Retrieval Cost (per GB)', values: ['$0 (no retrieval fee)', '$0.01', '$0.02', '$0.05'] },
      { feature: 'Access Latency', values: ['Milliseconds', 'Milliseconds', 'Milliseconds', 'Milliseconds'] },
      { feature: 'Availability SLA', values: ['99.95% (multi-region)', '99.9%', '99.9%', 'No SLA'] },
      { feature: 'Typical Access Pattern', values: ['Multiple times per day', 'Once a month or less', 'Once a quarter or less', 'Once a year or less'] },
      { feature: 'Early Deletion Penalty', values: ['None', 'Charged for 30 days minimum', 'Charged for 90 days minimum', 'Charged for 365 days minimum'] },
      { feature: 'Best For', values: ['Active data, serving content', 'Backups accessed monthly', 'Disaster recovery archives', 'Regulatory compliance, long-term retention'] },
    ],
    decisionGuide: 'Choose Standard for data accessed frequently such as website assets, active datasets, and application data. Choose Nearline for data you access less than once a month like monthly backups or infrequently accessed logs. Choose Coldline for data you access less than once a quarter such as disaster recovery data. Choose Archive for data you must retain but rarely access, like regulatory compliance records or historical archives. Use Object Lifecycle Management to automatically transition objects between classes as they age.',
    exercises: [
      {
        scenario: 'A hospital must retain patient medical imaging files (X-rays, MRIs) for 10 years to comply with regulations. Images are actively referenced for the first 6 months after creation, occasionally accessed in months 6-24, and almost never accessed after 2 years.',
        options: [
          { service: 'Standard', points: 3, feedback: 'Using Standard for all 10 years would be extremely expensive. While correct for the first 6 months, you should transition to cheaper classes as access frequency drops.' },
          { service: 'Nearline', points: 6, feedback: 'Good for the 6-24 month period, but you are overpaying for the first 6 months (Standard is better for active access) and for years 2-10 (Archive is far cheaper for rarely accessed data).' },
          { service: 'Archive', points: 10, feedback: 'Best overall strategy! Use Object Lifecycle Management: Standard for 0-6 months, Nearline for 6-24 months, then Archive for years 2-10. Archive at $0.0012/GB/mo saves massively over 8 years of retention. Since the question is about the dominant storage period, Archive is the key class.' },
        ],
      },
      {
        scenario: 'A news website serves millions of images daily for current articles. Images for articles published in the last 7 days account for 95% of all traffic.',
        options: [
          { service: 'Standard', points: 10, feedback: 'Correct! Standard storage provides the highest availability, no retrieval costs, and millisecond access needed for serving images to millions of daily visitors. The frequent access pattern makes the higher storage cost worthwhile since you avoid retrieval fees.' },
          { service: 'Nearline', points: 3, feedback: 'Nearline\'s $0.01/GB retrieval cost would be very expensive with millions of daily image requests. The storage savings are wiped out many times over by retrieval fees at this access frequency.' },
          { service: 'Coldline', points: 1, feedback: 'Coldline\'s $0.02/GB retrieval cost on millions of daily requests would make this the most expensive option by far. Coldline is designed for data accessed less than once per quarter.' },
        ],
      },
    ],
  },

  // 8. VPC Peering vs Shared VPC vs Cloud Interconnect
  {
    id: 'vpc-peering-vs-shared-vpc-vs-cloud-interconnect',
    title: 'VPC Peering vs Shared VPC vs Cloud Interconnect',
    subtitle: 'Choosing the right networking connectivity model',
    category: 'networking',
    services: ['VPC Peering', 'Shared VPC', 'Cloud Interconnect'],
    comparison: [
      { feature: 'Connection Type', values: ['VPC-to-VPC within GCP', 'Centralized VPC shared across projects', 'On-premises to GCP'] },
      { feature: 'Scope', values: ['Between any two VPC networks', 'Within a GCP organization', 'Hybrid cloud (GCP + on-prem)'] },
      { feature: 'Transitivity', values: ['Non-transitive (no chaining)', 'N/A (single VPC model)', 'Connects to the VPC, not between VPCs'] },
      { feature: 'IP Address Management', values: ['Each VPC manages its own IPs', 'Centralized IP management by host project', 'On-prem IPs routed into GCP'] },
      { feature: 'Bandwidth', values: ['GCP internal bandwidth (high)', 'GCP internal bandwidth (high)', '10 Gbps or 100 Gbps dedicated'] },
      { feature: 'Latency', values: ['Low (Google backbone)', 'Low (same VPC)', 'Lower and more consistent than internet'] },
      { feature: 'Setup Complexity', values: ['Low (both VPCs must agree)', 'Medium (org admin configures host/service projects)', 'High (physical cross-connect or partner)'] },
      { feature: 'Best For', values: ['Connecting separate teams/projects in GCP', 'Centralized network control in an org', 'Connecting data center to GCP'] },
    ],
    decisionGuide: 'Choose VPC Peering when you need to connect two separate VPC networks within GCP, such as between different teams or environments that manage their own projects. Choose Shared VPC when you want centralized network administration across multiple projects in your organization, allowing a network team to manage IPs, firewall rules, and subnets while service teams deploy resources. Choose Cloud Interconnect when you need to connect your on-premises data center or co-location facility to GCP with dedicated high-bandwidth, low-latency connectivity.',
    exercises: [
      {
        scenario: 'A large enterprise with 20 GCP projects wants their central network team to manage all IP address allocation, firewall rules, and subnet configurations while individual teams deploy their workloads in separate projects.',
        options: [
          { service: 'VPC Peering', points: 3, feedback: 'VPC Peering connects individual VPCs but provides no centralized administration. With 20 projects, you would need up to 190 peering connections, and each team would manage their own firewall rules and IPs.' },
          { service: 'Shared VPC', points: 10, feedback: 'Perfect! Shared VPC lets the network team manage a host project with centralized subnets, IPs, and firewall rules. All 20 service projects deploy into the shared network, giving the network team full control while teams retain independence for their workloads.' },
          { service: 'Cloud Interconnect', points: 1, feedback: 'Cloud Interconnect connects on-premises infrastructure to GCP. It does not solve the problem of centralized network management across GCP projects.' },
        ],
      },
      {
        scenario: 'A financial institution runs its core banking system on-premises and needs a private, dedicated 10 Gbps link to GCP for migrating large datasets nightly and running analytics in BigQuery. They cannot route this data over the public internet.',
        options: [
          { service: 'VPC Peering', points: 1, feedback: 'VPC Peering is for connecting two GCP VPC networks. It cannot connect on-premises infrastructure to GCP.' },
          { service: 'Shared VPC', points: 2, feedback: 'Shared VPC organizes GCP project networking but does not provide connectivity from on-premises to GCP. You would still need an interconnect to reach GCP.' },
          { service: 'Cloud Interconnect', points: 10, feedback: 'Exactly right! Dedicated Cloud Interconnect provides a private 10 Gbps (or 100 Gbps) physical connection between on-premises and GCP. Traffic never traverses the public internet, meeting the security requirement, and the dedicated bandwidth supports large nightly data transfers.' },
        ],
      },
    ],
  },

  // 9. IAM Roles: Basic vs Predefined vs Custom
  {
    id: 'iam-basic-vs-predefined-vs-custom',
    title: 'IAM Roles: Basic vs Predefined vs Custom',
    subtitle: 'Choosing the right level of access control granularity',
    category: 'security',
    services: ['Basic Roles', 'Predefined Roles', 'Custom Roles'],
    comparison: [
      { feature: 'Granularity', values: ['Coarse (project-wide)', 'Service-specific (fine-grained)', 'Permission-level (most granular)'] },
      { feature: 'Examples', values: ['Owner, Editor, Viewer', 'roles/storage.objectViewer, roles/bigquery.dataEditor', 'mycompany.storageReadOnly'] },
      { feature: 'Number Available', values: ['3 roles', 'Hundreds (per service)', 'Unlimited (you define them)'] },
      { feature: 'Maintenance', values: ['None (Google-managed)', 'None (Google-managed, auto-updated)', 'You maintain as APIs change'] },
      { feature: 'Scope', values: ['All services in a project', 'Specific service or resource', 'Any combination of permissions'] },
      { feature: 'Least Privilege', values: ['Poor (too broad)', 'Good (service-scoped)', 'Excellent (exact permissions)'] },
      { feature: 'Production Recommended', values: ['No (avoid in production)', 'Yes (default recommendation)', 'Yes (when predefined roles are too broad)'] },
      { feature: 'Best For', values: ['Quick prototyping, dev environments', 'Most production workloads', 'Strict compliance, exact permission control'] },
    ],
    decisionGuide: 'Avoid Basic Roles (Owner, Editor, Viewer) in production because they grant overly broad permissions across all services in a project. Use Predefined Roles as your default choice since Google maintains them with appropriate permissions for each service and they follow the principle of least privilege at the service level. Use Custom Roles only when no predefined role matches your exact needs, such as when a predefined role grants access to 20 permissions but your use case requires only 5. Remember that Custom Roles require ongoing maintenance as GCP APIs evolve.',
    exercises: [
      {
        scenario: 'A developer on a new team needs to view Cloud Storage objects and list buckets, but should not be able to create, delete, or modify any objects. There is a predefined role called roles/storage.objectViewer that grants storage.objects.get and storage.objects.list.',
        options: [
          { service: 'Basic Roles', points: 2, feedback: 'The Viewer basic role would grant read access to ALL resources in the project, not just Cloud Storage. This violates least privilege by exposing BigQuery datasets, Compute instances, and every other resource.' },
          { service: 'Predefined Roles', points: 10, feedback: 'Correct! roles/storage.objectViewer grants exactly the permissions needed: reading and listing objects in Cloud Storage. It follows least privilege without the maintenance burden of a custom role.' },
          { service: 'Custom Roles', points: 6, feedback: 'A custom role would work but is unnecessary overhead. The predefined roles/storage.objectViewer already provides exactly the permissions needed. Custom roles should be used only when no predefined role fits.' },
        ],
      },
      {
        scenario: 'A security audit requires that a CI/CD pipeline can deploy Cloud Functions and update Cloud Run services but must not be able to modify IAM policies, access secrets, or manage any other services. No single predefined role matches this exact combination.',
        options: [
          { service: 'Basic Roles', points: 1, feedback: 'The Editor role would grant the CI/CD pipeline write access to nearly every service in the project, including IAM and Secret Manager. This is a serious security risk for a CI/CD pipeline.' },
          { service: 'Predefined Roles', points: 5, feedback: 'You could combine roles/cloudfunctions.developer and roles/run.developer, but these predefined roles may include permissions beyond the strict requirements. If the audit demands exact permissions only, this may not pass compliance.' },
          { service: 'Custom Roles', points: 10, feedback: 'Correct! When a security audit demands a precise set of permissions with nothing extra, a custom role containing only the specific Cloud Functions deploy and Cloud Run update permissions is the right approach. It passes strict compliance audits by granting zero unnecessary permissions.' },
        ],
      },
    ],
  },

  // 10. Compute Engine vs GKE vs Cloud Run (full spectrum)
  {
    id: 'compute-engine-vs-gke-vs-cloud-run',
    title: 'Compute Engine vs GKE vs Cloud Run',
    subtitle: 'The full compute spectrum from IaaS to serverless',
    category: 'compute',
    services: ['Compute Engine', 'GKE', 'Cloud Run'],
    comparison: [
      { feature: 'Abstraction Level', values: ['IaaS (virtual machines)', 'CaaS (managed Kubernetes)', 'Serverless containers'] },
      { feature: 'Control', values: ['Full (OS, kernel, networking)', 'High (containers, networking, storage)', 'Limited (container config only)'] },
      { feature: 'Scaling', values: ['Managed Instance Groups (MIG) autoscaler', 'Horizontal Pod Autoscaler, Cluster Autoscaler', 'Automatic (0 to N instances)'] },
      { feature: 'Startup Time', values: ['30-90 seconds (VM boot)', '5-30 seconds (pod scheduling)', '0-2 seconds (cold start)'] },
      { feature: 'OS Access', values: ['Full SSH access, custom kernels', 'Node OS access (limited), container runtime', 'None (container only)'] },
      { feature: 'Licensing', values: ['BYOL supported, custom images', 'Container-based (no OS licensing)', 'Container-based (no OS licensing)'] },
      { feature: 'Operational Overhead', values: ['High (patching, security, monitoring)', 'Medium (cluster upgrades, node management)', 'Low (deploy containers only)'] },
      { feature: 'Best For', values: ['Legacy apps, custom OS needs, GPU/HPC', 'Microservices at scale, Kubernetes ecosystem', 'Event-driven services, APIs, batch jobs'] },
    ],
    decisionGuide: 'Choose Compute Engine when you need full control over the virtual machine, require custom OS configurations, specific kernel modules, BYOL software licensing, GPU passthrough for HPC, or are migrating legacy applications that cannot be containerized. Choose GKE when you are building a platform for many containerized services, need Kubernetes features like service discovery, rolling deployments, and persistent volumes, or your team already invests in the Kubernetes ecosystem. Choose Cloud Run when you want maximum developer velocity with minimum operational burden, your workloads are stateless and containerized, and you benefit from scale-to-zero pricing.',
    exercises: [
      {
        scenario: 'A research lab needs to run computational fluid dynamics (CFD) simulations using licensed software that requires a specific Linux kernel version, direct GPU access, and 500 GB of local SSD scratch space per job.',
        options: [
          { service: 'Compute Engine', points: 10, feedback: 'Correct! Compute Engine gives you full control to install the specific kernel version, attach GPU accelerators with passthrough, configure 500 GB local SSD, and install BYOL licensed software. No other GCP compute service offers this level of OS and hardware control.' },
          { service: 'GKE', points: 4, feedback: 'GKE supports GPU node pools and local SSDs, but installing a specific kernel version and licensed software that expects a traditional VM environment is significantly more complex in a containerized context.' },
          { service: 'Cloud Run', points: 1, feedback: 'Cloud Run has no GPU support, no local SSD, a maximum of 32 GB memory, and no OS-level customization. It is fundamentally unsuitable for HPC simulation workloads.' },
        ],
      },
      {
        scenario: 'A SaaS company is building a new platform with 30 microservices. They need service-to-service authentication, blue-green deployments, automatic sidecar injection for observability, persistent volume claims for stateful services, and their team has strong Kubernetes expertise.',
        options: [
          { service: 'Compute Engine', points: 3, feedback: 'Running 30 microservices on VMs would require building your own service discovery, load balancing, deployment orchestration, and sidecar management. This duplicates what Kubernetes provides out of the box.' },
          { service: 'GKE', points: 10, feedback: 'Perfect! GKE natively supports all requirements: Workload Identity for service-to-service auth, Deployment strategies for blue-green, managed Istio or Anthos Service Mesh for sidecar injection, PersistentVolumeClaims for stateful services, and the team can leverage their Kubernetes expertise directly.' },
          { service: 'Cloud Run', points: 5, feedback: 'Cloud Run could handle stateless microservices but does not support persistent volumes, automatic sidecar injection, or the full Kubernetes ecosystem features needed for this complex platform.' },
        ],
      },
    ],
  },
];
