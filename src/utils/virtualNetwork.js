// Virtual Network Engine — simulates network topology, DNS, routing, firewalls, and diagnostic tools

export class VirtualNetwork {
  constructor() {
    this.localHost = {
      hostname: 'gcp-lab',
      interfaces: {
        lo: { ip: '127.0.0.1', mask: '255.0.0.0', prefix: 8, mac: '00:00:00:00:00:00', mtu: 65536, state: 'UP' },
        eth0: { ip: '10.128.0.2', mask: '255.255.0.0', prefix: 16, mac: '42:01:0a:80:00:02', mtu: 1460, state: 'UP' },
      },
      gateway: '10.128.0.1',
      dns: ['8.8.8.8', '8.8.4.4'],
    }

    this.hosts = {
      'web-server': { ip: '10.128.0.2', ports: [22, 80, 443], os: 'Ubuntu 22.04' },
      'db-server': { ip: '10.128.0.3', ports: [22, 3306, 5432], os: 'Ubuntu 22.04' },
      'app-server': { ip: '10.128.0.4', ports: [22, 8080, 8443], os: 'Ubuntu 22.04' },
      'load-balancer': { ip: '10.128.0.10', ports: [80, 443], os: 'GCP LB' },
      'bastion': { ip: '10.128.0.20', ports: [22], os: 'Ubuntu 22.04' },
      'monitoring': { ip: '10.128.0.30', ports: [22, 9090, 3000], os: 'Ubuntu 22.04' },
      'gcp-lab': { ip: '10.128.0.2', ports: [22, 80], os: 'Ubuntu 22.04' },
      'localhost': { ip: '127.0.0.1', ports: [22, 80], os: 'Ubuntu 22.04' },
    }

    this.dnsRecords = {
      'example.com': { A: '93.184.216.34', MX: '10 mail.example.com', NS: 'ns1.example.com', TXT: 'v=spf1 include:_spf.google.com ~all' },
      'google.com': { A: '142.250.80.46', MX: '10 smtp.google.com', NS: 'ns1.google.com', AAAA: '2607:f8b0:4004:800::200e' },
      'cloud.google.com': { A: '142.250.80.78', CNAME: 'www3.l.google.com' },
      'web-server': { A: '10.128.0.2' },
      'db-server': { A: '10.128.0.3' },
      'app-server': { A: '10.128.0.4' },
      'load-balancer': { A: '10.128.0.10' },
      'bastion': { A: '10.128.0.20' },
      'monitoring': { A: '10.128.0.30' },
      'metadata.google.internal': { A: '169.254.169.254' },
      'my-project.internal': { A: '10.128.0.2' },
    }

    this.routes = [
      { destination: '0.0.0.0/0', gateway: '10.128.0.1', iface: 'eth0', metric: 100 },
      { destination: '10.128.0.0/16', gateway: '0.0.0.0', iface: 'eth0', metric: 0 },
      { destination: '127.0.0.0/8', gateway: '0.0.0.0', iface: 'lo', metric: 0 },
      { destination: '169.254.169.254/32', gateway: '10.128.0.1', iface: 'eth0', metric: 0 },
    ]

    this.firewallRules = [
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: 'state RELATED,ESTABLISHED' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'tcp', source: '0.0.0.0/0', destination: '0.0.0.0/0', dport: 22, extra: '' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'tcp', source: '0.0.0.0/0', destination: '0.0.0.0/0', dport: 80, extra: '' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'icmp', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'INPUT', target: 'DROP', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'FORWARD', target: 'DROP', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'OUTPUT', target: 'ACCEPT', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
    ]

    this.listeningPorts = [
      { proto: 'tcp', local: '0.0.0.0:22', foreign: '0.0.0.0:*', state: 'LISTEN', pid: 456, program: 'sshd' },
      { proto: 'tcp', local: '0.0.0.0:80', foreign: '0.0.0.0:*', state: 'LISTEN', pid: 789, program: 'nginx' },
      { proto: 'tcp', local: '127.0.0.1:3306', foreign: '0.0.0.0:*', state: 'LISTEN', pid: 1200, program: 'mysqld' },
      { proto: 'tcp', local: '10.128.0.2:22', foreign: '35.202.100.5:52341', state: 'ESTABLISHED', pid: 5678, program: 'sshd' },
      { proto: 'udp', local: '0.0.0.0:68', foreign: '0.0.0.0:*', state: '', pid: 300, program: 'dhclient' },
      { proto: 'udp', local: '127.0.0.53:53', foreign: '0.0.0.0:*', state: '', pid: 350, program: 'systemd-resolve' },
    ]

    this.arpCache = [
      { ip: '10.128.0.1', mac: '42:01:0a:80:00:01', iface: 'eth0', state: 'REACHABLE' },
      { ip: '10.128.0.3', mac: '42:01:0a:80:00:03', iface: 'eth0', state: 'STALE' },
      { ip: '10.128.0.4', mac: '42:01:0a:80:00:04', iface: 'eth0', state: 'REACHABLE' },
    ]
  }

