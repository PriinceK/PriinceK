// Networking Lab — Lesson Curriculum
// 20+ missions across 8 levels covering DNS, routing, firewalls,
// diagnostics, load balancing, and GCP networking concepts

export const NETWORK_LESSONS = [
  // ═══════════════════════════════════════════
  // LEVEL 1 — Network Basics
  // ═══════════════════════════════════════════
  {
    id: 'net-101',
    title: 'Interface Discovery',
    description: 'Explore your network interfaces and IP configuration.',
    level: 1,
    category: 'interfaces',
    difficulty: 'Beginner',
    briefing: 'Every GCP VM comes with network interfaces configured by the VPC. Understanding your network config is step one.\n\nYour mission: discover the network configuration of this VM.',
    cloudConnection: 'GCP VMs get IPs from the VPC subnet. The internal IP (10.x.x.x) is for intra-VPC traffic, while external IPs allow internet access.',
    quickReference: [
      { cmd: 'ip addr', desc: 'Show IP addresses' },
      { cmd: 'ip link', desc: 'Show network interfaces' },
      { cmd: 'ip route', desc: 'Show routing table' },
      { cmd: 'ifconfig', desc: 'Legacy interface config' },
      { cmd: 'hostname', desc: 'Show hostname' },
    ],
    tasks: [
      {
        id: 'net-101-1',
        instruction: 'Check your VM\'s hostname.',
        hint: 'Type: hostname',
        successMessage: 'This VM is named "gcp-lab".',
        validation: { type: 'command', check: 'hostname' },
      },
      {
        id: 'net-101-2',
        instruction: 'View all network interfaces and their IP addresses.',
        hint: 'Type: ip addr',
        successMessage: 'Found lo (loopback) and eth0 with IP 10.128.0.2!',
        validation: { type: 'command_contains', check: 'ip a' },
      },
      {
        id: 'net-101-3',
        instruction: 'View the routing table to see how traffic flows.',
        hint: 'Type: ip route',
        successMessage: 'Default gateway is 10.128.0.1 — the VPC router!',
        validation: { type: 'command_contains', check: 'ip r' },
      },
      {
        id: 'net-101-4',
        instruction: 'Check the DNS resolver configuration.',
        hint: 'Type: cat /etc/resolv.conf',
        successMessage: 'Using Google DNS (8.8.8.8) — standard for GCP VMs.',
        validation: { type: 'command_contains', check: 'resolv.conf' },
      },
    ],
  },
  {
    id: 'net-102',
    title: 'Hosts & Resolution',
    description: 'Understand local host resolution and /etc/hosts.',
    level: 1,
    category: 'dns',
    difficulty: 'Beginner',
    briefing: 'Before DNS queries leave the machine, Linux checks /etc/hosts for local name resolution.\n\nYour mission: explore how hostname resolution works locally.',
    cloudConnection: 'GCP internal DNS resolves VM names automatically. /etc/hosts provides local overrides.',
    quickReference: [
      { cmd: 'cat /etc/hosts', desc: 'Local host mappings' },
      { cmd: 'cat /etc/hostname', desc: 'This machine\'s name' },
      { cmd: 'ping hostname', desc: 'Test connectivity' },
    ],
    tasks: [
      {
        id: 'net-102-1',
        instruction: 'View the local hosts file to see hostname-to-IP mappings.',
        hint: 'Type: cat /etc/hosts',
        successMessage: 'Local names like web-server, db-server map to internal IPs!',
        validation: { type: 'command', check: 'cat /etc/hosts' },
      },
      {
        id: 'net-102-2',
        instruction: 'Ping the web-server by name to test local resolution.',
        hint: 'Type: ping -c 2 web-server',
        successMessage: 'web-server resolves to 10.128.0.2 from /etc/hosts!',
        validation: { type: 'command_contains', check: 'ping' },
      },
      {
        id: 'net-102-3',
        instruction: 'Ping the db-server to verify it\'s reachable.',
        hint: 'Type: ping -c 2 db-server',
        successMessage: 'db-server at 10.128.0.3 is reachable!',
        validation: { type: 'command_contains', check: 'db-server' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 2 — Connectivity Testing
  // ═══════════════════════════════════════════
  {
    id: 'net-201',
    title: 'Ping & Traceroute',
    description: 'Test network connectivity and trace packet routes.',
    level: 2,
    category: 'diagnostics',
    difficulty: 'Beginner',
    briefing: 'Users are reporting slow connections. You need to diagnose where the latency is.\n\nYour mission: use ping and traceroute to diagnose connectivity.',
    cloudConnection: 'GCP VPC firewall rules must allow ICMP for ping to work. Traceroute shows the path through GCP\'s network.',
    quickReference: [
      { cmd: 'ping -c 4 host', desc: 'Send 4 ICMP packets' },
      { cmd: 'traceroute host', desc: 'Trace packet route' },
      { cmd: 'ping -c 1 8.8.8.8', desc: 'Quick connectivity check' },
    ],
    tasks: [
      {
        id: 'net-201-1',
        instruction: 'Ping Google DNS (8.8.8.8) to verify internet connectivity.',
        hint: 'Type: ping -c 4 8.8.8.8',
        successMessage: 'Internet is reachable! ~15ms latency is normal for GCP.',
        validation: { type: 'command_contains', check: 'ping' },
      },
      {
        id: 'net-201-2',
        instruction: 'Ping the app-server to check internal network connectivity.',
        hint: 'Type: ping -c 4 app-server',
        successMessage: 'Internal traffic has very low latency (<2ms)!',
        validation: { type: 'command_contains', check: 'app-server' },
      },
      {
        id: 'net-201-3',
        instruction: 'Trace the route to google.com to see the network path.',
        hint: 'Type: traceroute google.com',
        successMessage: 'You can see each hop from your VM to Google\'s servers.',
        validation: { type: 'command_contains', check: 'traceroute' },
      },
      {
        id: 'net-201-4',
        instruction: 'Trace the route to the internal load-balancer.',
        hint: 'Type: traceroute load-balancer',
        successMessage: 'Internal routes are much shorter — fewer hops!',
        validation: { type: 'command_contains', check: 'load-balancer' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 3 — DNS Deep Dive
  // ═══════════════════════════════════════════
  {
    id: 'net-301',
    title: 'DNS Resolver',
    description: 'Query DNS records using dig and nslookup.',
    level: 3,
    category: 'dns',
    difficulty: 'Intermediate',
    briefing: 'A domain is not resolving correctly. You need to debug DNS resolution.\n\nYour mission: use DNS tools to query and verify domain records.',
    cloudConnection: 'GCP Cloud DNS manages zones and records. Understanding DNS record types is essential for cloud deployments.',
    quickReference: [
      { cmd: 'dig example.com', desc: 'Query A record' },
      { cmd: 'dig example.com MX', desc: 'Query MX record' },
      { cmd: 'nslookup example.com', desc: 'Simple DNS lookup' },
      { cmd: 'host example.com', desc: 'Quick DNS lookup' },
    ],
    tasks: [
      {
        id: 'net-301-1',
        instruction: 'Look up the IP address of example.com using dig.',
        hint: 'Type: dig example.com',
        successMessage: 'dig shows the full DNS response including the ANSWER SECTION!',
        validation: { type: 'command_contains', check: 'dig example.com' },
      },
      {
        id: 'net-301-2',
        instruction: 'Query the MX (mail) record for google.com.',
        hint: 'Type: dig google.com MX',
        successMessage: 'MX records tell email servers where to deliver mail!',
        validation: { type: 'command_contains', check: 'MX' },
      },
      {
        id: 'net-301-3',
        instruction: 'Use nslookup to resolve cloud.google.com.',
        hint: 'Type: nslookup cloud.google.com',
        successMessage: 'nslookup is a simpler alternative to dig for quick lookups.',
        validation: { type: 'command_contains', check: 'nslookup' },
      },
      {
        id: 'net-301-4',
        instruction: 'Use host to check if the GCP metadata server resolves.',
        hint: 'Type: host metadata.google.internal',
        successMessage: 'The metadata server at 169.254.169.254 is a link-local address!',
        validation: { type: 'command_contains', check: 'host' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 4 — Ports & Connections
  // ═══════════════════════════════════════════
  {
    id: 'net-401',
    title: 'Port Scanner',
    description: 'Discover listening ports and active connections.',
    level: 4,
    category: 'ports',
    difficulty: 'Intermediate',
    briefing: 'Security team wants an audit of all open ports on this VM. You need to identify what services are listening.\n\nYour mission: discover all open ports and connections.',
    cloudConnection: 'GCP VPC firewall rules control which ports are accessible externally. But first you need to know what\'s listening locally.',
    quickReference: [
      { cmd: 'ss -tulnp', desc: 'Show listening TCP/UDP ports' },
      { cmd: 'netstat -tulnp', desc: 'Legacy port listing' },
      { cmd: 'ss -t', desc: 'Show established TCP connections' },
    ],
    tasks: [
      {
        id: 'net-401-1',
        instruction: 'List all listening TCP ports using ss.',
        hint: 'Type: ss -tulnp',
        successMessage: 'You can see SSH (22), nginx (80), MySQL (3306), and more!',
        validation: { type: 'command_contains', check: 'ss' },
      },
      {
        id: 'net-401-2',
        instruction: 'Use netstat to list the same information (legacy tool).',
        hint: 'Type: netstat -tulnp',
        successMessage: 'netstat and ss show similar info — ss is the modern replacement.',
        validation: { type: 'command_contains', check: 'netstat' },
      },
      {
        id: 'net-401-3',
        instruction: 'Use curl to test if the local web server is responding.',
        hint: 'Type: curl localhost',
        successMessage: 'The web server is serving the GCP Lab page!',
        validation: { type: 'command_contains', check: 'curl localhost' },
      },
      {
        id: 'net-401-4',
        instruction: 'Use curl with -I to check just the HTTP headers.',
        hint: 'Type: curl -I localhost',
        successMessage: 'Headers show nginx is the server and content is HTML.',
        validation: { type: 'command_contains', check: 'curl -I' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 5 — HTTP & APIs
  // ═══════════════════════════════════════════
  {
    id: 'net-501',
    title: 'API Explorer',
    description: 'Use curl to interact with HTTP APIs and the GCP metadata server.',
    level: 5,
    category: 'http',
    difficulty: 'Intermediate',
    briefing: 'Cloud APIs are HTTP-based. Every GCP VM can query the metadata server for instance information.\n\nYour mission: interact with APIs using curl.',
    cloudConnection: 'The GCP metadata server (169.254.169.254) provides instance info, service account tokens, and project metadata.',
    quickReference: [
      { cmd: 'curl URL', desc: 'GET request' },
      { cmd: 'curl -v URL', desc: 'Verbose (show headers)' },
      { cmd: 'curl -X POST URL', desc: 'POST request' },
      { cmd: 'curl -s URL', desc: 'Silent mode' },
      { cmd: 'curl -H "Header: val" URL', desc: 'Custom headers' },
    ],
    tasks: [
      {
        id: 'net-501-1',
        instruction: 'Query the GCP metadata server for instance info.',
        hint: 'Type: curl metadata.google.internal',
        successMessage: 'You got JSON with the VM\'s zone, machine type, and hostname!',
        validation: { type: 'command_contains', check: 'metadata' },
      },
      {
        id: 'net-501-2',
        instruction: 'Make a verbose request to the web-server to see HTTP details.',
        hint: 'Type: curl -v web-server',
        successMessage: 'Verbose mode shows the full HTTP request/response cycle!',
        validation: { type: 'command_contains', check: 'curl -v' },
      },
      {
        id: 'net-501-3',
        instruction: 'Test the app-server health endpoint.',
        hint: 'Type: curl app-server',
        successMessage: 'Got a JSON response — the API is healthy!',
        validation: { type: 'command_contains', check: 'curl' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 6 — Firewall Rules
  // ═══════════════════════════════════════════
  {
    id: 'net-601',
    title: 'Firewall Inspector',
    description: 'View and understand iptables firewall rules.',
    level: 6,
    category: 'firewall',
    difficulty: 'Advanced',
    briefing: 'The firewall is the last line of defense on the VM. You need to audit the current rules.\n\nYour mission: inspect and understand the iptables firewall configuration.',
    cloudConnection: 'GCP VPC firewalls work at the network level. iptables provides host-level firewall on the VM itself.',
    quickReference: [
      { cmd: 'sudo iptables -L', desc: 'List all rules' },
      { cmd: 'sudo iptables -L -n', desc: 'List rules (numeric)' },
      { cmd: 'sudo iptables -A INPUT ...', desc: 'Add a rule' },
      { cmd: 'sudo iptables -F', desc: 'Flush all rules' },
    ],
    tasks: [
      {
        id: 'net-601-1',
        instruction: 'List all firewall rules using iptables (you need sudo).',
        hint: 'Type: sudo iptables -L',
        successMessage: 'You can see INPUT, FORWARD, and OUTPUT chains!',
        validation: { type: 'command_contains', check: 'iptables -L' },
      },
      {
        id: 'net-601-2',
        instruction: 'List rules with numeric addresses for clearer output.',
        hint: 'Type: sudo iptables -L -n',
        successMessage: 'Numeric mode shows IPs instead of hostnames — faster and clearer.',
        validation: { type: 'command_contains', check: 'iptables -L -n' },
      },
      {
        id: 'net-601-3',
        instruction: 'Add a rule to allow HTTPS (port 443) traffic.',
        hint: 'Type: sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
        successMessage: 'Port 443 is now allowed through the firewall!',
        validation: { type: 'command_contains', check: '443' },
      },
      {
        id: 'net-601-4',
        instruction: 'Verify the new rule was added by listing rules again.',
        hint: 'Type: sudo iptables -L -n',
        successMessage: 'The HTTPS rule appears in the INPUT chain!',
        validation: { type: 'command_contains', check: 'iptables -L' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 7 — Network Troubleshooting
  // ═══════════════════════════════════════════
  {
    id: 'net-701',
    title: 'Connection Debugger',
    description: 'Diagnose and fix network connectivity issues systematically.',
    level: 7,
    category: 'troubleshooting',
    difficulty: 'Advanced',
    briefing: 'ALERT: The application can\'t reach the database server. Users are getting errors.\n\nYour mission: systematically debug the connectivity issue using a bottom-up approach.',
    cloudConnection: 'GCP troubleshooting follows the same layers: check interface → routing → DNS → firewall → service.',
    quickReference: [
      { cmd: 'ip addr', desc: '1. Check interface is UP' },
      { cmd: 'ip route', desc: '2. Check routing' },
      { cmd: 'ping gateway', desc: '3. Check gateway' },
      { cmd: 'dig host', desc: '4. Check DNS' },
      { cmd: 'curl host:port', desc: '5. Check service' },
    ],
    tasks: [
      {
        id: 'net-701-1',
        instruction: 'Step 1: Verify the network interface is UP.',
        hint: 'Type: ip link',
        successMessage: 'eth0 is UP — the physical layer is fine.',
        validation: { type: 'command_contains', check: 'ip link' },
      },
      {
        id: 'net-701-2',
        instruction: 'Step 2: Check the routing table to ensure a route to db-server exists.',
        hint: 'Type: ip route',
        successMessage: 'Route to 10.128.0.0/16 exists via eth0 — routing is correct.',
        validation: { type: 'command_contains', check: 'ip route' },
      },
      {
        id: 'net-701-3',
        instruction: 'Step 3: Ping the db-server to test basic connectivity.',
        hint: 'Type: ping -c 2 db-server',
        successMessage: 'Ping succeeds — the server is reachable at the network layer.',
        validation: { type: 'command_contains', check: 'ping' },
      },
      {
        id: 'net-701-4',
        instruction: 'Step 4: Check if MySQL port 3306 is in the firewall rules.',
        hint: 'Type: sudo iptables -L -n',
        successMessage: 'Port 3306 isn\'t explicitly allowed, but the connection is outbound (OUTPUT=ACCEPT).',
        validation: { type: 'command_contains', check: 'iptables' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 8 — Advanced Networking
  // ═══════════════════════════════════════════
  {
    id: 'net-801',
    title: 'ARP & Neighbors',
    description: 'Understand Layer 2 networking and the ARP cache.',
    level: 8,
    category: 'advanced',
    difficulty: 'Advanced',
    briefing: 'Understanding how IP addresses map to MAC addresses at Layer 2 is crucial for debugging network issues.\n\nYour mission: explore the ARP cache and understand neighbor discovery.',
    cloudConnection: 'In GCP VPCs, ARP is handled by the virtual network. Understanding it helps debug connectivity issues.',
    quickReference: [
      { cmd: 'ip neigh', desc: 'Show ARP cache' },
      { cmd: 'ip addr', desc: 'Show MAC addresses' },
      { cmd: 'route', desc: 'Show routing table' },
    ],
    tasks: [
      {
        id: 'net-801-1',
        instruction: 'View the ARP neighbor cache.',
        hint: 'Type: ip neigh',
        successMessage: 'ARP maps IP addresses to MAC addresses on the local network!',
        validation: { type: 'command_contains', check: 'ip neigh' },
      },
      {
        id: 'net-801-2',
        instruction: 'Check the MAC address of our own eth0 interface.',
        hint: 'Type: ip link',
        successMessage: 'Your MAC starts with 42:01 — that\'s a GCP virtual NIC!',
        validation: { type: 'command_contains', check: 'ip link' },
      },
      {
        id: 'net-801-3',
        instruction: 'View the full routing table using the route command.',
        hint: 'Type: route',
        successMessage: 'The kernel routing table shows all network paths!',
        validation: { type: 'command', check: 'route' },
      },
    ],
  },
  {
    id: 'net-802',
    title: 'Network Security Audit',
    description: 'Perform a comprehensive network security audit of a GCP VM.',
    level: 8,
    category: 'security',
    difficulty: 'Advanced',
    briefing: 'SECURITY REVIEW: Before this VM goes to production, we need a full network security audit.\n\nYour mission: identify and document all network services, open ports, and firewall rules.',
    cloudConnection: 'Production VMs in GCP should follow the principle of least privilege — only open ports that are needed.',
    quickReference: [
      { cmd: 'ss -tulnp', desc: 'All listening ports' },
      { cmd: 'sudo iptables -L -n', desc: 'Firewall rules' },
      { cmd: 'ps aux', desc: 'Running processes' },
      { cmd: 'cat /etc/ssh/sshd_config', desc: 'SSH config' },
    ],
    tasks: [
      {
        id: 'net-802-1',
        instruction: 'List all listening ports to identify exposed services.',
        hint: 'Type: ss -tulnp',
        successMessage: 'Found: SSH(22), HTTP(80), MySQL(3306), DNS(53).',
        validation: { type: 'command_contains', check: 'ss' },
      },
      {
        id: 'net-802-2',
        instruction: 'Audit the firewall rules.',
        hint: 'Type: sudo iptables -L -n',
        successMessage: 'Review: only SSH(22), HTTP(80), and ICMP are allowed inbound.',
        validation: { type: 'command_contains', check: 'iptables' },
      },
      {
        id: 'net-802-3',
        instruction: 'Check SSH configuration for security best practices.',
        hint: 'Type: cat /etc/ssh/sshd_config',
        successMessage: 'Good: PermitRootLogin=no, PasswordAuth=no, MaxAuthTries=3.',
        validation: { type: 'command_contains', check: 'sshd_config' },
      },
      {
        id: 'net-802-4',
        instruction: 'Check the network interface configuration for any unusual settings.',
        hint: 'Type: cat /etc/network/interfaces',
        successMessage: 'Standard DHCP config on eth0 — no unusual static routes.',
        validation: { type: 'command_contains', check: 'interfaces' },
      },
    ],
  },
]
