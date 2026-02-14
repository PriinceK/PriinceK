export const EXAM_QUESTIONS = [
  // ============================================================
  // COMPUTE DOMAIN (12 questions)
  // ============================================================
  {
    id: 'exam-001',
    type: 'single',
    domain: 'compute',
    question: 'Your team is deploying a stateless web application that experiences unpredictable traffic spikes throughout the day. The application needs to scale from 2 to 50 instances within 60 seconds. Which Compute Engine configuration should you use?',
    options: [
      { id: 'a', text: 'Create a managed instance group with autoscaling based on CPU utilization and set the cool-down period to 60 seconds.' },
      { id: 'b', text: 'Create an unmanaged instance group and manually add instances when traffic increases.' },
      { id: 'c', text: 'Deploy the application on a single large instance with enough capacity to handle peak traffic.' },
      { id: 'd', text: 'Create a managed instance group with autoscaling based on load balancing serving capacity and set the minimum number of instances to 50.' }
    ],
    correct: ['a'],
    explanation: 'A managed instance group (MIG) with autoscaling based on CPU utilization is ideal for stateless workloads with unpredictable traffic. The cool-down period of 60 seconds ensures rapid scaling. Unmanaged instance groups do not support autoscaling, a single large instance is wasteful and not resilient, and setting minimum instances to 50 defeats the purpose of autoscaling.',
    difficulty: 'beginner',
    reference: 'Compute Engine: Autoscaling groups of instances'
  },
  {
    id: 'exam-002',
    type: 'single',
    domain: 'compute',
    question: 'A financial services company requires that their Compute Engine VMs run on hardware that is not shared with other customers for regulatory compliance. Which option should you choose?',
    options: [
      { id: 'a', text: 'Use preemptible VMs to ensure dedicated capacity.' },
      { id: 'b', text: 'Use sole-tenant nodes to ensure physical isolation.' },
      { id: 'c', text: 'Use custom machine types with maximum vCPUs to guarantee isolation.' },
      { id: 'd', text: 'Use shielded VMs to ensure hardware-level isolation.' }
    ],
    correct: ['b'],
    explanation: 'Sole-tenant nodes provide physical servers dedicated exclusively to your project, ensuring that your VMs do not share hardware with VMs from other projects. This is required for certain compliance and licensing scenarios. Preemptible VMs, custom machine types, and shielded VMs do not guarantee dedicated hardware.',
    difficulty: 'intermediate',
    reference: 'Compute Engine: Sole-tenant nodes'
  },
  {
    id: 'exam-003',
    type: 'single',
    domain: 'compute',
    question: 'You have a batch processing workload that can tolerate interruptions and takes approximately 4 hours to complete. You want to minimize costs. What type of VM should you use?',
    options: [
      { id: 'a', text: 'Standard N2 instances with committed use discounts.' },
      { id: 'b', text: 'Spot VMs (preemptible) with a checkpoint mechanism to save progress.' },
      { id: 'c', text: 'E2 shared-core instances for lowest baseline cost.' },
      { id: 'd', text: 'C2 compute-optimized instances for fastest completion time.' }
    ],
    correct: ['b'],
    explanation: 'Spot VMs (formerly preemptible VMs) offer up to 60-91% discount compared to standard pricing. Since the workload tolerates interruptions, using Spot VMs with checkpointing is the most cost-effective approach. Committed use discounts require long-term commitments, shared-core instances lack processing power, and compute-optimized instances prioritize performance over cost.',
    difficulty: 'beginner',
    reference: 'Compute Engine: Spot VMs'
  },
  {
    id: 'exam-004',
    type: 'multi',
    domain: 'compute',
    question: 'Your organization needs to migrate a set of on-premises VMs to Google Cloud. The VMs run a mix of Windows and Linux operating systems and you need to minimize downtime and manual effort. Which two actions should you take? (Choose two.)',
    options: [
      { id: 'a', text: 'Use Migrate to Virtual Machines (formerly Migrate for Compute Engine) to perform a lift-and-shift migration.' },
      { id: 'b', text: 'Manually create machine images and upload them to Cloud Storage, then create instances from the images.' },
      { id: 'c', text: 'Set up continuous replication from on-premises to Google Cloud before performing the final cutover.' },
      { id: 'd', text: 'Rebuild all applications from scratch using cloud-native services.' }
    ],
    correct: ['a', 'c'],
    explanation: 'Migrate to Virtual Machines automates the lift-and-shift migration process for both Windows and Linux VMs. Setting up continuous replication before the cutover minimizes downtime by keeping the cloud copy in sync with on-premises. Manual image creation is labor-intensive and error-prone, and rebuilding from scratch is unnecessary for a migration.',
    difficulty: 'intermediate',
    reference: 'Migrate to Virtual Machines overview'
  },
  {
    id: 'exam-005',
    type: 'single',
    domain: 'compute',
    question: 'You are running a memory-intensive application that requires 512 GB of RAM and 32 vCPUs. The predefined machine types do not match this ratio. What should you do?',
    options: [
      { id: 'a', text: 'Select an N2 highmem machine type and attach additional memory.' },
      { id: 'b', text: 'Create a custom machine type with 32 vCPUs and 512 GB of extended memory.' },
      { id: 'c', text: 'Select the largest available predefined machine type even if it provides more vCPUs than needed.' },
      { id: 'd', text: 'Deploy the application across multiple smaller VMs and partition the data.' }
    ],
    correct: ['b'],
    explanation: 'Custom machine types allow you to specify the exact number of vCPUs and memory you need. When the memory-per-vCPU ratio exceeds the standard limit (8 GB per vCPU for most families), you can use extended memory to go up to 624 GB per VM on N1 or higher on N2. This is more cost-effective than over-provisioning with a larger predefined type.',
    difficulty: 'intermediate',
    reference: 'Compute Engine: Custom machine types'
  },
  {
    id: 'exam-006',
    type: 'single',
    domain: 'compute',
    question: 'Your application runs on a managed instance group behind a global HTTP(S) load balancer. You need to deploy a new version with zero downtime and the ability to roll back quickly. What deployment strategy should you use?',
    options: [
      { id: 'a', text: 'Delete the existing managed instance group and create a new one with the updated template.' },
      { id: 'b', text: 'Perform a rolling update on the managed instance group with maxSurge set to 3 and maxUnavailable set to 0.' },
      { id: 'c', text: 'SSH into each instance individually and update the application binaries.' },
      { id: 'd', text: 'Stop all instances, update the instance template, and restart all instances.' }
    ],
    correct: ['b'],
    explanation: 'A rolling update with maxUnavailable set to 0 ensures that no instances are taken down during the update, achieving zero downtime. Setting maxSurge to 3 allows new instances to be created before old ones are removed. If issues arise, you can roll back to the previous instance template. Deleting the group or stopping all instances causes downtime, and manual SSH updates are not scalable.',
    difficulty: 'advanced',
    reference: 'Compute Engine: Rolling updates'
  },
  {
    id: 'exam-007',
    type: 'single',
    domain: 'compute',
    question: 'You want to run a containerized microservice on Google Cloud without managing the underlying infrastructure. The service needs to scale to zero when not in use and handle HTTP requests. Which service should you use?',
    options: [
      { id: 'a', text: 'Deploy the container on a Compute Engine VM with a startup script.' },
      { id: 'b', text: 'Deploy the container on Google Kubernetes Engine with Horizontal Pod Autoscaler.' },
      { id: 'c', text: 'Deploy the container on Cloud Run.' },
      { id: 'd', text: 'Deploy the container on App Engine Flexible Environment.' }
    ],
    correct: ['c'],
    explanation: 'Cloud Run is a fully managed serverless platform that runs stateless containers. It scales automatically based on incoming requests and can scale to zero when there is no traffic, minimizing costs. Compute Engine requires infrastructure management, GKE requires cluster management and does not natively scale to zero pods, and App Engine Flexible does not scale to zero.',
    difficulty: 'beginner',
    reference: 'Cloud Run overview'
  },
  {
    id: 'exam-008',
    type: 'single',
    domain: 'compute',
    question: 'You need to ensure that a Compute Engine instance automatically restarts if it crashes due to a host maintenance event or unexpected failure. The instance runs a critical database. What should you configure?',
    options: [
      { id: 'a', text: 'Set the instance availability policy to "Migrate on maintenance" and enable automatic restart.' },
      { id: 'b', text: 'Create a Cloud Scheduler job to periodically check if the instance is running.' },
      { id: 'c', text: 'Use a preemptible VM which automatically restarts after being preempted.' },
      { id: 'd', text: 'Set up a health check in Cloud Monitoring and use a Cloud Function to restart the VM.' }
    ],
    correct: ['a'],
    explanation: 'Setting the availability policy to "Migrate on maintenance" live-migrates the VM during host maintenance events, and enabling automatic restart ensures the VM restarts after a crash or non-live-migratable maintenance event. This is the built-in, recommended approach for critical workloads. Preemptible VMs do not automatically restart and are not suitable for critical databases.',
    difficulty: 'intermediate',
    reference: 'Compute Engine: Setting instance availability policies'
  },
  {
    id: 'exam-009',
    type: 'single',
    domain: 'compute',
    question: 'Your company has a 3-year commitment to run specific workloads on Google Cloud. You want to get the maximum possible discount on Compute Engine resources. Which pricing model should you use?',
    options: [
      { id: 'a', text: 'Sustained use discounts applied automatically to on-demand usage.' },
      { id: 'b', text: 'Committed use discounts with a 3-year term.' },
      { id: 'c', text: 'Spot VM pricing for all workloads.' },
      { id: 'd', text: 'Use only E2 machine types since they have the lowest per-vCPU cost.' }
    ],
    correct: ['b'],
    explanation: 'Committed use discounts (CUDs) offer up to 57% discount for a 3-year commitment on specific resource configurations. This provides the highest guaranteed discount for predictable workloads. Sustained use discounts cap at 30%, Spot VMs can be interrupted, and E2 machine types may not provide the best discount compared to CUDs.',
    difficulty: 'beginner',
    reference: 'Compute Engine: Committed use discounts'
  },
  {
    id: 'exam-010',
    type: 'single',
    domain: 'compute',
    question: 'A development team needs a GKE cluster that minimizes operational overhead while meeting the following requirements: automatic node upgrades, automatic scaling, and built-in security patching. Which mode should you use?',
    options: [
      { id: 'a', text: 'GKE Standard mode with manual node pool management.' },
      { id: 'b', text: 'GKE Autopilot mode.' },
      { id: 'c', text: 'GKE Standard mode with node auto-provisioning enabled.' },
      { id: 'd', text: 'Deploy Kubernetes manually on Compute Engine instances for full control.' }
    ],
    correct: ['b'],
    explanation: 'GKE Autopilot is a fully managed mode where Google manages the entire cluster infrastructure including nodes, scaling, security, and upgrades. It provides a hands-off experience that minimizes operational overhead. Standard mode requires more manual configuration, and self-managed Kubernetes on Compute Engine provides no managed benefits.',
    difficulty: 'intermediate',
    reference: 'GKE: Autopilot overview'
  },
  {
    id: 'exam-011',
    type: 'single',
    domain: 'compute',
    question: 'You are troubleshooting a Compute Engine instance that is unreachable via SSH. The instance has no external IP address and is in a private subnet. How should you connect to the instance?',
    options: [
      { id: 'a', text: 'Assign a temporary external IP, connect via SSH, and remove it afterward.' },
      { id: 'b', text: 'Use Identity-Aware Proxy (IAP) TCP tunneling to establish an SSH connection.' },
      { id: 'c', text: 'Use the serial console to log in with a local password.' },
      { id: 'd', text: 'Create a VPN connection from your local machine to the VPC network.' }
    ],
    correct: ['b'],
    explanation: 'IAP TCP tunneling allows you to SSH into instances without external IP addresses by tunneling the SSH connection through the IAP proxy. This is the recommended secure approach for accessing private instances. Assigning a temporary external IP exposes the instance, the serial console is for emergency troubleshooting, and creating a VPN is excessive for SSH access.',
    difficulty: 'intermediate',
    reference: 'Identity-Aware Proxy: TCP forwarding'
  },
  {
    id: 'exam-012',
    type: 'multi',
    domain: 'compute',
    question: 'You need to create a Compute Engine instance template for a managed instance group that will run a web application. The application requires a custom startup configuration and access to Cloud Storage. Which two settings should you configure in the instance template? (Choose two.)',
    options: [
      { id: 'a', text: 'Add a startup script in the instance template metadata to install and configure the application.' },
      { id: 'b', text: 'Assign a service account with the storage.objectViewer role to the instance template.' },
      { id: 'c', text: 'SSH into each instance after creation to install the application manually.' },
      { id: 'd', text: 'Use the default Compute Engine service account with full project editor permissions.' }
    ],
    correct: ['a', 'b'],
    explanation: 'Instance templates support startup scripts in metadata to automate provisioning of new instances in the MIG. Assigning a service account with the least-privilege storage.objectViewer role follows security best practices. Manual SSH configuration is not scalable with MIGs, and using the default service account with editor permissions violates the principle of least privilege.',
    difficulty: 'intermediate',
    reference: 'Compute Engine: Instance templates'
  },

  // ============================================================
  // STORAGE DOMAIN (12 questions)
  // ============================================================
  {
    id: 'exam-013',
    type: 'single',
    domain: 'storage',
    question: 'Your company stores infrequently accessed log files that must be retained for 7 years for compliance. The files are rarely read but must be retrievable within a few hours when needed. Which Cloud Storage class should you use?',
    options: [
      { id: 'a', text: 'Standard storage class for maximum availability.' },
      { id: 'b', text: 'Nearline storage class for data accessed less than once per month.' },
      { id: 'c', text: 'Coldline storage class for data accessed less than once per quarter.' },
      { id: 'd', text: 'Archive storage class for data accessed less than once per year.' }
    ],
    correct: ['d'],
    explanation: 'Archive storage is designed for data that is accessed less than once per year and stored for long-term retention. It offers the lowest storage cost and is ideal for compliance archives. While retrieval costs are higher, the data is still retrievable within milliseconds to hours. Nearline and Coldline are for more frequently accessed data and would cost more for long-term storage.',
    difficulty: 'beginner',
    reference: 'Cloud Storage: Storage classes'
  },
  {
    id: 'exam-014',
    type: 'single',
    domain: 'storage',
    question: 'You need to automatically transition objects in a Cloud Storage bucket from Standard to Nearline after 30 days, and to Coldline after 90 days. What should you configure?',
    options: [
      { id: 'a', text: 'Create a Cloud Scheduler job that runs a script to move objects between buckets.' },
      { id: 'b', text: 'Configure Object Lifecycle Management rules on the bucket.' },
      { id: 'c', text: 'Use Transfer Service to move objects between storage classes on a schedule.' },
      { id: 'd', text: 'Write a Cloud Function triggered by a Pub/Sub cron schedule to change storage classes.' }
    ],
    correct: ['b'],
    explanation: 'Object Lifecycle Management allows you to define rules that automatically transition objects to different storage classes or delete them based on conditions like age, creation date, or storage class. This is a built-in feature that requires no custom code or external scheduling. Cloud Scheduler scripts and Cloud Functions add unnecessary complexity.',
    difficulty: 'beginner',
    reference: 'Cloud Storage: Object Lifecycle Management'
  },
  {
    id: 'exam-015',
    type: 'single',
    domain: 'storage',
    question: 'Your application requires a high-performance file system shared across multiple Compute Engine instances in the same zone. The workload involves heavy random read/write operations on thousands of small files. Which storage option should you use?',
    options: [
      { id: 'a', text: 'Cloud Storage FUSE to mount a Cloud Storage bucket as a file system.' },
      { id: 'b', text: 'Filestore Enterprise tier for high-performance NFS storage.' },
      { id: 'c', text: 'Persistent Disk SSD attached to one instance and shared via NFS.' },
      { id: 'd', text: 'Local SSD attached to each instance for maximum IOPS.' }
    ],
    correct: ['b'],
    explanation: 'Filestore Enterprise tier provides a fully managed high-performance NFS file system that can be shared across multiple Compute Engine instances. It supports high IOPS and throughput for random read/write operations. Cloud Storage FUSE has higher latency for small files, manually configuring NFS over Persistent Disk is operationally complex, and Local SSDs are not shared across instances.',
    difficulty: 'intermediate',
    reference: 'Filestore: Overview'
  },
  {
    id: 'exam-016',
    type: 'single',
    domain: 'storage',
    question: 'You accidentally deleted a critical object from a Cloud Storage bucket. You need to recover it. The bucket has versioning enabled. How should you recover the object?',
    options: [
      { id: 'a', text: 'Contact Google Cloud Support to restore the object from their internal backups.' },
      { id: 'b', text: 'List the noncurrent versions of the object and copy the desired version to make it the live version.' },
      { id: 'c', text: 'Restore the object from a Cloud Storage snapshot.' },
      { id: 'd', text: 'Use the Cloud Storage undelete command to recover the most recent version.' }
    ],
    correct: ['b'],
    explanation: 'When versioning is enabled, deleting an object creates a noncurrent version rather than permanently removing it. You can list noncurrent versions using gsutil or the Cloud Console and copy the desired version back to the same location to make it the current live version. Cloud Storage does not have snapshots or a built-in undelete command.',
    difficulty: 'intermediate',
    reference: 'Cloud Storage: Object versioning'
  },
  {
    id: 'exam-017',
    type: 'single',
    domain: 'storage',
    question: 'Your organization requires that certain Cloud Storage objects cannot be deleted or overwritten for a minimum of 5 years, even by project owners. Which feature should you use?',
    options: [
      { id: 'a', text: 'Set IAM policies to deny the storage.objects.delete permission for all users.' },
      { id: 'b', text: 'Enable Object Versioning to preserve all versions of objects.' },
      { id: 'c', text: 'Configure a retention policy with a 5-year retention period and lock it on the bucket.' },
      { id: 'd', text: 'Use a bucket-level ACL to set the bucket to read-only.' }
    ],
    correct: ['c'],
    explanation: 'A locked retention policy enforces a minimum retention period during which objects cannot be deleted or overwritten, even by project owners or admins. Once locked, the retention policy cannot be reduced or removed. IAM policies can be changed by admins, versioning does not prevent deletion of all versions, and ACLs can be modified by owners.',
    difficulty: 'advanced',
    reference: 'Cloud Storage: Retention policies and retention policy locks'
  },
  {
    id: 'exam-018',
    type: 'single',
    domain: 'storage',
    question: 'You need to migrate 50 TB of data from an on-premises data center to Cloud Storage. Your network connection supports a maximum of 100 Mbps. Uploading over the network would take weeks. What is the fastest migration method?',
    options: [
      { id: 'a', text: 'Use gsutil with the -m flag for parallel multi-threaded uploads.' },
      { id: 'b', text: 'Use Transfer Appliance to physically ship the data to Google.' },
      { id: 'c', text: 'Set up a Cloud VPN to increase transfer speed.' },
      { id: 'd', text: 'Compress the data before uploading to reduce the transfer size.' }
    ],
    correct: ['b'],
    explanation: 'Transfer Appliance is a physical device that Google ships to your data center. You load your data onto the device and ship it back to Google, who then uploads it to Cloud Storage. For 50 TB over a 100 Mbps link, network transfer would take approximately 46 days. Transfer Appliance dramatically reduces this timeline. VPN does not increase bandwidth, and compression alone would not sufficiently reduce transfer time.',
    difficulty: 'intermediate',
    reference: 'Transfer Appliance: Overview'
  },
  {
    id: 'exam-019',
    type: 'multi',
    domain: 'storage',
    question: 'You need to design a Cloud Storage strategy for a global media company. Static assets must be served with low latency worldwide, and video archives must be stored at minimal cost. Which two configurations should you use? (Choose two.)',
    options: [
      { id: 'a', text: 'Use a multi-region bucket with Standard storage class for static assets behind Cloud CDN.' },
      { id: 'b', text: 'Use a single-region Archive storage class bucket for video archives.' },
      { id: 'c', text: 'Use a dual-region Standard bucket for video archives to ensure redundancy.' },
      { id: 'd', text: 'Use a regional bucket with Nearline storage class for static assets.' }
    ],
    correct: ['a', 'b'],
    explanation: 'A multi-region Standard bucket with Cloud CDN provides the lowest latency for global static asset delivery by caching content at edge locations worldwide. A single-region Archive bucket is the most cost-effective option for video archives that are rarely accessed. Dual-region Standard for archives is unnecessarily expensive, and Nearline with regional storage is not optimal for global low-latency delivery.',
    difficulty: 'advanced',
    reference: 'Cloud Storage: Bucket locations'
  },
  {
    id: 'exam-020',
    type: 'single',
    domain: 'storage',
    question: 'Your application on Compute Engine requires a 2 TB disk with the highest possible IOPS performance. The data does not need to persist if the instance is stopped. Which storage option should you choose?',
    options: [
      { id: 'a', text: 'Balanced Persistent Disk (pd-balanced) with 2 TB capacity.' },
      { id: 'b', text: 'SSD Persistent Disk (pd-ssd) with 2 TB capacity.' },
      { id: 'c', text: 'Local SSD with multiple 375 GB partitions striped together.' },
      { id: 'd', text: 'Extreme Persistent Disk (pd-extreme) with 2 TB capacity.' }
    ],
    correct: ['c'],
    explanation: 'Local SSDs provide the highest IOPS and lowest latency of any Compute Engine storage option because they are physically attached to the host machine. Since the data does not need to persist, the ephemeral nature of Local SSDs is acceptable. You can stripe multiple 375 GB Local SSD partitions to achieve the needed capacity. Persistent Disk options, while durable, offer lower IOPS.',
    difficulty: 'advanced',
    reference: 'Compute Engine: Local SSDs'
  },
  {
    id: 'exam-021',
    type: 'single',
    domain: 'storage',
    question: 'You need to grant a third-party vendor time-limited access to upload files to a specific Cloud Storage bucket without giving them a Google Cloud account. What should you do?',
    options: [
      { id: 'a', text: 'Create a service account, generate a key, and share the key file with the vendor.' },
      { id: 'b', text: 'Generate a signed URL with write permissions and a defined expiration time.' },
      { id: 'c', text: 'Make the bucket publicly writable and share the bucket URL.' },
      { id: 'd', text: 'Create a Google Group, add the vendor email, and grant the group write access.' }
    ],
    correct: ['b'],
    explanation: 'Signed URLs provide time-limited access to specific Cloud Storage resources without requiring the user to have a Google account or IAM permissions. You can generate a signed URL with write permissions that expires after a specified duration. Sharing service account keys is a security risk, making buckets publicly writable is insecure, and Google Groups require Google accounts.',
    difficulty: 'intermediate',
    reference: 'Cloud Storage: Signed URLs'
  },
  {
    id: 'exam-022',
    type: 'single',
    domain: 'storage',
    question: 'You are designing a disaster recovery solution for a Cloud SQL for PostgreSQL instance in us-central1. The RPO (Recovery Point Objective) must be less than 1 minute. What should you configure?',
    options: [
      { id: 'a', text: 'Enable automated backups with point-in-time recovery.' },
      { id: 'b', text: 'Create a cross-region read replica in us-east1 and promote it during failover.' },
      { id: 'c', text: 'Export the database to Cloud Storage every hour using Cloud Scheduler.' },
      { id: 'd', text: 'Use Cloud SQL high availability configuration with a regional persistent disk.' }
    ],
    correct: ['b'],
    explanation: 'A cross-region read replica continuously replicates data from the primary instance using asynchronous replication, providing an RPO of typically less than a minute. During a disaster, you can promote the replica to a standalone instance. Automated backups have a higher RPO, hourly exports give a 1-hour RPO, and HA configuration protects against zonal failures in the same region, not regional disasters.',
    difficulty: 'advanced',
    reference: 'Cloud SQL: Cross-region replicas'
  },
  {
    id: 'exam-023',
    type: 'single',
    domain: 'storage',
    question: 'You have a Cloud Storage bucket that receives thousands of objects per second. You notice that listing operations are slow. What is the most likely cause and how should you fix it?',
    options: [
      { id: 'a', text: 'The bucket has too many objects. Split the data across multiple buckets.' },
      { id: 'b', text: 'Objects are using sequential naming prefixes causing hotspotting. Add random prefixes to object names.' },
      { id: 'c', text: 'The bucket is in the wrong region. Move it closer to the application.' },
      { id: 'd', text: 'Enable requestor-pays to reduce the number of list operations from external users.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Storage distributes objects across storage servers based on the object name prefix. Sequential naming patterns (such as timestamps or incrementing IDs) cause all objects to be stored on the same servers, creating hotspots that slow down operations. Adding random prefixes distributes the load evenly across servers. This is a well-known best practice for high-throughput Cloud Storage buckets.',
    difficulty: 'advanced',
    reference: 'Cloud Storage: Request rate and access distribution guidelines'
  },
  {
    id: 'exam-024',
    type: 'single',
    domain: 'storage',
    question: 'Your team needs a managed relational database for a global e-commerce application that requires strong consistency, high availability across regions, and horizontal scalability. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud SQL for MySQL with cross-region read replicas.' },
      { id: 'b', text: 'Cloud Spanner with a multi-region instance configuration.' },
      { id: 'c', text: 'Firestore in Datastore mode with multi-region replication.' },
      { id: 'd', text: 'AlloyDB for PostgreSQL with cross-region replication.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Spanner is the only Google Cloud relational database that provides global distribution with strong consistency, automatic horizontal scaling, and up to 99.999% availability with multi-region configurations. Cloud SQL does not support horizontal scaling or strong consistency across regions, Firestore is not relational, and AlloyDB is regional.',
    difficulty: 'intermediate',
    reference: 'Cloud Spanner: Overview'
  },

  // ============================================================
  // NETWORKING DOMAIN (12 questions)
  // ============================================================
  {
    id: 'exam-025',
    type: 'single',
    domain: 'networking',
    question: 'Your organization has multiple projects that need to share a common VPC network while maintaining separate billing and IAM boundaries. What networking model should you use?',
    options: [
      { id: 'a', text: 'Create a VPC in each project and peer them together using VPC Network Peering.' },
      { id: 'b', text: 'Use a Shared VPC where the host project owns the network and service projects attach to it.' },
      { id: 'c', text: 'Create a single project for all resources to share the same default VPC network.' },
      { id: 'd', text: 'Use Cloud VPN to connect VPCs across different projects.' }
    ],
    correct: ['b'],
    explanation: 'Shared VPC allows a host project to share its VPC network with service projects. This enables centralized network administration while maintaining separate project-level IAM and billing. VPC Peering creates separate networks that are connected, which is different from sharing a single network. A single project would not maintain separate billing and IAM boundaries.',
    difficulty: 'intermediate',
    reference: 'VPC: Shared VPC overview'
  },
  {
    id: 'exam-026',
    type: 'single',
    domain: 'networking',
    question: 'You need to allow traffic from a specific set of Compute Engine VMs to access a Cloud SQL instance on port 3306. What is the most secure and maintainable way to configure the firewall?',
    options: [
      { id: 'a', text: 'Create a firewall rule with the source IP ranges of the VMs.' },
      { id: 'b', text: 'Create a firewall rule using network tags applied to the VMs as the source filter.' },
      { id: 'c', text: 'Open port 3306 to all instances in the VPC network (0.0.0.0/0).' },
      { id: 'd', text: 'Use Cloud SQL authorized networks to allow the VM external IPs.' }
    ],
    correct: ['b'],
    explanation: 'Using network tags as the source filter is more maintainable than IP ranges because tags automatically apply to new VMs and do not need to be updated when IP addresses change. This is more secure than opening the port to the entire network. Authorized networks with external IPs would require VMs to have external IP addresses, which is less secure than using internal network tags.',
    difficulty: 'beginner',
    reference: 'VPC: Firewall rules overview'
  },
  {
    id: 'exam-027',
    type: 'single',
    domain: 'networking',
    question: 'Your application backend in Google Cloud needs a private, dedicated, high-bandwidth connection to your on-premises data center. The connection must support up to 10 Gbps of traffic. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud VPN with multiple tunnels for aggregate bandwidth.' },
      { id: 'b', text: 'Dedicated Interconnect with a 10 Gbps connection.' },
      { id: 'c', text: 'Partner Interconnect through a supported service provider.' },
      { id: 'd', text: 'Direct Peering at a Google edge location.' }
    ],
    correct: ['b'],
    explanation: 'Dedicated Interconnect provides a direct physical connection between your on-premises network and Google Cloud VPC network with connections available at 10 Gbps or 100 Gbps. It offers the highest bandwidth, lowest latency, and most consistent performance. Cloud VPN is limited to ~3 Gbps per tunnel, Partner Interconnect uses a third-party provider when you cannot meet Dedicated Interconnect requirements, and Direct Peering is for accessing Google services (not VPC).',
    difficulty: 'intermediate',
    reference: 'Cloud Interconnect: Dedicated Interconnect overview'
  },
  {
    id: 'exam-028',
    type: 'single',
    domain: 'networking',
    question: 'You are deploying a global web application and need a single anycast IP address that routes users to the nearest healthy backend. Which load balancer should you use?',
    options: [
      { id: 'a', text: 'Regional external HTTP(S) load balancer.' },
      { id: 'b', text: 'Global external HTTP(S) load balancer.' },
      { id: 'c', text: 'Regional internal TCP/UDP load balancer.' },
      { id: 'd', text: 'External TCP/UDP Network load balancer.' }
    ],
    correct: ['b'],
    explanation: 'The global external HTTP(S) load balancer provides a single anycast IP address that directs traffic to the nearest healthy backend based on proximity, capacity, and health. It operates at the application layer (Layer 7) and supports global traffic distribution. Regional load balancers only serve traffic within a single region, and TCP/UDP load balancers operate at Layer 4 without HTTP-aware routing.',
    difficulty: 'beginner',
    reference: 'Cloud Load Balancing: Global external HTTP(S) load balancer'
  },
  {
    id: 'exam-029',
    type: 'multi',
    domain: 'networking',
    question: 'Your organization needs to connect two VPC networks in different projects so resources can communicate using private IP addresses. The VPC CIDR ranges do not overlap. Which two statements about VPC Network Peering are correct? (Choose two.)',
    options: [
      { id: 'a', text: 'VPC Network Peering is transitive, so if VPC A peers with VPC B and VPC B peers with VPC C, VPC A can reach VPC C.' },
      { id: 'b', text: 'VPC Network Peering works across different projects and even different organizations.' },
      { id: 'c', text: 'VPC Network Peering uses the Google Cloud internal network and does not traverse the public internet.' },
      { id: 'd', text: 'VPC Network Peering requires both VPCs to be in the same region.' }
    ],
    correct: ['b', 'c'],
    explanation: 'VPC Network Peering works across projects and organizations, allowing resources to communicate via private IPs over the Google internal network without public internet exposure. Importantly, VPC Peering is NOT transitive, meaning if VPC A peers with VPC B and VPC B peers with VPC C, VPC A cannot reach VPC C automatically. VPC Peering is also global and does not require VPCs to be in the same region.',
    difficulty: 'intermediate',
    reference: 'VPC: VPC Network Peering'
  },
  {
    id: 'exam-030',
    type: 'single',
    domain: 'networking',
    question: 'Your application in us-central1 needs to access a public API endpoint on the internet, but you want all egress traffic to pass through a single known IP address for the API provider to whitelist. What should you configure?',
    options: [
      { id: 'a', text: 'Assign a static external IP address directly to the VM.' },
      { id: 'b', text: 'Configure Cloud NAT with a static IP address on the subnet router.' },
      { id: 'c', text: 'Use a Cloud VPN tunnel to route all traffic through a fixed IP.' },
      { id: 'd', text: 'Deploy a proxy server with a static external IP and route all traffic through it.' }
    ],
    correct: ['b'],
    explanation: 'Cloud NAT allows instances without external IP addresses to access the internet through a NAT gateway with a static IP address. This provides a single known egress IP that API providers can whitelist while keeping instances private. Assigning external IPs to each VM gives different IPs per instance, VPN is for site-to-site connectivity, and a manual proxy adds unnecessary operational overhead.',
    difficulty: 'intermediate',
    reference: 'Cloud NAT: Overview'
  },
  {
    id: 'exam-031',
    type: 'single',
    domain: 'networking',
    question: 'You need to expose a Kubernetes service running on GKE to internal clients within the same VPC only. The service should have a stable internal IP address. Which Kubernetes service type should you use?',
    options: [
      { id: 'a', text: 'NodePort service type to expose the service on a high port on each node.' },
      { id: 'b', text: 'LoadBalancer service type which creates an external load balancer.' },
      { id: 'c', text: 'ClusterIP service type which is only reachable from within the cluster.' },
      { id: 'd', text: 'LoadBalancer service type with the cloud.google.com/load-balancer-type: "Internal" annotation.' }
    ],
    correct: ['d'],
    explanation: 'An internal LoadBalancer service type with the Internal annotation creates a Google Cloud internal TCP/UDP load balancer that exposes the service to clients within the same VPC with a stable internal IP. ClusterIP is only reachable from within the cluster (not from other VPC resources), NodePort does not provide a stable IP, and a standard LoadBalancer creates a public-facing load balancer.',
    difficulty: 'advanced',
    reference: 'GKE: Configuring internal load balancing'
  },
  {
    id: 'exam-032',
    type: 'single',
    domain: 'networking',
    question: 'Your organization has adopted a hub-and-spoke network topology. The hub VPC needs to route traffic between multiple spoke VPCs that are peered with the hub but not with each other. What should you configure?',
    options: [
      { id: 'a', text: 'Enable VPC Peering transitivity by setting the export/import custom routes option on all peering connections.' },
      { id: 'b', text: 'Deploy an NVA (Network Virtual Appliance) in the hub VPC and configure custom routes in each spoke VPC to route traffic through the NVA.' },
      { id: 'c', text: 'Create VPC Peering connections between all spoke VPCs directly.' },
      { id: 'd', text: 'Use Cloud VPN tunnels between spoke VPCs.' }
    ],
    correct: ['b'],
    explanation: 'Since VPC Peering is not transitive, spoke VPCs cannot communicate through the hub VPC peering alone. Deploying a Network Virtual Appliance (such as a firewall or router) in the hub VPC and configuring custom routes allows traffic inspection and forwarding between spokes through the hub. Exporting custom routes allows routes to be shared but does not enable transitive peering. Direct peering between all spokes creates a full mesh, which is harder to manage.',
    difficulty: 'advanced',
    reference: 'VPC: Hub-and-spoke network architecture'
  },
  {
    id: 'exam-033',
    type: 'single',
    domain: 'networking',
    question: 'You need to register a domain name and configure DNS records to point to your Google Cloud resources. Which Google Cloud service provides managed authoritative DNS?',
    options: [
      { id: 'a', text: 'Cloud CDN for edge caching and DNS resolution.' },
      { id: 'b', text: 'Cloud DNS for managed authoritative DNS hosting.' },
      { id: 'c', text: 'Cloud Domains for domain registration only, DNS must be configured elsewhere.' },
      { id: 'd', text: 'Traffic Director for service mesh DNS management.' }
    ],
    correct: ['b'],
    explanation: 'Cloud DNS is a scalable, reliable, and managed authoritative Domain Name System (DNS) service running on the same infrastructure as Google. It provides both public and private DNS zones with low-latency DNS serving. Cloud CDN is for content caching, Cloud Domains is for domain registration (though it integrates with Cloud DNS), and Traffic Director is a service mesh control plane.',
    difficulty: 'beginner',
    reference: 'Cloud DNS: Overview'
  },
  {
    id: 'exam-034',
    type: 'single',
    domain: 'networking',
    question: 'Your Compute Engine instances need to access Google Cloud APIs like Cloud Storage and BigQuery without sending traffic over the public internet. What should you configure?',
    options: [
      { id: 'a', text: 'Assign external IP addresses to all instances for direct API access.' },
      { id: 'b', text: 'Configure Private Google Access on the subnet where the instances reside.' },
      { id: 'c', text: 'Create a Cloud VPN tunnel to Google API endpoints.' },
      { id: 'd', text: 'Deploy a reverse proxy in a DMZ to forward API requests.' }
    ],
    correct: ['b'],
    explanation: 'Private Google Access enables instances with only internal IP addresses to reach Google APIs and services through an internal route, without requiring external IP addresses. Traffic stays on the Google network and does not traverse the public internet. This is a simple subnet-level setting that requires no additional infrastructure like VPN or proxies.',
    difficulty: 'beginner',
    reference: 'VPC: Private Google Access'
  },
  {
    id: 'exam-035',
    type: 'single',
    domain: 'networking',
    question: 'You need to protect your web application from DDoS attacks, cross-site scripting (XSS), and SQL injection. Which Google Cloud service should you use in conjunction with the global HTTP(S) load balancer?',
    options: [
      { id: 'a', text: 'Cloud Armor security policies.' },
      { id: 'b', text: 'VPC firewall rules with priority-based filtering.' },
      { id: 'c', text: 'Binary Authorization for container security.' },
      { id: 'd', text: 'Web Security Scanner for vulnerability detection.' }
    ],
    correct: ['a'],
    explanation: 'Cloud Armor integrates with the global HTTP(S) load balancer to provide DDoS protection, IP allowlisting/denylisting, and preconfigured WAF rules for OWASP Top 10 threats including XSS and SQL injection. VPC firewall rules operate at Layer 3-4 and cannot inspect HTTP payloads, Binary Authorization is for container images, and Web Security Scanner is a detection tool, not a protection mechanism.',
    difficulty: 'intermediate',
    reference: 'Cloud Armor: Overview'
  },
  {
    id: 'exam-036',
    type: 'single',
    domain: 'networking',
    question: 'You have VMs in two different regions that need to communicate with low latency using private IP addresses. Both regions are in the same VPC. Do you need to set up any additional networking configuration?',
    options: [
      { id: 'a', text: 'Yes, you need to create VPC Peering between the two regions.' },
      { id: 'b', text: 'Yes, you need to create a Cloud VPN tunnel between the regions.' },
      { id: 'c', text: 'No, VPC networks in Google Cloud are global, so subnets in different regions can communicate automatically.' },
      { id: 'd', text: 'Yes, you need to create custom routes between the two regional subnets.' }
    ],
    correct: ['c'],
    explanation: 'Google Cloud VPC networks are global resources. Subnets are regional, but they can communicate with each other within the same VPC without any additional configuration. Traffic between regions in the same VPC uses the Google internal network. No peering, VPN, or custom routes are needed for intra-VPC cross-region communication.',
    difficulty: 'beginner',
    reference: 'VPC: VPC network overview'
  },

  // ============================================================
  // SECURITY DOMAIN (10 questions)
  // ============================================================
  {
    id: 'exam-037',
    type: 'single',
    domain: 'security',
    question: 'You need to grant a developer the ability to deploy Cloud Functions and read Cloud Storage objects in a specific project, but nothing else. What is the recommended approach?',
    options: [
      { id: 'a', text: 'Grant the roles/editor basic role at the project level.' },
      { id: 'b', text: 'Grant the roles/cloudfunctions.developer and roles/storage.objectViewer predefined roles at the project level.' },
      { id: 'c', text: 'Create a custom role that combines all permissions from the Editor role minus the ones not needed.' },
      { id: 'd', text: 'Grant the roles/owner basic role and use deny policies to restrict excess permissions.' }
    ],
    correct: ['b'],
    explanation: 'Following the principle of least privilege, you should grant the minimum predefined roles necessary for the task. The cloudfunctions.developer role allows deploying functions, and storage.objectViewer allows reading objects. The Editor role grants far too many permissions, creating a custom role from Editor is overly complex, and the Owner role with deny policies is not a recommended pattern.',
    difficulty: 'beginner',
    reference: 'IAM: Understanding roles'
  },
  {
    id: 'exam-038',
    type: 'single',
    domain: 'security',
    question: 'Your organization wants to enforce that all new GCP projects must have a specific set of labels, and that Cloud Storage buckets cannot be created with public access. Which service should you use?',
    options: [
      { id: 'a', text: 'IAM conditions to restrict resource creation based on labels.' },
      { id: 'b', text: 'Organization Policy Service to set constraints at the organization level.' },
      { id: 'c', text: 'Cloud Audit Logs to detect and alert on non-compliant resources.' },
      { id: 'd', text: 'Terraform with policy-as-code to enforce configuration standards.' }
    ],
    correct: ['b'],
    explanation: 'The Organization Policy Service allows administrators to set constraints that enforce specific configurations across all projects in an organization. For example, the constraints/storage.publicAccessPrevention constraint prevents public bucket access, and custom constraints can enforce labeling requirements. IAM conditions do not control resource configuration, Audit Logs are reactive not preventive, and Terraform policies are not enforced at the GCP platform level.',
    difficulty: 'intermediate',
    reference: 'Organization Policy Service: Overview'
  },
  {
    id: 'exam-039',
    type: 'single',
    domain: 'security',
    question: 'Your application running on GKE needs to access a Cloud SQL database. You want to avoid storing database credentials in the application code or environment variables. What is the recommended approach?',
    options: [
      { id: 'a', text: 'Store the credentials in a ConfigMap and mount it as a volume in the pod.' },
      { id: 'b', text: 'Use Workload Identity to link a Kubernetes service account to a Google Cloud service account, then use Cloud SQL Auth Proxy.' },
      { id: 'c', text: 'Store the credentials in a Kubernetes Secret and inject them as environment variables.' },
      { id: 'd', text: 'Hardcode the credentials in a Docker image layer.' }
    ],
    correct: ['b'],
    explanation: 'Workload Identity is the recommended way to access Google Cloud services from GKE. It federates Kubernetes service accounts with Google Cloud service accounts, eliminating the need to manage and distribute credentials. Combined with the Cloud SQL Auth Proxy, this provides secure, credential-free database access. ConfigMaps and Secrets still require managing credentials, and hardcoding credentials is a severe security risk.',
    difficulty: 'advanced',
    reference: 'GKE: Workload Identity'
  },
  {
    id: 'exam-040',
    type: 'single',
    domain: 'security',
    question: 'You need to encrypt data in a Cloud Storage bucket using your own encryption keys managed in Cloud KMS, while retaining the ability to rotate keys without re-encrypting existing data. What type of encryption should you configure?',
    options: [
      { id: 'a', text: 'Google-managed encryption keys (default encryption).' },
      { id: 'b', text: 'Customer-managed encryption keys (CMEK) with Cloud KMS.' },
      { id: 'c', text: 'Customer-supplied encryption keys (CSEK) where you provide the raw key material in each API request.' },
      { id: 'd', text: 'Client-side encryption where you encrypt data before uploading.' }
    ],
    correct: ['b'],
    explanation: 'Customer-managed encryption keys (CMEK) using Cloud KMS give you control over the encryption keys while Google handles the encryption/decryption process. Key rotation with CMEK is seamless because Cloud KMS maintains previous key versions to decrypt data encrypted with older key versions, so existing data does not need to be re-encrypted. CSEK requires providing the key with each request and does not support automatic rotation in the same way.',
    difficulty: 'intermediate',
    reference: 'Cloud KMS: Customer-managed encryption keys'
  },
  {
    id: 'exam-041',
    type: 'multi',
    domain: 'security',
    question: 'Your security team needs to audit all administrative activities and data access events across your Google Cloud organization. Which two types of Cloud Audit Logs should they enable and review? (Choose two.)',
    options: [
      { id: 'a', text: 'Admin Activity audit logs, which are always enabled and record administrative actions.' },
      { id: 'b', text: 'Data Access audit logs, which must be explicitly enabled and record data read/write operations.' },
      { id: 'c', text: 'System Event audit logs, which record Google-initiated system events.' },
      { id: 'd', text: 'Policy Denied audit logs, which record when access is denied by VPC Service Controls.' }
    ],
    correct: ['a', 'b'],
    explanation: 'Admin Activity audit logs are always enabled and capture administrative actions such as creating or modifying resources. Data Access audit logs must be explicitly enabled (except for BigQuery) and record operations that read or write user data. Together, these two log types provide comprehensive auditing of both administrative activities and data access events. System Event and Policy Denied logs serve different purposes.',
    difficulty: 'intermediate',
    reference: 'Cloud Audit Logs: Overview'
  },
  {
    id: 'exam-042',
    type: 'single',
    domain: 'security',
    question: 'A developer on your team has left the company. They had access to several projects and service accounts. What is the first action you should take to secure the environment?',
    options: [
      { id: 'a', text: 'Delete all projects the developer had access to and recreate them.' },
      { id: 'b', text: 'Rotate all service account keys in the projects the developer accessed and remove their IAM bindings.' },
      { id: 'c', text: 'Disable the developer Google Workspace account, which immediately revokes all GCP access, then audit and rotate any service account keys they may have downloaded.' },
      { id: 'd', text: 'Change all passwords on shared service accounts.' }
    ],
    correct: ['c'],
    explanation: 'The first and most immediate action is to disable the developer Google Workspace (or Cloud Identity) account, which instantly revokes all associated GCP IAM permissions. After that, you should audit and rotate any service account keys the developer may have exported, as those provide independent authentication. Deleting projects is drastic and unnecessary, and GCP service accounts do not have passwords.',
    difficulty: 'intermediate',
    reference: 'IAM: Managing access to projects, folders, and organizations'
  },
  {
    id: 'exam-043',
    type: 'single',
    domain: 'security',
    question: 'Your organization wants to restrict which Google Cloud APIs can be called from within a VPC to prevent data exfiltration. Which service should you use?',
    options: [
      { id: 'a', text: 'VPC firewall rules to block outbound traffic to specific API endpoints.' },
      { id: 'b', text: 'VPC Service Controls to create a service perimeter around your projects.' },
      { id: 'c', text: 'Private Google Access to restrict API access to internal traffic.' },
      { id: 'd', text: 'Cloud Armor to filter API requests at the edge.' }
    ],
    correct: ['b'],
    explanation: 'VPC Service Controls create a security perimeter around Google Cloud resources that restricts data movement across the perimeter boundary. This prevents data exfiltration by controlling which services can be accessed and from where. VPC firewall rules do not apply to Google API traffic, Private Google Access only controls the route (not which APIs), and Cloud Armor is for inbound web application protection.',
    difficulty: 'advanced',
    reference: 'VPC Service Controls: Overview'
  },
  {
    id: 'exam-044',
    type: 'single',
    domain: 'security',
    question: 'You need to store API keys, database passwords, and TLS certificates securely so your applications on Compute Engine and GKE can access them. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud Storage with fine-grained IAM permissions on the bucket.' },
      { id: 'b', text: 'Secret Manager with IAM-controlled access and automatic versioning.' },
      { id: 'c', text: 'Cloud KMS to store the secrets as encrypted key material.' },
      { id: 'd', text: 'Compute Engine instance metadata to store secrets per instance.' }
    ],
    correct: ['b'],
    explanation: 'Secret Manager is purpose-built for storing, managing, and accessing secrets like API keys, passwords, and certificates. It provides IAM-controlled access, automatic versioning, audit logging, and integration with Compute Engine and GKE. Cloud Storage is not designed for secret management, Cloud KMS manages encryption keys but not arbitrary secrets, and instance metadata is not a secure secret store.',
    difficulty: 'beginner',
    reference: 'Secret Manager: Overview'
  },
  {
    id: 'exam-045',
    type: 'single',
    domain: 'security',
    question: 'You want to ensure that only trusted container images from your organization Artifact Registry can be deployed to your GKE clusters. Which service enforces this policy?',
    options: [
      { id: 'a', text: 'Container Analysis for vulnerability scanning of images.' },
      { id: 'b', text: 'Binary Authorization to enforce deploy-time policy checks on container images.' },
      { id: 'c', text: 'GKE Sandbox (gVisor) to isolate untrusted containers at runtime.' },
      { id: 'd', text: 'Image pull secrets to restrict which registries can be accessed.' }
    ],
    correct: ['b'],
    explanation: 'Binary Authorization is a deploy-time security control that ensures only trusted container images are deployed to GKE. You can configure policies that require images to be signed by specific attestors or come from specific registries. Container Analysis scans for vulnerabilities but does not block deployments, GKE Sandbox provides runtime isolation, and image pull secrets control authentication but not policy enforcement.',
    difficulty: 'advanced',
    reference: 'Binary Authorization: Overview'
  },
  {
    id: 'exam-046',
    type: 'single',
    domain: 'security',
    question: 'You are configuring IAM for a large organization with multiple departments. Each department should be able to manage their own resources independently. How should you structure the resource hierarchy?',
    options: [
      { id: 'a', text: 'Create one project per department and grant each department Owner access to their project.' },
      { id: 'b', text: 'Create folders for each department under the organization node and grant IAM roles at the folder level.' },
      { id: 'c', text: 'Create a single project with separate service accounts for each department.' },
      { id: 'd', text: 'Create separate Google Cloud organizations for each department.' }
    ],
    correct: ['b'],
    explanation: 'Using folders to represent departments provides a logical grouping that maps to organizational structure. IAM roles granted at the folder level are inherited by all projects within that folder, enabling centralized management per department. Creating separate organizations fragments governance, a single project does not provide isolation, and granting Owner at the project level is too broad without organizational structure.',
    difficulty: 'beginner',
    reference: 'Resource Manager: Resource hierarchy'
  },

  // ============================================================
  // DATA DOMAIN (12 questions)
  // ============================================================
  {
    id: 'exam-047',
    type: 'single',
    domain: 'data',
    question: 'Your analytics team needs to run ad-hoc SQL queries on petabytes of data with sub-minute response times. The data is already in Cloud Storage in Parquet format. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud SQL for PostgreSQL with the parquet_fdw extension.' },
      { id: 'b', text: 'BigQuery with external tables pointing to the Cloud Storage location.' },
      { id: 'c', text: 'Dataproc with Apache Hive for SQL-on-Hadoop processing.' },
      { id: 'd', text: 'Firestore in Datastore mode for fast key-value lookups.' }
    ],
    correct: ['b'],
    explanation: 'BigQuery is designed for petabyte-scale analytics with fast SQL query performance. External tables allow you to query data directly in Cloud Storage without loading it into BigQuery, and BigQuery natively supports Parquet format. For best performance, the data can also be loaded into BigQuery native storage. Cloud SQL cannot handle petabyte-scale data, Dataproc requires cluster management, and Firestore is not designed for analytical queries.',
    difficulty: 'intermediate',
    reference: 'BigQuery: External data sources'
  },
  {
    id: 'exam-048',
    type: 'single',
    domain: 'data',
    question: 'You need to process a continuous stream of IoT sensor data in real-time, performing windowed aggregations before writing results to BigQuery. Which combination of services should you use?',
    options: [
      { id: 'a', text: 'Cloud Pub/Sub for ingestion and Dataflow for stream processing.' },
      { id: 'b', text: 'Cloud Pub/Sub for ingestion and Cloud Functions for processing each message.' },
      { id: 'c', text: 'Kafka on Compute Engine for ingestion and Dataproc Spark Streaming for processing.' },
      { id: 'd', text: 'Cloud IoT Core for ingestion and BigQuery streaming inserts for direct writing.' }
    ],
    correct: ['a'],
    explanation: 'Cloud Pub/Sub provides reliable, scalable message ingestion for streaming data. Dataflow (Apache Beam) is the ideal service for stream processing with windowed aggregations, as it handles late data, exactly-once processing, and has built-in BigQuery sinks. Cloud Functions cannot easily perform windowed aggregations, self-managed Kafka adds operational overhead, and direct BigQuery inserts bypass the aggregation requirement.',
    difficulty: 'intermediate',
    reference: 'Dataflow: Streaming data processing'
  },
  {
    id: 'exam-049',
    type: 'single',
    domain: 'data',
    question: 'Your team is running Apache Spark and Hadoop workloads on-premises. You want to migrate these workloads to Google Cloud with minimal code changes. Which service should you use?',
    options: [
      { id: 'a', text: 'Dataflow, which natively supports Spark and Hadoop APIs.' },
      { id: 'b', text: 'Dataproc, which provides managed Spark and Hadoop clusters.' },
      { id: 'c', text: 'BigQuery, which can run Spark SQL queries natively.' },
      { id: 'd', text: 'Compute Engine VMs with manually installed Hadoop and Spark.' }
    ],
    correct: ['b'],
    explanation: 'Dataproc is a managed Apache Spark and Apache Hadoop service that allows you to run existing Spark and Hadoop workloads with minimal code changes. It handles cluster provisioning, configuration, and management. Dataflow uses Apache Beam (not Spark/Hadoop), BigQuery is not a Spark runtime, and manually installing on Compute Engine adds significant operational overhead.',
    difficulty: 'beginner',
    reference: 'Dataproc: Overview'
  },
  {
    id: 'exam-050',
    type: 'single',
    domain: 'data',
    question: 'You have a BigQuery dataset that contains sensitive PII (personally identifiable information). You need to allow analysts to run queries on the data without exposing the PII fields. What should you configure?',
    options: [
      { id: 'a', text: 'Create a separate dataset with the PII columns removed and grant access to that dataset.' },
      { id: 'b', text: 'Use BigQuery column-level security with policy tags from Data Catalog to restrict access to PII columns.' },
      { id: 'c', text: 'Use views with the SESSION_USER() function to filter rows based on the analyst identity.' },
      { id: 'd', text: 'Encrypt the PII columns using Cloud KMS and only give decryption keys to authorized users.' }
    ],
    correct: ['b'],
    explanation: 'BigQuery column-level security using Data Catalog policy tags allows you to restrict access to specific columns containing sensitive data. Analysts can query the dataset but will not see the values of columns protected by policy tags unless they have the appropriate IAM role. Creating a separate dataset requires data duplication and maintenance, views with SESSION_USER filter rows not columns, and encryption at the column level adds query complexity.',
    difficulty: 'advanced',
    reference: 'BigQuery: Column-level security'
  },
  {
    id: 'exam-051',
    type: 'single',
    domain: 'data',
    question: 'You need to set up a real-time data warehouse that receives streaming inserts from multiple microservices and supports complex analytical queries. Which approach should you use?',
    options: [
      { id: 'a', text: 'Use Cloud SQL for PostgreSQL with logical replication from each microservice.' },
      { id: 'b', text: 'Use BigQuery with the Storage Write API for high-throughput streaming inserts.' },
      { id: 'c', text: 'Use Bigtable for both streaming writes and analytical queries.' },
      { id: 'd', text: 'Use Memorystore for Redis to cache all streaming data for analytical queries.' }
    ],
    correct: ['b'],
    explanation: 'BigQuery with the Storage Write API supports high-throughput, low-latency streaming inserts while providing a powerful analytical query engine for complex queries. The Storage Write API offers exactly-once semantics and higher throughput than the legacy streaming API. Cloud SQL is not designed for data warehousing at scale, Bigtable does not support complex analytical SQL queries, and Redis is an in-memory cache not suited for analytical workloads.',
    difficulty: 'intermediate',
    reference: 'BigQuery: Storage Write API'
  },
  {
    id: 'exam-052',
    type: 'single',
    domain: 'data',
    question: 'Your application needs a low-latency, high-throughput NoSQL database to store time-series data from millions of IoT devices. Each device writes approximately 1 KB of data every second. Which database should you use?',
    options: [
      { id: 'a', text: 'Cloud Spanner for its horizontal scalability.' },
      { id: 'b', text: 'Cloud Bigtable for high-throughput time-series data.' },
      { id: 'c', text: 'Firestore for its real-time synchronization capabilities.' },
      { id: 'd', text: 'Memorystore for Redis for in-memory low-latency access.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Bigtable is specifically designed for high-throughput, low-latency NoSQL workloads including time-series data. It can handle millions of writes per second and scales horizontally by adding nodes. Bigtable row key design optimized for time-series data (e.g., reversed timestamp) provides excellent read performance. Cloud Spanner is relational, Firestore has lower throughput limits, and Redis is not designed for persistent storage of this scale.',
    difficulty: 'intermediate',
    reference: 'Cloud Bigtable: Overview'
  },
  {
    id: 'exam-053',
    type: 'single',
    domain: 'data',
    question: 'You need to orchestrate a daily ETL pipeline that extracts data from Cloud SQL, transforms it using Dataflow, and loads results into BigQuery. Which service should you use for orchestration?',
    options: [
      { id: 'a', text: 'Cloud Scheduler to trigger each step sequentially using HTTP requests.' },
      { id: 'b', text: 'Cloud Composer (managed Apache Airflow) to define and manage the DAG.' },
      { id: 'c', text: 'Cloud Functions chained together with Pub/Sub messages between steps.' },
      { id: 'd', text: 'Write a cron job on a Compute Engine instance to run the pipeline.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Composer (managed Apache Airflow) is the recommended service for orchestrating complex data pipelines. It supports DAG (Directed Acyclic Graph) definitions that handle dependencies between tasks, retries, monitoring, and scheduling. Cloud Scheduler can trigger simple tasks but lacks pipeline orchestration features, chaining Cloud Functions is fragile for complex pipelines, and a cron job on a VM is not resilient or manageable.',
    difficulty: 'intermediate',
    reference: 'Cloud Composer: Overview'
  },
  {
    id: 'exam-054',
    type: 'multi',
    domain: 'data',
    question: 'You are designing a BigQuery cost optimization strategy. Which two practices will help reduce query costs? (Choose two.)',
    options: [
      { id: 'a', text: 'Use SELECT * to ensure all necessary columns are included in results.' },
      { id: 'b', text: 'Use partitioned tables and include partition filters in WHERE clauses to reduce data scanned.' },
      { id: 'c', text: 'Use clustered tables to co-locate related data and reduce the amount of data read by queries.' },
      { id: 'd', text: 'Increase the number of slots in your BigQuery reservation to speed up queries.' }
    ],
    correct: ['b', 'c'],
    explanation: 'Partitioned tables reduce costs by limiting the amount of data scanned when queries include partition filters (e.g., filtering by date). Clustered tables further optimize by sorting data within partitions, reducing the bytes read for filtered queries. SELECT * scans all columns unnecessarily, increasing costs. Increasing slots affects performance but does not reduce the amount of data billed in on-demand pricing.',
    difficulty: 'beginner',
    reference: 'BigQuery: Optimizing query computation'
  },
  {
    id: 'exam-055',
    type: 'single',
    domain: 'data',
    question: 'Your mobile application needs a NoSQL document database that supports real-time synchronization of data between the backend and mobile clients, with offline support. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud Bigtable with custom client-side caching.' },
      { id: 'b', text: 'Firestore in Native mode with real-time listeners.' },
      { id: 'c', text: 'Cloud SQL with change data capture and client-side sync logic.' },
      { id: 'd', text: 'Memorystore for Redis with Pub/Sub for change notifications.' }
    ],
    correct: ['b'],
    explanation: 'Firestore in Native mode is designed for mobile and web applications. It provides real-time synchronization through snapshot listeners, offline support with local caching, and automatic conflict resolution. These features are built into the Firestore SDKs for iOS, Android, and web. Other services would require significant custom development to achieve similar functionality.',
    difficulty: 'beginner',
    reference: 'Firestore: Overview'
  },
  {
    id: 'exam-056',
    type: 'single',
    domain: 'data',
    question: 'You need to migrate a 500 GB on-premises MySQL 8.0 database to Cloud SQL for MySQL with minimal downtime. The database must remain operational during migration. What should you use?',
    options: [
      { id: 'a', text: 'Use mysqldump to export the database, upload to Cloud Storage, and import into Cloud SQL.' },
      { id: 'b', text: 'Use Database Migration Service (DMS) with continuous replication for a low-downtime migration.' },
      { id: 'c', text: 'Set up a Cloud SQL read replica pointing to the on-premises MySQL as the source.' },
      { id: 'd', text: 'Use Dataflow to read from MySQL and write to Cloud SQL.' }
    ],
    correct: ['b'],
    explanation: 'Database Migration Service provides a streamlined, low-downtime migration path for MySQL databases to Cloud SQL. It uses continuous replication to keep the Cloud SQL instance in sync with the on-premises source, minimizing downtime to the brief cutover period. mysqldump requires downtime proportional to the database size, Cloud SQL external replicas are a valid approach but DMS simplifies the process, and Dataflow is not designed for database migration.',
    difficulty: 'intermediate',
    reference: 'Database Migration Service: Overview'
  },
  {
    id: 'exam-057',
    type: 'single',
    domain: 'data',
    question: 'Your data engineering team wants to run Spark SQL queries on data stored in Cloud Storage and BigQuery without managing any infrastructure. Which service should they use?',
    options: [
      { id: 'a', text: 'Dataproc Serverless for Spark to run Spark workloads without managing clusters.' },
      { id: 'b', text: 'Dataproc on Compute Engine with auto-scaling enabled.' },
      { id: 'c', text: 'Cloud Data Fusion for visual ETL pipeline development.' },
      { id: 'd', text: 'Dataflow for Apache Beam based processing.' }
    ],
    correct: ['a'],
    explanation: 'Dataproc Serverless allows you to run Spark workloads, including Spark SQL, without provisioning or managing clusters. It automatically handles infrastructure sizing, scaling, and shutdown. Standard Dataproc still requires some cluster management, Cloud Data Fusion is a visual ETL tool built on CDAP, and Dataflow uses Apache Beam not Spark SQL.',
    difficulty: 'intermediate',
    reference: 'Dataproc Serverless: Overview'
  },
  {
    id: 'exam-058',
    type: 'single',
    domain: 'data',
    question: 'You need to implement a caching layer in front of your Cloud SQL database to reduce read latency for frequently accessed data. The cache should support Redis protocol compatibility. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud CDN to cache database query results at the edge.' },
      { id: 'b', text: 'Memorystore for Redis to provide a managed in-memory cache.' },
      { id: 'c', text: 'Cloud Storage with Nearline storage class for frequently accessed data.' },
      { id: 'd', text: 'Bigtable as a high-performance caching layer.' }
    ],
    correct: ['b'],
    explanation: 'Memorystore for Redis is a fully managed in-memory data store that is protocol-compatible with Redis. It provides sub-millisecond read latency and is ideal for caching database query results. Cloud CDN caches HTTP responses not database queries, Cloud Storage is object storage not a cache, and Bigtable is a NoSQL database not a caching service.',
    difficulty: 'beginner',
    reference: 'Memorystore: Redis overview'
  },

  // ============================================================
  // AI DOMAIN (6 questions)
  // ============================================================
  {
    id: 'exam-059',
    type: 'single',
    domain: 'ai',
    question: 'Your company wants to build a custom image classification model but does not have ML expertise on the team. You have 10,000 labeled images. Which service allows you to train a custom model without writing ML code?',
    options: [
      { id: 'a', text: 'Vertex AI AutoML Vision to train a custom model from labeled images.' },
      { id: 'b', text: 'Cloud Vision API to use a pre-trained model for image classification.' },
      { id: 'c', text: 'Vertex AI Workbench to write custom TensorFlow training code.' },
      { id: 'd', text: 'BigQuery ML to train an image model using SQL.' }
    ],
    correct: ['a'],
    explanation: 'Vertex AI AutoML Vision enables you to train custom image classification models by simply uploading labeled images, without writing any ML code. It automatically selects the best model architecture, tunes hyperparameters, and provides a deployable model. The Cloud Vision API uses pre-trained models that cannot be customized, Vertex AI Workbench requires ML coding expertise, and BigQuery ML does not support image classification.',
    difficulty: 'beginner',
    reference: 'Vertex AI: AutoML Vision'
  },
  {
    id: 'exam-060',
    type: 'single',
    domain: 'ai',
    question: 'Your application needs to extract text from scanned PDF documents and handwritten forms in multiple languages. Which pre-trained API should you use?',
    options: [
      { id: 'a', text: 'Cloud Natural Language API for text analysis.' },
      { id: 'b', text: 'Cloud Vision API with document text detection (OCR).' },
      { id: 'c', text: 'Document AI for specialized document parsing and extraction.' },
      { id: 'd', text: 'Cloud Translation API with image input support.' }
    ],
    correct: ['c'],
    explanation: 'Document AI is specifically designed for extracting structured data from documents including scanned PDFs and handwritten forms. It supports multiple languages and provides specialized processors for different document types (invoices, receipts, forms). While Cloud Vision API has OCR capabilities, Document AI provides more accurate extraction for structured documents with better understanding of document layout and context.',
    difficulty: 'intermediate',
    reference: 'Document AI: Overview'
  },
  {
    id: 'exam-061',
    type: 'single',
    domain: 'ai',
    question: 'You have trained a TensorFlow model on Vertex AI and need to deploy it as a REST API endpoint that can handle variable traffic with automatic scaling. What should you do?',
    options: [
      { id: 'a', text: 'Export the model and deploy it on a Compute Engine VM behind a load balancer.' },
      { id: 'b', text: 'Deploy the model to a Vertex AI endpoint with auto-scaling configured.' },
      { id: 'c', text: 'Package the model in a Cloud Function for serverless inference.' },
      { id: 'd', text: 'Deploy the model on GKE with a Horizontal Pod Autoscaler.' }
    ],
    correct: ['b'],
    explanation: 'Vertex AI endpoints provide managed model serving with automatic scaling based on traffic. You simply deploy the model to an endpoint and configure the minimum and maximum number of compute nodes. Vertex AI handles load balancing, health checks, and scaling. Using Compute Engine or GKE requires managing infrastructure, and Cloud Functions have timeout and memory limitations that may not suit ML inference workloads.',
    difficulty: 'intermediate',
    reference: 'Vertex AI: Deploy a model to an endpoint'
  },
  {
    id: 'exam-062',
    type: 'single',
    domain: 'ai',
    question: 'Your customer support team wants to analyze customer feedback emails to determine overall sentiment (positive, negative, or neutral) without building a custom model. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud Natural Language API for sentiment analysis.' },
      { id: 'b', text: 'Vertex AI AutoML Text to train a custom sentiment classifier.' },
      { id: 'c', text: 'Dialogflow for conversational AI analysis.' },
      { id: 'd', text: 'Cloud Translation API to translate and then analyze sentiment.' }
    ],
    correct: ['a'],
    explanation: 'The Cloud Natural Language API provides pre-trained sentiment analysis that classifies text as positive, negative, or neutral with a confidence score, without requiring any model training. It works out of the box for common sentiment analysis use cases. AutoML Text would require training a custom model which is unnecessary for standard sentiment analysis, Dialogflow is for conversational AI, and Translation is for language translation.',
    difficulty: 'beginner',
    reference: 'Cloud Natural Language API: Sentiment analysis'
  },
  {
    id: 'exam-063',
    type: 'single',
    domain: 'ai',
    question: 'You are building a recommendation engine and need to manage the full ML lifecycle including data preparation, model training, hyperparameter tuning, and model monitoring in production. Which platform should you use?',
    options: [
      { id: 'a', text: 'Use separate services: Dataflow for data prep, AI Platform for training, and custom monitoring.' },
      { id: 'b', text: 'Vertex AI as a unified MLOps platform covering the entire ML lifecycle.' },
      { id: 'c', text: 'BigQuery ML for the entire pipeline since it supports SQL-based ML.' },
      { id: 'd', text: 'Cloud Composer to orchestrate individual ML tools and scripts.' }
    ],
    correct: ['b'],
    explanation: 'Vertex AI is a unified MLOps platform that provides tools for every stage of the ML lifecycle: data management (Vertex AI Datasets), model training (custom and AutoML), hyperparameter tuning (Vizier), model deployment (Endpoints), and model monitoring (Model Monitoring). Using separate services adds integration complexity, BigQuery ML has limited model type support, and Cloud Composer is an orchestrator not an ML platform.',
    difficulty: 'intermediate',
    reference: 'Vertex AI: Overview'
  },
  {
    id: 'exam-064',
    type: 'single',
    domain: 'ai',
    question: 'Your company wants to add speech-to-text transcription to their call center application. The application processes audio from phone calls in real-time. Which API configuration should you use?',
    options: [
      { id: 'a', text: 'Cloud Speech-to-Text API with synchronous recognition for batch processing.' },
      { id: 'b', text: 'Cloud Speech-to-Text API with streaming recognition for real-time transcription.' },
      { id: 'c', text: 'Cloud Text-to-Speech API to convert audio to text.' },
      { id: 'd', text: 'Cloud Video Intelligence API for audio track transcription.' }
    ],
    correct: ['b'],
    explanation: 'The Cloud Speech-to-Text API with streaming recognition processes audio in real-time as it is being received, making it ideal for live call center applications. It provides interim results and final transcriptions with low latency. Synchronous recognition is for short pre-recorded audio, Text-to-Speech converts text to audio (not the reverse), and Video Intelligence is for video analysis.',
    difficulty: 'intermediate',
    reference: 'Speech-to-Text: Streaming recognition'
  },

  // ============================================================
  // DEVOPS DOMAIN (10 questions)
  // ============================================================
  {
    id: 'exam-065',
    type: 'single',
    domain: 'devops',
    question: 'Your team uses GitHub for source control and wants to set up a CI/CD pipeline that automatically builds a Docker container image and deploys it to Cloud Run on every push to the main branch. Which service should you use?',
    options: [
      { id: 'a', text: 'Cloud Build with a trigger connected to the GitHub repository.' },
      { id: 'b', text: 'Jenkins on a Compute Engine VM with a GitHub webhook.' },
      { id: 'c', text: 'Cloud Deploy for continuous delivery to Cloud Run.' },
      { id: 'd', text: 'Cloud Scheduler to periodically check for new commits and trigger builds.' }
    ],
    correct: ['a'],
    explanation: 'Cloud Build provides a fully managed CI/CD platform that integrates directly with GitHub. You can configure a build trigger that fires on pushes to the main branch, builds the Docker image, pushes it to Artifact Registry, and deploys it to Cloud Run, all defined in a cloudbuild.yaml file. Jenkins requires managing infrastructure, Cloud Deploy handles delivery but not the build step, and Cloud Scheduler is not designed for CI/CD.',
    difficulty: 'beginner',
    reference: 'Cloud Build: Creating build triggers'
  },
  {
    id: 'exam-066',
    type: 'single',
    domain: 'devops',
    question: 'Your application on GKE needs to be deployed through multiple environments (dev, staging, production) with approval gates between stages. Which service provides managed progressive delivery?',
    options: [
      { id: 'a', text: 'Cloud Build with manual approval steps in the build pipeline.' },
      { id: 'b', text: 'Cloud Deploy for managed continuous delivery with promotion and approval workflows.' },
      { id: 'c', text: 'Spinnaker deployed on GKE for multi-environment deployments.' },
      { id: 'd', text: 'ArgoCD for GitOps-based deployment to multiple environments.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Deploy is a managed continuous delivery service that provides a delivery pipeline with defined stages (targets) representing environments. It supports promotion between stages with approval gates, rollback capabilities, and audit trails. While Cloud Build can include approvals, Cloud Deploy is purpose-built for progressive delivery. Spinnaker and ArgoCD require self-management.',
    difficulty: 'intermediate',
    reference: 'Cloud Deploy: Overview'
  },
  {
    id: 'exam-067',
    type: 'single',
    domain: 'devops',
    question: 'You want to define your Google Cloud infrastructure as code, including VPC networks, Compute Engine instances, and Cloud SQL databases. The infrastructure should be version-controlled and reproducible. Which tool is recommended by Google Cloud?',
    options: [
      { id: 'a', text: 'Cloud Deployment Manager using Jinja or Python templates.' },
      { id: 'b', text: 'Terraform with the Google Cloud provider.' },
      { id: 'c', text: 'gcloud CLI scripts stored in a Git repository.' },
      { id: 'd', text: 'Config Connector on GKE to manage resources as Kubernetes objects.' }
    ],
    correct: ['b'],
    explanation: 'Terraform with the Google Cloud provider is the recommended and most widely adopted Infrastructure as Code tool for Google Cloud. It supports declarative configuration, state management, plan/apply workflow, and a rich ecosystem of modules. While Deployment Manager is a Google-native option, Google officially recommends Terraform. gcloud scripts are imperative and harder to manage, and Config Connector requires GKE.',
    difficulty: 'beginner',
    reference: 'Terraform on Google Cloud'
  },
  {
    id: 'exam-068',
    type: 'multi',
    domain: 'devops',
    question: 'Your team is implementing a monitoring and alerting strategy for a production application on GKE. Which two components should you configure for comprehensive observability? (Choose two.)',
    options: [
      { id: 'a', text: 'Cloud Monitoring with uptime checks and alerting policies that notify via email and PagerDuty.' },
      { id: 'b', text: 'Cloud Logging with log-based metrics and log sinks to BigQuery for long-term analysis.' },
      { id: 'c', text: 'Cloud Profiler for continuous CPU and memory profiling in production.' },
      { id: 'd', text: 'Cloud Debugger for setting breakpoints in production code.' }
    ],
    correct: ['a', 'b'],
    explanation: 'Cloud Monitoring with alerting policies provides real-time monitoring of metrics, uptime checks, and notifications through multiple channels. Cloud Logging with log-based metrics allows you to create custom metrics from log entries and export logs to BigQuery for analysis. Together, they form the foundation of observability. Cloud Profiler and Debugger are useful supplementary tools but are not core to monitoring and alerting.',
    difficulty: 'intermediate',
    reference: 'Cloud Monitoring: Alerting overview'
  },
  {
    id: 'exam-069',
    type: 'single',
    domain: 'devops',
    question: 'You need to store Docker container images and manage their lifecycle, including vulnerability scanning and access control. Which Google Cloud service should you use?',
    options: [
      { id: 'a', text: 'Cloud Storage with a bucket configured for Docker image storage.' },
      { id: 'b', text: 'Artifact Registry for container image management with vulnerability scanning.' },
      { id: 'c', text: 'Container Registry (gcr.io) for backward-compatible image storage.' },
      { id: 'd', text: 'GitHub Container Registry integrated via Cloud Build.' }
    ],
    correct: ['b'],
    explanation: 'Artifact Registry is the recommended service for managing container images (and other artifacts like Maven, npm, and Python packages). It provides IAM-based access control, vulnerability scanning through Container Analysis, and regional/multi-regional repositories. Container Registry is the legacy service that Google recommends migrating away from. Cloud Storage is not designed for container image management.',
    difficulty: 'beginner',
    reference: 'Artifact Registry: Overview'
  },
  {
    id: 'exam-070',
    type: 'single',
    domain: 'devops',
    question: 'Your application deployed on Cloud Run is experiencing intermittent 500 errors. You need to trace the request path through multiple microservices to identify the bottleneck. Which tool should you use?',
    options: [
      { id: 'a', text: 'Cloud Logging to search for error messages in application logs.' },
      { id: 'b', text: 'Cloud Trace to analyze distributed request latency and identify slow services.' },
      { id: 'c', text: 'Cloud Monitoring to view CPU and memory metrics of the services.' },
      { id: 'd', text: 'Error Reporting to view error counts and stack traces.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Trace provides distributed tracing that follows requests as they propagate through multiple microservices. It shows the latency of each service in the request path, helping you identify which service is the bottleneck causing 500 errors. Cloud Logging shows individual log entries, Monitoring shows resource metrics, and Error Reporting shows error aggregates, but none of them trace the full request path.',
    difficulty: 'intermediate',
    reference: 'Cloud Trace: Overview'
  },
  {
    id: 'exam-071',
    type: 'single',
    domain: 'devops',
    question: 'You want to receive automated notifications when the estimated cost of your Google Cloud project exceeds specific thresholds. What should you configure?',
    options: [
      { id: 'a', text: 'Create a Cloud Monitoring alert policy based on the billing/total_cost metric.' },
      { id: 'b', text: 'Set up budget alerts in Cloud Billing with threshold notifications sent to a Pub/Sub topic and email.' },
      { id: 'c', text: 'Write a Cloud Function that queries the Billing API daily and sends email notifications.' },
      { id: 'd', text: 'Use Recommender to identify cost optimization opportunities.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Billing budgets allow you to set spending thresholds and receive notifications when actual or forecasted costs exceed those thresholds. Notifications can be sent via email and/or Pub/Sub topics (which can trigger automated actions like disabling billing). This is the native, purpose-built feature for cost monitoring. Custom Cloud Functions add unnecessary complexity, and Recommender provides optimization suggestions not threshold alerts.',
    difficulty: 'beginner',
    reference: 'Cloud Billing: Set budgets and budget alerts'
  },
  {
    id: 'exam-072',
    type: 'single',
    domain: 'devops',
    question: 'Your team needs to define Service Level Objectives (SLOs) for a production API and be alerted when the error budget is at risk. Which Cloud Monitoring feature should you use?',
    options: [
      { id: 'a', text: 'Custom metrics with alerting policies that trigger when error rates exceed a threshold.' },
      { id: 'b', text: 'SLO monitoring in Cloud Monitoring to define SLIs, set SLO targets, and configure error budget burn rate alerts.' },
      { id: 'c', text: 'Uptime checks to measure the percentage of successful health check responses.' },
      { id: 'd', text: 'Dashboard widgets showing real-time error rate percentage.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Monitoring SLO monitoring allows you to define Service Level Indicators (SLIs) such as availability or latency, set SLO targets (e.g., 99.9% availability), and create alerts based on error budget burn rate. This provides SRE-aligned monitoring with compliance tracking. Custom metrics and alerting are more basic, uptime checks measure only availability, and dashboards are passive visualization.',
    difficulty: 'advanced',
    reference: 'Cloud Monitoring: SLO monitoring'
  },
  {
    id: 'exam-073',
    type: 'single',
    domain: 'devops',
    question: 'You are managing multiple Google Cloud projects and need a centralized view of all logs across the organization. How should you aggregate the logs?',
    options: [
      { id: 'a', text: 'Create a script that copies logs from each project to a central Cloud Storage bucket.' },
      { id: 'b', text: 'Configure an aggregated log sink at the organization level that exports logs to a central project.' },
      { id: 'c', text: 'Use Cloud Monitoring dashboards to view metrics from all projects simultaneously.' },
      { id: 'd', text: 'Grant the Logs Viewer role on all projects to the central operations team.' }
    ],
    correct: ['b'],
    explanation: 'An aggregated log sink created at the organization or folder level can route logs from all child projects to a centralized destination such as a log bucket in a dedicated project, Cloud Storage, BigQuery, or Pub/Sub. This provides a single pane of glass for log analysis and is the recommended approach for organizational log management. Manual scripts are error-prone, dashboards show metrics not logs, and granting access per project does not centralize logs.',
    difficulty: 'advanced',
    reference: 'Cloud Logging: Aggregated sinks'
  },
  {
    id: 'exam-074',
    type: 'single',
    domain: 'devops',
    question: 'You need to ensure that your Cloud Build pipeline only uses approved base images and that all artifacts are signed before deployment. Which combination of services should you use?',
    options: [
      { id: 'a', text: 'Cloud Build with Artifact Registry and Binary Authorization for attestation-based deployment policies.' },
      { id: 'b', text: 'Cloud Build with Container Registry and Cloud Armor for image verification.' },
      { id: 'c', text: 'Jenkins with a custom image scanning step and manual deployment approval.' },
      { id: 'd', text: 'Cloud Build with a custom step that checks image digests against an allowlist.' }
    ],
    correct: ['a'],
    explanation: 'Cloud Build can be configured to build from approved base images and create attestations using Binary Authorization. Binary Authorization then enforces that only properly attested images can be deployed to GKE or Cloud Run. Artifact Registry stores the images with vulnerability scanning. This provides an end-to-end secure software supply chain. Cloud Armor is for web application protection, not image verification.',
    difficulty: 'advanced',
    reference: 'Binary Authorization: Securing the software supply chain'
  },

  // ============================================================
  // SERVERLESS DOMAIN (8 questions)
  // ============================================================
  {
    id: 'exam-075',
    type: 'single',
    domain: 'serverless',
    question: 'You need to run a lightweight function that processes files uploaded to a Cloud Storage bucket. The function takes less than 30 seconds to execute and is triggered a few times per hour. Which service provides the most cost-effective solution?',
    options: [
      { id: 'a', text: 'A Compute Engine VM running a file processing daemon.' },
      { id: 'b', text: 'Cloud Functions triggered by Cloud Storage events.' },
      { id: 'c', text: 'A Cloud Run service with a Pub/Sub push subscription.' },
      { id: 'd', text: 'A GKE pod with a sidecar container watching for new files.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Functions is the most cost-effective choice for lightweight, event-driven processing. It natively supports Cloud Storage triggers, automatically scales to zero when not in use (so you only pay for the invocations), and requires no infrastructure management. A VM runs continuously and incurs constant costs, Cloud Run requires setting up Pub/Sub notifications, and GKE requires cluster overhead.',
    difficulty: 'beginner',
    reference: 'Cloud Functions: Cloud Storage triggers'
  },
  {
    id: 'exam-076',
    type: 'single',
    domain: 'serverless',
    question: 'Your team is building a REST API that needs to handle variable traffic ranging from 0 to 10,000 requests per second. The API needs to connect to a Cloud SQL database and support WebSocket connections. Which serverless platform should you use?',
    options: [
      { id: 'a', text: 'Cloud Functions (2nd gen) for automatic scaling and event handling.' },
      { id: 'b', text: 'Cloud Run for container-based serverless with WebSocket support.' },
      { id: 'c', text: 'App Engine Standard for managed application hosting.' },
      { id: 'd', text: 'App Engine Flexible for custom runtime support.' }
    ],
    correct: ['b'],
    explanation: 'Cloud Run is a serverless container platform that supports WebSocket connections, scales from zero to thousands of instances, and integrates with Cloud SQL via the Cloud SQL Auth Proxy. Cloud Functions does not support WebSocket connections, App Engine Standard has limited WebSocket support, and App Engine Flexible does not scale to zero.',
    difficulty: 'intermediate',
    reference: 'Cloud Run: WebSocket support'
  },
  {
    id: 'exam-077',
    type: 'single',
    domain: 'serverless',
    question: 'You are deploying a Python web application on App Engine Standard. You need to configure automatic scaling that limits the maximum number of instances to 10 and sets the minimum to 2 for faster cold starts. Where do you configure these settings?',
    options: [
      { id: 'a', text: 'In the Dockerfile with environment variables for scaling limits.' },
      { id: 'b', text: 'In the app.yaml file under the automatic_scaling section.' },
      { id: 'c', text: 'In the Google Cloud Console under App Engine > Settings > Scaling.' },
      { id: 'd', text: 'In a separate scaling.yaml configuration file deployed alongside the application.' }
    ],
    correct: ['b'],
    explanation: 'App Engine Standard scaling configuration is defined in the app.yaml file under the automatic_scaling section. You can set min_instances, max_instances, min_idle_instances, and other scaling parameters. There is no separate scaling.yaml, the Console does not override app.yaml scaling config, and Dockerfiles are not used in App Engine Standard.',
    difficulty: 'intermediate',
    reference: 'App Engine: app.yaml reference'
  },
  {
    id: 'exam-078',
    type: 'multi',
    domain: 'serverless',
    question: 'You are choosing between Cloud Functions (2nd gen) and Cloud Run for a new microservice. Which two statements correctly describe differences between the services? (Choose two.)',
    options: [
      { id: 'a', text: 'Cloud Functions (2nd gen) is built on Cloud Run infrastructure and supports up to 60 minutes of execution time.' },
      { id: 'b', text: 'Cloud Run supports any language or binary packaged in a container, while Cloud Functions requires specific runtime versions.' },
      { id: 'c', text: 'Cloud Functions provides higher maximum concurrency per instance than Cloud Run.' },
      { id: 'd', text: 'Cloud Run cannot be triggered by Eventarc events; only Cloud Functions supports event triggers.' }
    ],
    correct: ['a', 'b'],
    explanation: 'Cloud Functions 2nd gen is indeed built on Cloud Run and Eventarc infrastructure, supporting execution times up to 60 minutes. Cloud Run supports any container with any language or runtime, while Cloud Functions supports specific language runtimes (Node.js, Python, Go, Java, etc.). Cloud Run actually supports higher concurrency (up to 1000 per instance) compared to Cloud Functions. Both services can receive events via Eventarc.',
    difficulty: 'advanced',
    reference: 'Cloud Functions: 2nd gen overview'
  },
  {
    id: 'exam-079',
    type: 'single',
    domain: 'serverless',
    question: 'Your Cloud Run service needs to access a private API hosted on a Compute Engine VM in your VPC. The Cloud Run service should not have a public IP. How should you configure this?',
    options: [
      { id: 'a', text: 'Configure VPC connectors (Serverless VPC Access) for the Cloud Run service to access resources in your VPC.' },
      { id: 'b', text: 'Assign a static external IP to the Cloud Run service and whitelist it in the VM firewall.' },
      { id: 'c', text: 'Use Cloud NAT to route Cloud Run egress traffic through the VPC.' },
      { id: 'd', text: 'Deploy the Cloud Run service in the same VPC subnet as the Compute Engine VM.' }
    ],
    correct: ['a'],
    explanation: 'Serverless VPC Access connectors allow serverless services like Cloud Run to connect to resources in your VPC using internal IP addresses. You can configure the Cloud Run service to route all egress traffic through the VPC connector, enabling access to private resources. Cloud Run cannot be deployed directly in a VPC subnet, and it does not natively support static external IPs for egress. Cloud NAT works with VPC resources, not directly with Cloud Run.',
    difficulty: 'intermediate',
    reference: 'Serverless VPC Access: Overview'
  },
  {
    id: 'exam-080',
    type: 'single',
    domain: 'serverless',
    question: 'You want to create a scheduled Cloud Function that runs every day at midnight UTC to generate a daily report. How should you set up the trigger?',
    options: [
      { id: 'a', text: 'Use Cloud Scheduler to publish a message to a Pub/Sub topic that triggers the Cloud Function.' },
      { id: 'b', text: 'Configure a cron job directly in the Cloud Functions configuration.' },
      { id: 'c', text: 'Use App Engine cron.yaml to call the Cloud Function endpoint via HTTP.' },
      { id: 'd', text: 'Create a Compute Engine VM that runs a cron job to invoke the function.' }
    ],
    correct: ['a'],
    explanation: 'Cloud Scheduler can create cron-based jobs that publish messages to a Pub/Sub topic on a defined schedule. A Cloud Function configured with a Pub/Sub trigger will execute whenever a message is published to that topic. This is the standard pattern for scheduled Cloud Functions. Cloud Functions do not have built-in cron configuration, App Engine cron is a separate service, and a dedicated VM for cron is wasteful.',
    difficulty: 'beginner',
    reference: 'Cloud Scheduler: Creating and configuring cron jobs'
  },
  {
    id: 'exam-081',
    type: 'single',
    domain: 'serverless',
    question: 'You are running a Cloud Run service that processes long-running tasks taking up to 30 minutes. Users submit tasks via an HTTP endpoint and expect an immediate acknowledgment. How should you architect this?',
    options: [
      { id: 'a', text: 'Increase the Cloud Run request timeout to 30 minutes and have the client wait for the response.' },
      { id: 'b', text: 'Have the HTTP endpoint publish a message to Pub/Sub and return immediately, then use a separate Cloud Run service with a Pub/Sub push subscription to process the task asynchronously.' },
      { id: 'c', text: 'Use Cloud Tasks to queue the work and process it synchronously within the same Cloud Run instance.' },
      { id: 'd', text: 'Store the task in Firestore and use a background Cloud Function to poll for new tasks.' }
    ],
    correct: ['b'],
    explanation: 'The recommended pattern for long-running tasks is to decouple the request acceptance from the processing. The HTTP endpoint publishes a message to Pub/Sub and immediately returns a task ID to the user. A separate Cloud Run service receives the message via push subscription and processes the task asynchronously. This provides immediate user feedback, reliable task processing, and independent scaling. Keeping the client waiting for 30 minutes is a poor user experience.',
    difficulty: 'advanced',
    reference: 'Cloud Run: Asynchronous processing with Pub/Sub'
  },
  {
    id: 'exam-082',
    type: 'single',
    domain: 'serverless',
    question: 'Your organization is migrating a legacy Java web application to Google Cloud. The application uses background threads, writes to the local file system, and requires a specific JDK version. Which App Engine environment should you use?',
    options: [
      { id: 'a', text: 'App Engine Standard environment with the Java runtime.' },
      { id: 'b', text: 'App Engine Flexible environment with a custom Docker container.' },
      { id: 'c', text: 'Cloud Functions with the Java runtime.' },
      { id: 'd', text: 'Cloud Run with the default Java base image.' }
    ],
    correct: ['b'],
    explanation: 'App Engine Flexible environment runs containers on Compute Engine VMs, supporting background threads, local file system writes, and custom runtimes via Docker containers. App Engine Standard restricts background threads, has a read-only file system (except /tmp), and only supports specific runtime versions. Cloud Functions do not support background threads, and while Cloud Run could work, App Engine Flexible provides the most straightforward migration path for legacy applications with these specific requirements.',
    difficulty: 'intermediate',
    reference: 'App Engine: Flexible environment overview'
  }
];