  _resolveIP(target) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(target)) return target
    if (this.hosts[target]) return this.hosts[target].ip
    if (this.dnsRecords[target]?.A) return this.dnsRecords[target].A
    return null
  }

  _isReachable(ip) {
    if (ip === '127.0.0.1') return true
    if (ip.startsWith('10.128.')) return true
    // Simulate external hosts as reachable
    if (ip.startsWith('142.') || ip.startsWith('93.') || ip.startsWith('8.8.')) return true
    return Math.random() > 0.1 // 90% reachable
  }

  ping(target, count = 4) {
    const ip = this._resolveIP(target)
    if (!ip) return `ping: ${target}: Name or service not known`
    const reachable = this._isReachable(ip)
    const lines = [`PING ${target} (${ip}) 56(84) bytes of data.`]
    let received = 0
    for (let i = 0; i < count; i++) {
      if (reachable) {
        const ttl = ip.startsWith('10.') ? 64 : 54
        const time = ip.startsWith('10.') ? (Math.random() * 2 + 0.3).toFixed(2) : (Math.random() * 20 + 10).toFixed(2)
        lines.push(`64 bytes from ${ip}: icmp_seq=${i + 1} ttl=${ttl} time=${time} ms`)
        received++
      } else {
        lines.push(`From 10.128.0.1 icmp_seq=${i + 1} Destination Host Unreachable`)
      }
    }
    const loss = ((count - received) / count * 100).toFixed(0)
    lines.push('')
    lines.push(`--- ${target} ping statistics ---`)
    lines.push(`${count} packets transmitted, ${received} received, ${loss}% packet loss, time ${count * 1000}ms`)
    if (received > 0) {
      lines.push(`rtt min/avg/max/mdev = 0.30/1.25/2.50/0.45 ms`)
    }
    return lines.join('\n')
  }

  traceroute(target) {
    const ip = this._resolveIP(target)
    if (!ip) return `traceroute: ${target}: Name or service not known`
    const lines = [`traceroute to ${target} (${ip}), 30 hops max, 60 byte packets`]
    const hops = [
      { ip: '10.128.0.1', name: 'gateway.internal' },
      { ip: '209.85.254.14', name: 'isp-router-1' },
    ]
    if (!ip.startsWith('10.128.')) {
      hops.push({ ip: '72.14.232.76', name: 'edge-router' })
      hops.push({ ip: ip, name: target })
    } else {
      hops.push({ ip: ip, name: target })
    }
    hops.forEach((hop, i) => {
      const t1 = (Math.random() * 5 + 0.5).toFixed(3)
      const t2 = (Math.random() * 5 + 0.5).toFixed(3)
      const t3 = (Math.random() * 5 + 0.5).toFixed(3)
      lines.push(` ${i + 1}  ${hop.name} (${hop.ip})  ${t1} ms  ${t2} ms  ${t3} ms`)
    })
    return lines.join('\n')
  }

  dig(target, type = 'A') {
    const record = this.dnsRecords[target]
    const lines = [
      `; <<>> DiG 9.18.12-0ubuntu0.22.04.3-Ubuntu <<>> ${target} ${type}`,
      `;; global options: +cmd`,
      `;; Got answer:`,
      `;; ->>HEADER<<- opcode: QUERY, status: ${record ? 'NOERROR' : 'NXDOMAIN'}, id: ${Math.floor(Math.random() * 65535)}`,
      `;; flags: qr rd ra; QUERY: 1, ANSWER: ${record?.[type] ? 1 : 0}, AUTHORITY: 0, ADDITIONAL: 1`,
      ``,
      `;; QUESTION SECTION:`,
      `;${target}.\t\t\tIN\t${type}`,
      ``,
    ]
    if (record?.[type]) {
      lines.push(`;; ANSWER SECTION:`)
      lines.push(`${target}.\t\t300\tIN\t${type}\t${record[type]}`)
    }
    lines.push(``)
    lines.push(`;; Query time: ${Math.floor(Math.random() * 30 + 5)} msec`)
    lines.push(`;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)`)
    lines.push(`;; WHEN: ${new Date().toUTCString()}`)
    lines.push(`;; MSG SIZE  rcvd: ${Math.floor(Math.random() * 100 + 50)}`)
    return lines.join('\n')
  }

  nslookup(target) {
    const ip = this._resolveIP(target)
    const lines = ['Server:\t\t8.8.8.8', 'Address:\t8.8.8.8#53', '']
    if (ip) {
      lines.push(`Non-authoritative answer:`)
      lines.push(`Name:\t${target}`)
      lines.push(`Address: ${ip}`)
    } else {
      lines.push(`** server can't find ${target}: NXDOMAIN`)
    }
    return lines.join('\n')
  }

  curl(url, opts = {}) {
    let host = url.replace(/^https?:\/\//, '').split('/')[0].split(':')[0]
    const path = '/' + url.replace(/^https?:\/\//, '').split('/').slice(1).join('/')
    const ip = this._resolveIP(host)

    if (!ip) return `curl: (6) Could not resolve host: ${host}`

    const responses = {
      'metadata.google.internal': `{"instance":{"id":"1234567890","zone":"us-central1-a","machineType":"e2-medium","hostname":"gcp-lab"}}`,
      'localhost': '<html><head><title>GCP Lab Server</title></head><body><h1>Welcome to GCP Lab</h1></body></html>',
      'web-server': '<html><body><h1>Web Server Running</h1><p>Status: OK</p></body></html>',
    }

    if (opts.verbose) {
      const lines = [
        `*   Trying ${ip}:${url.startsWith('https') ? 443 : 80}...`,
        `* Connected to ${host} (${ip}) port ${url.startsWith('https') ? 443 : 80} (#0)`,
        `> ${opts.method || 'GET'} ${path} HTTP/1.1`,
        `> Host: ${host}`,
        `> User-Agent: curl/7.81.0`,
        `> Accept: */*`,
        `>`,
        `< HTTP/1.1 200 OK`,
        `< Content-Type: text/html`,
        `< Content-Length: ${(responses[host] || '{"status":"ok"}').length}`,
        `< Server: nginx/1.18.0`,
        `<`,
        responses[host] || '{"status":"ok"}',
        `* Connection #0 to host ${host} left intact`,
      ]
      return lines.join('\n')
    }

    if (opts.method === 'HEAD') {
      return `HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: ${(responses[host] || '').length}\nServer: nginx/1.18.0\nConnection: keep-alive`
    }

    return responses[host] || '{"status":"ok","message":"Service running"}'
  }

  ipAddr() {
    const lines = []
    const ifaces = this.localHost.interfaces
    let idx = 1
    for (const [name, iface] of Object.entries(ifaces)) {
      lines.push(`${idx}: ${name}: <${iface.state === 'UP' ? 'UP,LOWER_UP' : 'DOWN'}> mtu ${iface.mtu} qdisc noqueue state ${iface.state}`)
      lines.push(`    link/ether ${iface.mac} brd ff:ff:ff:ff:ff:ff`)
      lines.push(`    inet ${iface.ip}/${iface.prefix} brd ${iface.ip.split('.').slice(0, -1).join('.')}.255 scope global ${name === 'lo' ? 'host' : 'dynamic'} ${name}`)
      lines.push(`       valid_lft ${name === 'lo' ? 'forever' : '3600sec'} preferred_lft ${name === 'lo' ? 'forever' : '3600sec'}`)
      idx++
    }
    return lines.join('\n')
  }

  ipRoute() {
    return this.routes.map((r) => {
      if (r.destination === '0.0.0.0/0') return `default via ${r.gateway} dev ${r.iface} proto dhcp metric ${r.metric}`
      return `${r.destination} dev ${r.iface} proto kernel scope link src ${this.localHost.interfaces[r.iface]?.ip || ''} metric ${r.metric}`
    }).join('\n')
  }

  ipLink() {
    const lines = []
    let idx = 1
    for (const [name, iface] of Object.entries(this.localHost.interfaces)) {
      lines.push(`${idx}: ${name}: <${iface.state === 'UP' ? 'BROADCAST,MULTICAST,UP,LOWER_UP' : 'DOWN'}> mtu ${iface.mtu} qdisc noqueue state ${iface.state}`)
      lines.push(`    link/ether ${iface.mac} brd ff:ff:ff:ff:ff:ff`)
      idx++
    }
    return lines.join('\n')
  }

  ipNeigh() {
    return this.arpCache.map((e) => `${e.ip} dev ${e.iface} lladdr ${e.mac} ${e.state}`).join('\n')
  }

  ifconfig() {
    const lines = []
    for (const [name, iface] of Object.entries(this.localHost.interfaces)) {
      lines.push(`${name}: flags=${name === 'lo' ? '73<UP,LOOPBACK,RUNNING>' : '4163<UP,BROADCAST,RUNNING,MULTICAST>'}  mtu ${iface.mtu}`)
      lines.push(`        inet ${iface.ip}  netmask ${iface.mask}  ${name === 'lo' ? '' : `broadcast ${iface.ip.split('.').slice(0, -1).join('.')}.255`}`)
      lines.push(`        ether ${iface.mac}  txqueuelen ${name === 'lo' ? 0 : 1000}  (Ethernet)`)
      lines.push(`        RX packets ${Math.floor(Math.random() * 100000)}  bytes ${Math.floor(Math.random() * 100000000)} (${(Math.random() * 100).toFixed(1)} MB)`)
      lines.push(`        TX packets ${Math.floor(Math.random() * 100000)}  bytes ${Math.floor(Math.random() * 100000000)} (${(Math.random() * 100).toFixed(1)} MB)`)
      lines.push('')
    }
    return lines.join('\n')
  }

  netstat(listening = false) {
    const header = 'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name'
    const lines = [header]
    const ports = listening ? this.listeningPorts.filter((p) => p.state === 'LISTEN' || p.state === '') : this.listeningPorts
    ports.forEach((p) => {
      lines.push(`${p.proto.padEnd(6)} 0      0      ${p.local.padEnd(24)}${p.foreign.padEnd(24)}${(p.state || '').padEnd(12)}${p.pid}/${p.program}`)
    })
    return lines.join('\n')
  }

  ss(listening = false) {
    const header = 'State      Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process'
    const lines = [header]
    const ports = listening ? this.listeningPorts.filter((p) => p.state === 'LISTEN') : this.listeningPorts
    ports.forEach((p) => {
      lines.push(`${(p.state || 'UNCONN').padEnd(11)}0       0        ${p.local.padEnd(22)} ${p.foreign.padEnd(19)} users:(("${p.program}",pid=${p.pid},fd=3))`)
    })
    return lines.join('\n')
  }

  iptables(args) {
    if (args.includes('-L') || args.includes('--list')) {
      const numeric = args.includes('-n')
      const chains = { INPUT: [], FORWARD: [], OUTPUT: [] }
      this.firewallRules.forEach((r) => { if (chains[r.chain]) chains[r.chain].push(r) })
      const lines = []
      for (const [chain, rules] of Object.entries(chains)) {
        lines.push(`Chain ${chain} (policy ${chain === 'OUTPUT' ? 'ACCEPT' : 'ACCEPT'})`)
        lines.push(`target     prot opt source               destination`)
        rules.forEach((r) => {
          let extra = ''
          if (r.dport) extra += ` ${r.protocol} dpt:${r.dport}`
          if (r.extra) extra += ` ${r.extra}`
          lines.push(`${r.target.padEnd(11)}${r.protocol.padEnd(5)}--  ${r.source.padEnd(21)}${r.destination.padEnd(21)}${extra}`)
        })
        lines.push('')
      }
      return lines.join('\n')
    }

    if (args.includes('-A')) {
      const chain = args[args.indexOf('-A') + 1]
      const rule = { chain, target: 'ACCEPT', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' }
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-p') rule.protocol = args[++i]
        if (args[i] === '--dport') rule.dport = parseInt(args[++i])
        if (args[i] === '-s') rule.source = args[++i]
        if (args[i] === '-j') rule.target = args[++i]
      }
      // Insert before the last DROP rule
      const dropIdx = this.firewallRules.findIndex((r) => r.chain === chain && r.target === 'DROP')
      if (dropIdx >= 0) {
        this.firewallRules.splice(dropIdx, 0, rule)
      } else {
        this.firewallRules.push(rule)
      }
      return ''
    }

    if (args.includes('-D')) {
      const chain = args[args.indexOf('-D') + 1]
      const ruleNum = parseInt(args[args.indexOf('-D') + 2])
      if (!isNaN(ruleNum)) {
        const chainRules = this.firewallRules.filter((r) => r.chain === chain)
        if (ruleNum > 0 && ruleNum <= chainRules.length) {
          const rule = chainRules[ruleNum - 1]
          const idx = this.firewallRules.indexOf(rule)
          if (idx >= 0) this.firewallRules.splice(idx, 1)
        }
      }
      return ''
    }

    if (args.includes('-F')) {
      const chain = args[args.indexOf('-F') + 1]
      if (chain) {
        this.firewallRules = this.firewallRules.filter((r) => r.chain !== chain)
      } else {
        this.firewallRules = []
      }
      return ''
    }

    return 'Usage: iptables [-L|-A|-D|-F] [chain] [options]'
  }

  routeTable() {
    const lines = ['Kernel IP routing table', 'Destination     Gateway         Genmask         Flags Metric Ref    Use Iface']
    this.routes.forEach((r) => {
      const dst = r.destination === '0.0.0.0/0' ? '0.0.0.0' : r.destination.split('/')[0]
      const gw = r.gateway
      const mask = r.destination === '0.0.0.0/0' ? '0.0.0.0' : '255.255.0.0'
      lines.push(`${dst.padEnd(16)}${gw.padEnd(16)}${mask.padEnd(16)}${'UG'.padEnd(6)}${String(r.metric).padEnd(7)}0      0 ${r.iface}`)
    })
    return lines.join('\n')
  }

  hostLookup(target) {
    const ip = this._resolveIP(target)
    if (!ip) return `Host ${target} not found: 3(NXDOMAIN)`
    const record = this.dnsRecords[target]
    const lines = [`${target} has address ${ip}`]
    if (record?.MX) lines.push(`${target} mail is handled by ${record.MX}`)
    return lines.join('\n')
  }

  // Reset network to a specific lesson state
  resetToLesson(setupFn) {
    this.firewallRules = [
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: 'state RELATED,ESTABLISHED' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'tcp', source: '0.0.0.0/0', destination: '0.0.0.0/0', dport: 22, extra: '' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'tcp', source: '0.0.0.0/0', destination: '0.0.0.0/0', dport: 80, extra: '' },
      { chain: 'INPUT', target: 'ACCEPT', protocol: 'icmp', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'INPUT', target: 'DROP', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'FORWARD', target: 'DROP', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
      { chain: 'OUTPUT', target: 'ACCEPT', protocol: 'all', source: '0.0.0.0/0', destination: '0.0.0.0/0', extra: '' },
    ]
    if (setupFn) setupFn(this)
  }
}
