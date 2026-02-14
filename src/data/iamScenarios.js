export const IAM_SCENARIOS = [
    {
        id: 'least-privilege', title: 'Principle of Least Privilege', description: 'A developer needs to deploy Cloud Functions but was given Project Owner role.', category: 'Role Assignment', icon: '🔐',
        currentSetup: { member: 'user:dev@company.com', currentRole: 'roles/owner', problem: 'Project Owner is too broad — includes billing, IAM admin, and all resource permissions.' },
        tasks: [
            { question: 'What is the most appropriate predefined role for deploying Cloud Functions?', options: ['roles/owner', 'roles/editor', 'roles/cloudfunctions.developer', 'roles/cloudfunctions.viewer'], answer: 2, explanation: 'roles/cloudfunctions.developer grants permissions to create, update, and delete functions without broader project access.' },
            { question: 'The developer also needs to view Cloud Logging for debugging. What additional role is needed?', options: ['roles/logging.admin', 'roles/logging.viewer', 'roles/owner', 'roles/editor'], answer: 1, explanation: 'roles/logging.viewer allows reading logs without granting write or admin permissions.' },
            { question: 'Should these roles be applied at the project level or resource level?', options: ['Organization level', 'Folder level', 'Project level', 'Individual resource level'], answer: 2, explanation: 'Project level is appropriate here. Cloud Functions and Logging are project-scoped services.' },
        ],
    },
    {
        id: 'service-account', title: 'Service Account Best Practices', description: 'An application uses the default compute service account.', category: 'Service Accounts', icon: '🤖',
        currentSetup: { member: '123456789-compute@developer.gserviceaccount.com', currentRole: 'roles/editor (default)', problem: 'The default compute service account has the Editor role, which is overly permissive.' },
        tasks: [
            { question: 'What is wrong with using the default compute service account?', options: ['It cannot access GCP APIs', 'It has the Editor role by default — too many permissions', 'It expires after 24 hours', 'It cannot be used with Cloud Run'], answer: 1, explanation: 'The default compute service account has the Editor role, granting read/write to most GCP resources.' },
            { question: 'What should you do instead?', options: ['Delete the default service account', 'Create a custom service account with only required permissions', 'Add more roles to the default account', 'Use an API key instead'], answer: 1, explanation: 'Create a dedicated service account for each application with only the specific roles it needs.' },
            { question: 'If the app only reads from Cloud Storage and publishes to Pub/Sub, which roles?', options: ['roles/editor', 'roles/storage.objectViewer + roles/pubsub.publisher', 'roles/storage.admin + roles/pubsub.admin', 'roles/owner'], answer: 1, explanation: 'Exactly the permissions needed: objectViewer for reading and publisher for publishing.' },
            { question: 'How can you prevent service account key sprawl?', options: ['Create more keys', 'Use Workload Identity for GKE and impersonation', 'Store keys in source code', 'Use the same key everywhere'], answer: 1, explanation: 'Workload Identity federates pod identity to GCP service accounts without key files.' },
        ],
    },
    {
        id: 'conditional-iam', title: 'IAM Conditions', description: 'Configure time-based and resource-based IAM conditions.', category: 'Advanced IAM', icon: '⏰',
        currentSetup: { member: 'user:contractor@external.com', currentRole: 'roles/compute.admin', problem: 'A contractor has permanent Compute Admin access. Access should be time-limited.' },
        tasks: [
            { question: 'What IAM feature allows you to restrict access based on time?', options: ['IAM deny policies', 'IAM conditions with timestamp expressions', 'Service account keys with expiry', 'Organization policies'], answer: 1, explanation: 'IAM conditions support CEL expressions including request.time comparisons.' },
            { question: 'Which CEL expression limits access until March 2027?', options: ['request.time < timestamp("2027-03-01T00:00:00Z")', 'resource.name.startsWith("projects/")', 'request.auth.claims.email == "user@example.com"', 'request.time > timestamp("2027-03-01T00:00:00Z")'], answer: 0, explanation: 'request.time < timestamp ensures the binding is only effective before the date.' },
            { question: 'How can you restrict the contractor to only "dev-" prefixed VMs?', options: ['Create a separate project', 'Use resource.name condition', 'Create a custom role', 'Use network tags'], answer: 1, explanation: 'Resource name conditions scope access to specific resources matching a pattern.' },
        ],
    },
    {
        id: 'org-policy', title: 'Organization Policies', description: 'Set organization-level constraints to enforce security best practices.', category: 'Organization', icon: '🏢',
        currentSetup: { member: 'Organization: my-company.com', currentRole: 'No org policies defined', problem: 'Projects can create resources in any region and use external IPs freely.' },
        tasks: [
            { question: 'Which org policy constrains where resources can be created?', options: ['constraints/compute.disableSerialPortAccess', 'constraints/gcp.resourceLocations', 'constraints/iam.allowedPolicyMemberDomains', 'constraints/compute.vmExternalIpAccess'], answer: 1, explanation: 'constraints/gcp.resourceLocations limits which regions/zones resources can be created in.' },
            { question: 'How do you prevent VMs from having external IPs?', options: ['Delete all firewall rules', 'Remove all service accounts', 'Apply constraints/compute.vmExternalIpAccess org policy', 'Use a private VPC only'], answer: 2, explanation: 'This constraint prevents VMs from being assigned external IPs.' },
            { question: 'To prevent IAM bindings to external domains, which constraint?', options: ['constraints/gcp.resourceLocations', 'constraints/compute.trustedImageProjects', 'constraints/iam.allowedPolicyMemberDomains', 'constraints/iam.disableServiceAccountCreation'], answer: 2, explanation: 'Restricts which domains can be granted IAM roles.' },
        ],
    },
]
