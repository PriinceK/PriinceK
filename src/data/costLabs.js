export const COST_LABS = [
  // ──────────────────────────────────────────────
  // Lab 1 — Optimize a Web Application Stack
  // ──────────────────────────────────────────────
  {
    id: 'cost-lab-1',
    title: 'Optimize a Web Application Stack',
    difficulty: 'Beginner',
    description:
      'A startup is running a web application on GCP but their monthly bill is higher than expected. Review and optimize their infrastructure configuration.',
    scenario:
      'TechStartup Inc. deployed their web application 6 months ago but their monthly GCP bill has grown to $2,850/month. The CTO wants you to bring it under $1,200/month without impacting performance for their 10,000 daily active users.',
    constraints: [
      'Must maintain 99.9% availability',
      'Response time must stay under 200ms',
      'Must support 10,000 DAU with peak of 500 concurrent users',
    ],
    services: [
      {
        name: 'Compute Engine',
        description: 'Web server instances running the Node.js application',
        icon: 'Server',
        configOptions: {
          machineType: {
            label: 'Machine Type',
            choices: [
              { value: 'n1-standard-8', label: 'n1-standard-8 (8 vCPU, 30GB)', monthlyCost: 194 },
              { value: 'n1-standard-4', label: 'n1-standard-4 (4 vCPU, 15GB)', monthlyCost: 97 },
              { value: 'e2-standard-4', label: 'e2-standard-4 (4 vCPU, 16GB)', monthlyCost: 80 },
              { value: 'e2-standard-2', label: 'e2-standard-2 (2 vCPU, 8GB)', monthlyCost: 40 },
              { value: 'e2-medium', label: 'e2-medium (2 vCPU, 4GB)', monthlyCost: 24 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          instanceCount: {
            label: 'Instance Count',
            choices: [
              { value: 4, label: '4 instances', multiplier: 4 },
              { value: 3, label: '3 instances', multiplier: 3 },
              { value: 2, label: '2 instances', multiplier: 2 },
              { value: 1, label: '1 instance', multiplier: 1 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          committedUse: {
            label: 'Commitment',
            choices: [
              { value: 'none', label: 'On-demand (no discount)', discount: 0 },
              { value: '1-year', label: '1-year commitment (37% off)', discount: 0.37 },
              { value: '3-year', label: '3-year commitment (55% off)', discount: 0.55 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
      {
        name: 'Cloud SQL',
        description: 'PostgreSQL database for application data',
        icon: 'Database',
        configOptions: {
          tier: {
            label: 'Instance Tier',
            choices: [
              { value: 'db-custom-8-32768', label: 'db-custom-8-32768 (8 vCPU, 32GB RAM)', monthlyCost: 590 },
              { value: 'db-custom-4-16384', label: 'db-custom-4-16384 (4 vCPU, 16GB RAM)', monthlyCost: 295 },
              { value: 'db-custom-2-8192', label: 'db-custom-2-8192 (2 vCPU, 8GB RAM)', monthlyCost: 150 },
              { value: 'db-custom-1-3840', label: 'db-custom-1-3840 (1 vCPU, 3.75GB RAM)', monthlyCost: 75 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          highAvailability: {
            label: 'High Availability',
            choices: [
              { value: 'regional', label: 'Regional HA (failover replica)', costMultiplier: 2.0 },
              { value: 'zonal', label: 'Zonal (single zone)', costMultiplier: 1.0 },
            ],
            defaultIndex: 0,
            optimalIndex: 0,
          },
          storage: {
            label: 'Storage Size',
            choices: [
              { value: 500, label: '500 GB SSD ($85/mo)', monthlyCost: 85 },
              { value: 250, label: '250 GB SSD ($42.50/mo)', monthlyCost: 42.5 },
              { value: 100, label: '100 GB SSD ($17/mo)', monthlyCost: 17 },
              { value: 50, label: '50 GB SSD ($8.50/mo)', monthlyCost: 8.5 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Cloud Storage',
        description: 'Static assets, user uploads, and backups',
        icon: 'HardDrive',
        configOptions: {
          storageClass: {
            label: 'Storage Class (Assets - 200GB)',
            choices: [
              { value: 'standard', label: 'Standard ($0.020/GB)', monthlyCost: 4.0 },
              { value: 'nearline', label: 'Nearline ($0.010/GB)', monthlyCost: 2.0 },
              { value: 'coldline', label: 'Coldline ($0.004/GB)', monthlyCost: 0.8 },
            ],
            defaultIndex: 0,
            optimalIndex: 0,
          },
          backupClass: {
            label: 'Storage Class (Backups - 500GB)',
            choices: [
              { value: 'standard', label: 'Standard ($0.020/GB)', monthlyCost: 10.0 },
              { value: 'nearline', label: 'Nearline ($0.010/GB)', monthlyCost: 5.0 },
              { value: 'coldline', label: 'Coldline ($0.004/GB)', monthlyCost: 2.0 },
              { value: 'archive', label: 'Archive ($0.0012/GB)', monthlyCost: 0.6 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
    ],
    startingMonthlyCost: 2850,
    targetMonthlyCost: 1200,
    optimalMonthlyCost: 890,
    tips: [
      'E2 machine types offer similar performance to N1 at ~20% lower cost for most workloads',
      'Committed Use Discounts are worth it if your workload is steady for 1+ years',
      'Consider if all instances are needed 24/7 or if autoscaling could help',
      'Backups accessed infrequently are ideal candidates for Coldline or Archive storage',
    ],
    scoring: {
      excellent: { threshold: 1000, label: 'Cloud Cost Expert', message: 'Outstanding! You found the optimal configuration.' },
      good: { threshold: 1200, label: 'Cost Optimizer', message: 'Great job! You met the target budget.' },
      fair: { threshold: 1800, label: 'Getting There', message: 'Some savings found, but more optimization is possible.' },
      poor: { threshold: 99999, label: 'Needs Work', message: 'The bill is still too high. Review the optimization tips.' },
    },
  },

  // ──────────────────────────────────────────────
  // Lab 2 — Right-Size a Data Pipeline
  // ──────────────────────────────────────────────
  {
    id: 'cost-lab-2',
    title: 'Right-Size a Data Pipeline',
    difficulty: 'Intermediate',
    description:
      'A data analytics team built a pipeline to process daily event data, but it was configured for peak load at all times. Optimize the pipeline costs while maintaining SLAs.',
    scenario:
      'DataDriven Corp. ingests 2TB of raw event data daily from their e-commerce platform. Their current pipeline processes, transforms, and loads this data into BigQuery for analytics. The pipeline runs on fixed resources 24/7 even though most processing happens during a 6-hour nightly window. Monthly bill: $4,200. Target: under $2,500.',
    constraints: [
      'Nightly batch processing must complete within the 6-hour window (12AM–6AM)',
      'Ad-hoc queries must return results within 30 seconds for datasets under 1TB',
      'Data must be queryable within 8 hours of ingestion',
      'Must retain 12 months of processed data for compliance',
    ],
    services: [
      {
        name: 'Dataflow',
        description: 'Apache Beam pipeline for ETL processing',
        icon: 'Workflow',
        configOptions: {
          workerMachineType: {
            label: 'Worker Machine Type',
            choices: [
              { value: 'n1-standard-8', label: 'n1-standard-8 (8 vCPU, 30GB)', monthlyCostPerWorker: 194 },
              { value: 'n1-standard-4', label: 'n1-standard-4 (4 vCPU, 15GB)', monthlyCostPerWorker: 97 },
              { value: 'n1-highmem-4', label: 'n1-highmem-4 (4 vCPU, 26GB)', monthlyCostPerWorker: 120 },
              { value: 'e2-standard-4', label: 'e2-standard-4 (4 vCPU, 16GB)', monthlyCostPerWorker: 80 },
              { value: 'e2-standard-2', label: 'e2-standard-2 (2 vCPU, 8GB)', monthlyCostPerWorker: 40 },
            ],
            defaultIndex: 0,
            optimalIndex: 3,
          },
          maxWorkers: {
            label: 'Max Workers',
            choices: [
              { value: 20, label: '20 workers (fixed)', multiplier: 20 },
              { value: 15, label: '15 workers (fixed)', multiplier: 15 },
              { value: 10, label: '10 workers (fixed)', multiplier: 10 },
              { value: 8, label: '8 workers (fixed)', multiplier: 8 },
              { value: 5, label: '5 workers (fixed)', multiplier: 5 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          autoscaling: {
            label: 'Autoscaling',
            choices: [
              { value: 'none', label: 'Disabled (always at max workers)', costFactor: 1.0 },
              { value: 'basic', label: 'Basic autoscaling (min 2 workers)', costFactor: 0.45 },
              { value: 'aggressive', label: 'Aggressive autoscaling (min 1 worker)', costFactor: 0.35 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
      {
        name: 'BigQuery',
        description: 'Data warehouse for analytics and reporting',
        icon: 'BarChart',
        configOptions: {
          pricingModel: {
            label: 'Pricing Model',
            choices: [
              { value: 'on-demand', label: 'On-demand ($6.25/TB scanned)', monthlyCost: 1500 },
              { value: 'standard-edition', label: 'Standard Edition (100 slots)', monthlyCost: 1040 },
              { value: 'enterprise-edition', label: 'Enterprise Edition (100 slots)', monthlyCost: 1380 },
              { value: 'standard-flex', label: 'Standard Edition flex slots (autoscale)', monthlyCost: 650 },
            ],
            defaultIndex: 0,
            optimalIndex: 3,
          },
          storageOptimization: {
            label: 'Table Partitioning & Clustering',
            choices: [
              { value: 'none', label: 'No optimization (full scans)', scanReduction: 1.0 },
              { value: 'partitioned', label: 'Date-partitioned tables', scanReduction: 0.5 },
              { value: 'partitioned-clustered', label: 'Partitioned + clustered tables', scanReduction: 0.25 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Cloud Storage',
        description: 'Raw data landing zone and processed data archive',
        icon: 'HardDrive',
        configOptions: {
          landingZoneClass: {
            label: 'Landing Zone Class (2TB rotating)',
            choices: [
              { value: 'standard', label: 'Standard ($0.020/GB)', monthlyCost: 40 },
              { value: 'nearline', label: 'Nearline ($0.010/GB)', monthlyCost: 20 },
            ],
            defaultIndex: 0,
            optimalIndex: 0,
          },
          archiveClass: {
            label: 'Processed Archive Class (20TB)',
            choices: [
              { value: 'standard', label: 'Standard ($0.020/GB)', monthlyCost: 400 },
              { value: 'nearline', label: 'Nearline ($0.010/GB)', monthlyCost: 200 },
              { value: 'coldline', label: 'Coldline ($0.004/GB)', monthlyCost: 80 },
              { value: 'archive', label: 'Archive ($0.0012/GB)', monthlyCost: 24 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          lifecyclePolicy: {
            label: 'Lifecycle Policy',
            choices: [
              { value: 'none', label: 'No lifecycle rules', costReduction: 0 },
              { value: '90-day', label: 'Move to Coldline after 90 days', costReduction: 0.15 },
              { value: '30-day', label: 'Move to Coldline after 30 days, Archive after 90', costReduction: 0.30 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
    ],
    startingMonthlyCost: 4200,
    targetMonthlyCost: 2500,
    optimalMonthlyCost: 1680,
    tips: [
      'Dataflow autoscaling can reduce costs by 50-65% for batch workloads that do not run 24/7',
      'BigQuery flex slots let you pay only for what you use — ideal for variable query workloads',
      'Partitioning and clustering tables drastically reduces the amount of data scanned per query',
      'Use lifecycle policies to automatically move aging data to cheaper storage classes',
    ],
    scoring: {
      excellent: { threshold: 2000, label: 'Pipeline Cost Master', message: 'Outstanding! You squeezed every dollar out of this pipeline.' },
      good: { threshold: 2500, label: 'Data Cost Optimizer', message: 'Great job! You met the target budget.' },
      fair: { threshold: 3200, label: 'Getting There', message: 'Some savings achieved, but review autoscaling and storage tiers.' },
      poor: { threshold: 99999, label: 'Needs Work', message: 'The pipeline is still over-provisioned. Review the tips for guidance.' },
    },
  },

  // ──────────────────────────────────────────────
  // Lab 3 — Optimize Kubernetes Costs
  // ──────────────────────────────────────────────
  {
    id: 'cost-lab-3',
    title: 'Optimize Kubernetes Costs',
    difficulty: 'Intermediate',
    description:
      'A platform team is running microservices on GKE but resource requests are inflated and the cluster is over-provisioned. Optimize the Kubernetes infrastructure.',
    scenario:
      'CloudNative Ltd. migrated 12 microservices to GKE six months ago. The team over-provisioned everything "just in case" during the migration. CPU utilization across the cluster averages only 18%. Monthly bill: $3,800. The VP of Engineering wants it under $1,800 before the next board meeting.',
    constraints: [
      'All 12 microservices must remain running and healthy',
      'Must support rolling deployments with zero downtime',
      'Redis cache hit rate must stay above 95%',
      'Container images must remain available for rollback (last 10 versions)',
    ],
    services: [
      {
        name: 'GKE Cluster',
        description: 'Kubernetes cluster running 12 microservices',
        icon: 'Container',
        configOptions: {
          clusterMode: {
            label: 'Cluster Mode',
            choices: [
              { value: 'standard', label: 'GKE Standard (manual node management)', monthlyCost: 0 },
              { value: 'autopilot', label: 'GKE Autopilot (pay-per-pod)', monthlyCost: 0 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          machineType: {
            label: 'Node Machine Type',
            choices: [
              { value: 'n1-standard-8', label: 'n1-standard-8 (8 vCPU, 30GB)', monthlyCost: 194 },
              { value: 'e2-standard-8', label: 'e2-standard-8 (8 vCPU, 32GB)', monthlyCost: 155 },
              { value: 'e2-standard-4', label: 'e2-standard-4 (4 vCPU, 16GB)', monthlyCost: 80 },
              { value: 'e2-medium', label: 'e2-medium (2 vCPU, 4GB)', monthlyCost: 24 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          nodeCount: {
            label: 'Node Count',
            choices: [
              { value: 10, label: '10 nodes (fixed)', multiplier: 10 },
              { value: 8, label: '8 nodes (fixed)', multiplier: 8 },
              { value: 6, label: '6 nodes (fixed)', multiplier: 6 },
              { value: 4, label: '4 nodes (with cluster autoscaler)', multiplier: 4 },
              { value: 3, label: '3 nodes (with cluster autoscaler)', multiplier: 3 },
            ],
            defaultIndex: 0,
            optimalIndex: 3,
          },
          committedUse: {
            label: 'Commitment',
            choices: [
              { value: 'none', label: 'On-demand (no discount)', discount: 0 },
              { value: '1-year', label: '1-year commitment (37% off)', discount: 0.37 },
              { value: '3-year', label: '3-year commitment (55% off)', discount: 0.55 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
      {
        name: 'Memorystore (Redis)',
        description: 'Managed Redis for session caching and rate limiting',
        icon: 'Zap',
        configOptions: {
          tier: {
            label: 'Service Tier',
            choices: [
              { value: 'standard', label: 'Standard Tier (HA with replica)', monthlyCost: 292 },
              { value: 'basic', label: 'Basic Tier (single node, no HA)', monthlyCost: 146 },
            ],
            defaultIndex: 0,
            optimalIndex: 0,
          },
          instanceSize: {
            label: 'Instance Size',
            choices: [
              { value: 16, label: '16 GB', costMultiplier: 1.0 },
              { value: 8, label: '8 GB', costMultiplier: 0.5 },
              { value: 4, label: '4 GB', costMultiplier: 0.25 },
              { value: 1, label: '1 GB', costMultiplier: 0.0625 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Artifact Registry',
        description: 'Container image registry for microservice builds',
        icon: 'Package',
        configOptions: {
          storedImages: {
            label: 'Image Retention',
            choices: [
              { value: 'all', label: 'Keep all versions (estimated 500GB)', monthlyCost: 50 },
              { value: '30-versions', label: 'Keep last 30 versions per service (~150GB)', monthlyCost: 15 },
              { value: '10-versions', label: 'Keep last 10 versions per service (~50GB)', monthlyCost: 5 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          vulnerabilityScanning: {
            label: 'Vulnerability Scanning',
            choices: [
              { value: 'all', label: 'Scan all images on push ($0.26/image, ~200/mo)', monthlyCost: 52 },
              { value: 'latest', label: 'Scan latest image only ($0.26/image, ~60/mo)', monthlyCost: 15.6 },
              { value: 'none', label: 'No scanning', monthlyCost: 0 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
    ],
    startingMonthlyCost: 3800,
    targetMonthlyCost: 1800,
    optimalMonthlyCost: 1150,
    tips: [
      'GKE Autopilot charges only for pod resource requests — you stop paying for unused node capacity',
      'Cluster autoscaler can dynamically adjust node count based on pending pod demand',
      'Right-size your Redis instance — if hit rate is 95%+ at 4GB, you do not need 16GB',
      'Set up a cleanup policy in Artifact Registry to delete old images automatically and save storage costs',
    ],
    scoring: {
      excellent: { threshold: 1400, label: 'Kubernetes Cost Guru', message: 'Outstanding! You know how to run lean clusters.' },
      good: { threshold: 1800, label: 'K8s Optimizer', message: 'Great job! You met the target budget.' },
      fair: { threshold: 2600, label: 'Getting There', message: 'Some savings found. Look into Autopilot and right-sizing Redis.' },
      poor: { threshold: 99999, label: 'Needs Work', message: 'The cluster is still running hot on cost. Review Autopilot and autoscaler options.' },
    },
  },

  // ──────────────────────────────────────────────
  // Lab 4 — Reduce AI/ML Training Costs
  // ──────────────────────────────────────────────
  {
    id: 'cost-lab-4',
    title: 'Reduce AI/ML Training Costs',
    difficulty: 'Advanced',
    description:
      'An ML team is training and serving computer vision models on Vertex AI, but they are using expensive on-demand GPUs and over-provisioned serving infrastructure. Optimize costs without sacrificing model quality.',
    scenario:
      'VisionAI Corp. trains a new image classification model weekly and serves predictions to 50,000 requests/day. Training takes 8 hours on their current setup. Their monthly GCP bill for the ML pipeline is $8,500. The CFO has mandated a reduction to $4,000/month while maintaining the weekly training cadence and serving latency SLAs.',
    constraints: [
      'Weekly training must complete within 12 hours',
      'Serving latency must remain under 100ms at p95',
      'Model accuracy must not degrade (same training data and hyperparameters)',
      'Must handle 50,000 prediction requests/day with 2x burst capacity',
    ],
    services: [
      {
        name: 'Vertex AI Training',
        description: 'Weekly model training jobs for image classification',
        icon: 'Brain',
        configOptions: {
          machineType: {
            label: 'Training Machine Type',
            choices: [
              { value: 'n1-highmem-16', label: 'n1-highmem-16 (16 vCPU, 104GB RAM)', monthlyCostPerHour: 1.14 },
              { value: 'n1-standard-8', label: 'n1-standard-8 (8 vCPU, 30GB RAM)', monthlyCostPerHour: 0.57 },
              { value: 'n1-standard-4', label: 'n1-standard-4 (4 vCPU, 15GB RAM)', monthlyCostPerHour: 0.28 },
              { value: 'e2-standard-8', label: 'e2-standard-8 (8 vCPU, 32GB RAM)', monthlyCostPerHour: 0.45 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          gpuType: {
            label: 'GPU Accelerator',
            choices: [
              { value: 'nvidia-a100', label: 'NVIDIA A100 40GB (x2)', monthlyCost: 4600 },
              { value: 'nvidia-v100', label: 'NVIDIA V100 16GB (x2)', monthlyCost: 2800 },
              { value: 'nvidia-t4', label: 'NVIDIA T4 16GB (x2)', monthlyCost: 1050 },
              { value: 'nvidia-t4-single', label: 'NVIDIA T4 16GB (x1)', monthlyCost: 525 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          preemptible: {
            label: 'VM Provisioning Model',
            choices: [
              { value: 'on-demand', label: 'On-demand (guaranteed availability)', discount: 0 },
              { value: 'spot', label: 'Spot VMs (60-91% discount, may be preempted)', discount: 0.70 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
      {
        name: 'Cloud Storage',
        description: 'Training datasets, model artifacts, and checkpoints',
        icon: 'HardDrive',
        configOptions: {
          trainingDataClass: {
            label: 'Training Data Storage (5TB)',
            choices: [
              { value: 'standard', label: 'Standard ($0.020/GB)', monthlyCost: 100 },
              { value: 'nearline', label: 'Nearline ($0.010/GB)', monthlyCost: 50 },
            ],
            defaultIndex: 0,
            optimalIndex: 0,
          },
          checkpointRetention: {
            label: 'Model Checkpoint Retention (2TB)',
            choices: [
              { value: 'keep-all', label: 'Keep all checkpoints — Standard ($0.020/GB)', monthlyCost: 40 },
              { value: 'keep-recent', label: 'Keep last 4 weeks — Standard', monthlyCost: 10 },
              { value: 'keep-recent-nearline', label: 'Keep last 4 weeks — Nearline', monthlyCost: 5 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Compute Engine (Serving)',
        description: 'Model serving instances behind a load balancer',
        icon: 'Server',
        configOptions: {
          servingMachineType: {
            label: 'Serving Machine Type',
            choices: [
              { value: 'n1-standard-8-t4', label: 'n1-standard-8 + T4 GPU (8 vCPU, 30GB)', monthlyCost: 560 },
              { value: 'n1-standard-4-t4', label: 'n1-standard-4 + T4 GPU (4 vCPU, 15GB)', monthlyCost: 410 },
              { value: 'n1-standard-4', label: 'n1-standard-4 CPU-only (4 vCPU, 15GB)', monthlyCost: 97 },
              { value: 'e2-standard-4', label: 'e2-standard-4 CPU-only (4 vCPU, 16GB)', monthlyCost: 80 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          servingInstances: {
            label: 'Serving Instance Count',
            choices: [
              { value: 4, label: '4 instances (always on)', multiplier: 4 },
              { value: 3, label: '3 instances (always on)', multiplier: 3 },
              { value: 2, label: '2 instances (with autoscaling to 4)', multiplier: 2 },
              { value: 1, label: '1 instance (with autoscaling to 3)', multiplier: 1 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          committedUse: {
            label: 'Serving Commitment',
            choices: [
              { value: 'none', label: 'On-demand (no discount)', discount: 0 },
              { value: '1-year', label: '1-year commitment (37% off)', discount: 0.37 },
              { value: '3-year', label: '3-year commitment (55% off)', discount: 0.55 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
    ],
    startingMonthlyCost: 8500,
    targetMonthlyCost: 4000,
    optimalMonthlyCost: 2150,
    tips: [
      'Spot VMs can save 60-91% on training costs — add checkpointing to handle preemptions gracefully',
      'T4 GPUs are 60-75% cheaper than A100s and sufficient for many image classification workloads',
      'GPU serving is only necessary if you need sub-10ms latency — CPU inference at 50-80ms often meets SLAs',
      'Autoscaling serving instances from a base of 2 can handle burst traffic without paying for idle capacity',
    ],
    scoring: {
      excellent: { threshold: 2800, label: 'ML Cost Architect', message: 'Outstanding! You mastered GPU cost optimization.' },
      good: { threshold: 4000, label: 'ML Cost Optimizer', message: 'Great job! You met the target budget.' },
      fair: { threshold: 6000, label: 'Getting There', message: 'Some savings found. Explore spot VMs and GPU right-sizing.' },
      poor: { threshold: 99999, label: 'Needs Work', message: 'ML costs are still too high. Focus on GPU selection and spot instances.' },
    },
  },

  // ──────────────────────────────────────────────
  // Lab 5 — Multi-Region Architecture Cost Trim
  // ──────────────────────────────────────────────
  {
    id: 'cost-lab-5',
    title: 'Multi-Region Architecture Cost Trim',
    difficulty: 'Advanced',
    description:
      'A global SaaS company deployed a multi-region architecture for high availability, but much of the redundancy is unnecessary for their actual traffic patterns. Trim costs while maintaining a strong global presence.',
    scenario:
      'GlobalServe SaaS runs a customer-facing platform serving users across North America, Europe, and Asia-Pacific. They built a fully redundant multi-region setup anticipating global growth, but 85% of traffic comes from North America and Europe. Their infrastructure bill is $12,000/month. The goal: reduce it to $7,000/month while maintaining excellent performance for their primary markets.',
    constraints: [
      'Latency under 100ms for North America and Europe users',
      'Latency under 250ms for Asia-Pacific users',
      'Must maintain 99.99% uptime SLA for the database layer',
      'Must support 200,000 daily active users globally',
      'Compliance requires data residency in at least US and EU regions',
    ],
    services: [
      {
        name: 'Cloud Spanner',
        description: 'Globally distributed relational database',
        icon: 'Globe',
        configOptions: {
          nodeCount: {
            label: 'Node Count',
            choices: [
              { value: 9, label: '9 nodes (3 per region)', monthlyCostPerNode: 650 },
              { value: 6, label: '6 nodes (2 per region)', monthlyCostPerNode: 650 },
              { value: 3, label: '3 nodes (1 per region)', monthlyCostPerNode: 650 },
              { value: 2, label: '2 nodes (dual-region)', monthlyCostPerNode: 650 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          regionConfig: {
            label: 'Regional Configuration',
            choices: [
              { value: 'nam-eur-asia', label: 'Tri-region (US, EU, Asia)', costMultiplier: 1.0 },
              { value: 'nam-eur', label: 'Dual-region (US + EU) with read replicas in Asia', costMultiplier: 0.75 },
              { value: 'nam-only', label: 'Single region (US) with read replicas', costMultiplier: 0.5 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
      {
        name: 'Cloud CDN',
        description: 'Content delivery network for static and dynamic content',
        icon: 'Network',
        configOptions: {
          cachingPolicy: {
            label: 'Caching Policy',
            choices: [
              { value: 'minimal', label: 'Minimal caching (5 min TTL, dynamic bypass)', monthlyCost: 850 },
              { value: 'standard', label: 'Standard caching (1 hr TTL, cache static)', monthlyCost: 450 },
              { value: 'aggressive', label: 'Aggressive caching (24 hr TTL, edge compute)', monthlyCost: 280 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          cacheStorage: {
            label: 'CDN Cache Fill Optimization',
            choices: [
              { value: 'none', label: 'No optimization (frequent origin fetches)', monthlyCost: 320 },
              { value: 'regional', label: 'Regional cache fill (mid-tier caching)', monthlyCost: 160 },
              { value: 'optimized', label: 'Cross-region cache fill minimization', monthlyCost: 80 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Cloud Load Balancing',
        description: 'Global and regional load balancers',
        icon: 'Scale',
        configOptions: {
          lbType: {
            label: 'Load Balancer Type',
            choices: [
              { value: 'premium-global', label: 'Premium Tier Global LB ($0.035/GB processed)', monthlyCost: 700 },
              { value: 'standard-global', label: 'Standard Tier Global LB ($0.025/GB processed)', monthlyCost: 500 },
              { value: 'standard-regional', label: 'Standard Tier Regional LBs (2 regions)', monthlyCost: 350 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          forwardingRules: {
            label: 'Forwarding Rules',
            choices: [
              { value: 10, label: '10 rules ($18/rule/mo)', monthlyCost: 180 },
              { value: 5, label: '5 rules (consolidated)', monthlyCost: 90 },
              { value: 3, label: '3 rules (highly consolidated)', monthlyCost: 54 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
        },
      },
      {
        name: 'Compute Engine',
        description: 'Application server fleet across multiple regions',
        icon: 'Server',
        configOptions: {
          regions: {
            label: 'Deployment Regions',
            choices: [
              { value: 'us-eu-asia', label: '3 regions (us-central1, europe-west1, asia-east1)', regionMultiplier: 3 },
              { value: 'us-eu', label: '2 regions (us-central1, europe-west1)', regionMultiplier: 2 },
              { value: 'us-only', label: '1 region (us-central1)', regionMultiplier: 1 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
          machineType: {
            label: 'Machine Type (per region)',
            choices: [
              { value: 'n1-standard-8', label: 'n1-standard-8 (8 vCPU, 30GB) x 4 per region', monthlyCostPerRegion: 776 },
              { value: 'e2-standard-4', label: 'e2-standard-4 (4 vCPU, 16GB) x 4 per region', monthlyCostPerRegion: 320 },
              { value: 'e2-standard-4-scaled', label: 'e2-standard-4 (4 vCPU, 16GB) x 3 per region', monthlyCostPerRegion: 240 },
              { value: 'e2-standard-2', label: 'e2-standard-2 (2 vCPU, 8GB) x 4 per region', monthlyCostPerRegion: 160 },
            ],
            defaultIndex: 0,
            optimalIndex: 2,
          },
          committedUse: {
            label: 'Commitment',
            choices: [
              { value: 'none', label: 'On-demand (no discount)', discount: 0 },
              { value: '1-year', label: '1-year commitment (37% off)', discount: 0.37 },
              { value: '3-year', label: '3-year commitment (55% off)', discount: 0.55 },
            ],
            defaultIndex: 0,
            optimalIndex: 1,
          },
        },
      },
    ],
    startingMonthlyCost: 12000,
    targetMonthlyCost: 7000,
    optimalMonthlyCost: 4450,
    tips: [
      'If 85% of traffic is from 2 regions, a full tri-region database deployment may not be necessary — use read replicas for the third region instead',
      'Aggressive CDN caching can offload 60-80% of requests from your origin servers, reducing both compute and network costs',
      'Standard tier networking is significantly cheaper than Premium tier and still provides good global performance when paired with CDN',
      'Consolidate forwarding rules — each rule has a fixed monthly cost that adds up quickly across services',
    ],
    scoring: {
      excellent: { threshold: 5500, label: 'Global Infra Architect', message: 'Outstanding! You optimized a complex multi-region architecture masterfully.' },
      good: { threshold: 7000, label: 'Cost-Conscious Architect', message: 'Great job! You met the target budget while maintaining global coverage.' },
      fair: { threshold: 9000, label: 'Getting There', message: 'Some savings found. Consider reducing region count and leveraging CDN more.' },
      poor: { threshold: 99999, label: 'Needs Work', message: 'The global infrastructure is still too expensive. Focus on right-sizing regions and caching.' },
    },
  },
];
