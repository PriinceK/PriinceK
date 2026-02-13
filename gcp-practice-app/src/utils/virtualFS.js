// Virtual Linux Filesystem — in-memory tree with permissions, ownership, timestamps

const DEFAULT_UID = 1000
const DEFAULT_GID = 1000
const ROOT_UID = 0
const ROOT_GID = 0

function now() { return Date.now() }

function parsePermOctal(octal) {
  const n = typeof octal === 'string' ? parseInt(octal, 8) : octal
  return {
    owner: { r: !!(n & 0o400), w: !!(n & 0o200), x: !!(n & 0o100) },
    group: { r: !!(n & 0o040), w: !!(n & 0o020), x: !!(n & 0o010) },
    other: { r: !!(n & 0o004), w: !!(n & 0o002), x: !!(n & 0o001) },
  }
}

function permToOctal(perm) {
  let n = 0
  if (perm.owner.r) n |= 0o400; if (perm.owner.w) n |= 0o200; if (perm.owner.x) n |= 0o100
  if (perm.group.r) n |= 0o040; if (perm.group.w) n |= 0o020; if (perm.group.x) n |= 0o010
  if (perm.other.r) n |= 0o004; if (perm.other.w) n |= 0o002; if (perm.other.x) n |= 0o001
  return n
}

function permToString(perm, isDir) {
  const f = (p) => (p.r ? 'r' : '-') + (p.w ? 'w' : '-') + (p.x ? 'x' : '-')
  return (isDir ? 'd' : '-') + f(perm.owner) + f(perm.group) + f(perm.other)
}

function makeNode(type, content = '', perm = 0o644, uid = DEFAULT_UID, gid = DEFAULT_GID) {
  const t = now()
  return {
    type, // 'file' | 'dir' | 'symlink'
    content: type === 'dir' ? {} : content,
    perm: parsePermOctal(perm),
    uid, gid,
    size: type === 'file' ? (content?.length || 0) : 4096,
    mtime: t, atime: t, ctime: t,
    links: type === 'dir' ? 2 : 1,
  }
}

export class VirtualFS {
  constructor() {
    this.root = makeNode('dir', '', 0o755, ROOT_UID, ROOT_GID)
    this.root.content = {}
    this.users = {
      0: { name: 'root', home: '/root', shell: '/bin/bash', groups: [0] },
      [DEFAULT_UID]: { name: 'clouduser', home: '/home/clouduser', shell: '/bin/bash', groups: [DEFAULT_GID] },
    }
    this.groups = {
      0: { name: 'root', members: ['root'] },
      [DEFAULT_GID]: { name: 'clouduser', members: ['clouduser'] },
    }
    this.currentUid = DEFAULT_UID
    this.cwd = '/home/clouduser'
    this.env = {
      HOME: '/home/clouduser',
      USER: 'clouduser',
      PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
      SHELL: '/bin/bash',
      PWD: '/home/clouduser',
      HOSTNAME: 'gcp-lab',
      TERM: 'xterm-256color',
      PS1: '\\u@\\h:\\w$ ',
      LANG: 'en_US.UTF-8',
    }
    this._buildDefaultFS()
  }

  _buildDefaultFS() {
    // Core directories
    const dirs = [
      '/bin', '/sbin', '/usr', '/usr/bin', '/usr/sbin', '/usr/local', '/usr/local/bin',
      '/etc', '/etc/nginx', '/etc/ssh', '/etc/systemd', '/etc/network',
      '/var', '/var/log', '/var/run', '/var/backups', '/var/www', '/var/www/html',
      '/tmp', '/opt', '/root', '/home', '/home/clouduser',
      '/home/clouduser/Documents', '/home/clouduser/projects',
      '/dev', '/proc', '/sys', '/mnt', '/srv',
    ]
    dirs.forEach((d) => this.mkdirp(d, 0o755, ROOT_UID, ROOT_GID))
    // Home dir owned by user
    this._chownRecursive('/home/clouduser', DEFAULT_UID, DEFAULT_GID)

    // System files
    const sysFiles = {
      '/etc/hostname': 'gcp-lab\n',
      '/etc/hosts': '127.0.0.1\tlocalhost\n127.0.1.1\tgcp-lab\n10.128.0.2\tweb-server\n10.128.0.3\tdb-server\n10.128.0.4\tapp-server\n',
      '/etc/resolv.conf': 'nameserver 8.8.8.8\nnameserver 8.8.4.4\nsearch c.my-project.internal google.internal\n',
      '/etc/os-release': 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nVERSION_ID="22.04"\nPRETTY_NAME="Ubuntu 22.04.3 LTS"\n',
      '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\nsyslog:x:104:110::/home/syslog:/usr/sbin/nologin\nclouduser:x:1000:1000:Cloud User:/home/clouduser:/bin/bash\nnginx:x:33:33:www-data:/var/www:/usr/sbin/nologin\n',
      '/etc/group': 'root:x:0:\nclouduser:x:1000:clouduser\nwww-data:x:33:nginx\nsudo:x:27:clouduser\ndocker:x:999:clouduser\n',
      '/etc/shadow': 'root:$6$rounds=4096$salt$hash:19000:0:99999:7:::\nclouduser:$6$rounds=4096$salt$hash:19000:0:99999:7:::\n',
      '/etc/fstab': '# /etc/fstab: static file system information\nUUID=abc-123\t/\text4\tdefaults\t0\t1\n/dev/sdb1\t/mnt/data\text4\tdefaults\t0\t2\n',
      '/etc/ssh/sshd_config': 'Port 22\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nMaxAuthTries 3\nX11Forwarding no\n',
      '/etc/nginx/nginx.conf': 'user nginx;\nworker_processes auto;\nerror_log /var/log/nginx/error.log;\npid /var/run/nginx.pid;\n\nevents {\n    worker_connections 1024;\n}\n\nhttp {\n    include /etc/nginx/mime.types;\n    default_type application/octet-stream;\n    access_log /var/log/nginx/access.log;\n\n    server {\n        listen 80;\n        server_name gcp-lab;\n        root /var/www/html;\n        index index.html;\n    }\n}\n',
      '/etc/network/interfaces': 'auto lo\niface lo inet loopback\n\nauto eth0\niface eth0 inet dhcp\n',
      '/etc/systemd/system.conf': '[Manager]\nDefaultTimeoutStartSec=90s\nDefaultTimeoutStopSec=90s\n',

      // Log files
      '/var/log/syslog': `Jan 15 08:00:01 gcp-lab CRON[1234]: (root) CMD (/usr/lib/apt/apt.systemd.daily)\nJan 15 08:01:12 gcp-lab systemd[1]: Starting nginx.service...\nJan 15 08:01:12 gcp-lab systemd[1]: Started nginx.service.\nJan 15 08:05:33 gcp-lab sshd[5678]: Accepted publickey for clouduser from 35.202.100.5\nJan 15 08:10:00 gcp-lab kernel: [UFW BLOCK] IN=eth0 OUT= SRC=192.168.1.100 DST=10.128.0.2 PROTO=TCP DPT=3306\nJan 15 09:00:01 gcp-lab CRON[2345]: (clouduser) CMD (/home/clouduser/scripts/backup.sh)\nJan 15 09:15:22 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42\nJan 15 09:15:23 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42\nJan 15 09:15:24 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42\nJan 15 10:30:00 gcp-lab systemd[1]: nginx.service: Main process exited, code=killed, status=9/KILL\nJan 15 10:30:00 gcp-lab systemd[1]: nginx.service: Failed with result 'signal'.\n`,
      '/var/log/auth.log': `Jan 15 08:05:33 gcp-lab sshd[5678]: Accepted publickey for clouduser from 35.202.100.5 port 52341 ssh2\nJan 15 09:15:22 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42 port 43210 ssh2\nJan 15 09:15:23 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42 port 43211 ssh2\nJan 15 09:15:24 gcp-lab sshd[6789]: Failed password for invalid user admin from 185.220.101.42 port 43212 ssh2\nJan 15 09:15:25 gcp-lab sshd[6789]: Connection closed by invalid user admin 185.220.101.42 port 43213\nJan 15 10:00:00 gcp-lab sudo: clouduser : TTY=pts/0 ; PWD=/home/clouduser ; USER=root ; COMMAND=/bin/systemctl restart nginx\n`,
      '/var/log/nginx/access.log': `10.128.0.1 - - [15/Jan/2025:08:01:15 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"\n10.128.0.1 - - [15/Jan/2025:08:02:30 +0000] "GET /api/health HTTP/1.1" 200 15 "-" "curl/7.81.0"\n10.128.0.5 - - [15/Jan/2025:08:10:01 +0000] "GET /images/logo.png HTTP/1.1" 404 162 "-" "Mozilla/5.0"\n10.128.0.1 - - [15/Jan/2025:09:00:00 +0000] "POST /api/data HTTP/1.1" 500 30 "-" "python-requests/2.28"\n192.168.1.100 - - [15/Jan/2025:09:30:00 +0000] "GET /admin HTTP/1.1" 403 162 "-" "Mozilla/5.0"\n`,
      '/var/log/nginx/error.log': `2025/01/15 08:10:01 [error] 1234#0: *3 open() "/var/www/html/images/logo.png" failed (2: No such file or directory)\n2025/01/15 09:00:00 [error] 1234#0: *5 upstream timed out (110: Connection timed out) while connecting to upstream\n`,

      // Web files
      '/var/www/html/index.html': '<!DOCTYPE html>\n<html>\n<head><title>GCP Lab Server</title></head>\n<body>\n<h1>Welcome to GCP Lab</h1>\n<p>Server is running.</p>\n</body>\n</html>\n',

      // User files
      '/home/clouduser/.bashrc': '# ~/.bashrc\nexport PS1="\\u@\\h:\\w$ "\nalias ll="ls -la"\nalias gs="git status"\nexport PATH=$PATH:/usr/local/go/bin\n',
      '/home/clouduser/.bash_history': 'ls -la\ncd /var/log\ntail -f syslog\nsudo systemctl status nginx\ndf -h\nfree -m\ntop\n',
      '/home/clouduser/notes.txt': 'GCP Study Notes\n===============\n- Compute Engine = IaaS VMs\n- Cloud Run = Serverless containers\n- GKE = Managed Kubernetes\n- Cloud SQL = Managed databases\n- Remember: always use least privilege IAM\n',

      // Backup files
      '/var/backups/nginx.conf.bak': 'user nginx;\nworker_processes auto;\nerror_log /var/log/nginx/error.log;\npid /var/run/nginx.pid;\n\nevents {\n    worker_connections 1024;\n}\n\nhttp {\n    server {\n        listen 80;\n        server_name gcp-lab;\n        root /var/www/html;\n    }\n}\n',

      // Proc pseudo-files
      '/proc/cpuinfo': 'processor\t: 0\nvendor_id\t: GenuineIntel\ncpu family\t: 6\nmodel name\t: Intel(R) Xeon(R) CPU @ 2.20GHz\ncpu MHz\t\t: 2200.000\ncache size\t: 56320 KB\ncpu cores\t: 2\n\nprocessor\t: 1\nvendor_id\t: GenuineIntel\ncpu family\t: 6\nmodel name\t: Intel(R) Xeon(R) CPU @ 2.20GHz\ncpu MHz\t\t: 2200.000\ncache size\t: 56320 KB\ncpu cores\t: 2\n',
      '/proc/meminfo': 'MemTotal:        4045572 kB\nMemFree:         1523456 kB\nMemAvailable:    2845312 kB\nBuffers:          234567 kB\nCached:          1087289 kB\nSwapTotal:       2097148 kB\nSwapFree:        2097148 kB\n',
      '/proc/version': 'Linux version 5.15.0-1049-gcp (buildd@lcy02-amd64-040) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0) #57-Ubuntu SMP\n',
      '/proc/uptime': '86400.52 172300.10\n',
      '/proc/loadavg': '0.15 0.10 0.08 1/234 5678\n',
    }

    Object.entries(sysFiles).forEach(([path, content]) => {
      const perm = path.startsWith('/etc/shadow') ? 0o640 : (path.startsWith('/proc') ? 0o444 : 0o644)
      this.writeFile(path, content, perm, ROOT_UID, ROOT_GID)
    })

    // User-owned files
    const userFiles = {
      '/home/clouduser/.bashrc': true,
      '/home/clouduser/.bash_history': true,
      '/home/clouduser/notes.txt': true,
    }
    Object.keys(userFiles).forEach((p) => {
      const node = this._resolve(p)
      if (node) { node.uid = DEFAULT_UID; node.gid = DEFAULT_GID }
    })

    // /tmp writable by all
    const tmp = this._resolve('/tmp')
    if (tmp) tmp.perm = parsePermOctal(0o1777)
  }

  _chownRecursive(path, uid, gid) {
    const node = this._resolve(path)
    if (!node) return
    node.uid = uid
    node.gid = gid
    if (node.type === 'dir') {
      Object.keys(node.content).forEach((child) => {
        this._chownRecursive(path === '/' ? `/${child}` : `${path}/${child}`, uid, gid)
      })
    }
  }

  // Resolve a path to a node
  _resolve(path) {
    const abs = this.resolvePath(path)
    if (abs === '/') return this.root
    const parts = abs.split('/').filter(Boolean)
    let current = this.root
    for (const part of parts) {
      if (!current || current.type !== 'dir') return null
      current = current.content[part]
    }
    return current || null
  }

  // Resolve a path to parent + basename
  _resolveParent(path) {
    const abs = this.resolvePath(path)
    const parts = abs.split('/').filter(Boolean)
    const basename = parts.pop()
    const parentPath = '/' + parts.join('/')
    const parent = this._resolve(parentPath || '/')
    return { parent, basename, parentPath: parentPath || '/' }
  }

  resolvePath(path) {
    if (!path) return this.cwd
    let abs = path.startsWith('/') ? path : `${this.cwd}/${path}`
    // Handle ~
    if (path.startsWith('~')) {
      abs = this.env.HOME + path.slice(1)
    }
    // Normalize
    const parts = abs.split('/').filter(Boolean)
    const resolved = []
    for (const part of parts) {
      if (part === '.') continue
      if (part === '..') { resolved.pop(); continue }
      resolved.push(part)
    }
    return '/' + resolved.join('/')
  }

  mkdirp(path, perm = 0o755, uid, gid) {
    const abs = this.resolvePath(path)
    const parts = abs.split('/').filter(Boolean)
    let current = this.root
    for (const part of parts) {
      if (!current.content[part]) {
        current.content[part] = makeNode('dir', '', perm, uid ?? this.currentUid, gid ?? DEFAULT_GID)
        current.content[part].content = {}
      }
      current = current.content[part]
    }
    return current
  }

  mkdir(path, perm = 0o755) {
    const { parent, basename } = this._resolveParent(path)
    if (!parent || parent.type !== 'dir') return { error: `cannot create directory '${path}': No such file or directory` }
    if (parent.content[basename]) return { error: `cannot create directory '${path}': File exists` }
    parent.content[basename] = makeNode('dir', '', perm, this.currentUid, DEFAULT_GID)
    parent.content[basename].content = {}
    return { ok: true }
  }

  writeFile(path, content, perm = 0o644, uid, gid) {
    const abs = this.resolvePath(path)
    const parts = abs.split('/').filter(Boolean)
    const filename = parts.pop()
    // Ensure parent dirs exist
    let current = this.root
    for (const part of parts) {
      if (!current.content[part]) {
        current.content[part] = makeNode('dir', '', 0o755, uid ?? ROOT_UID, gid ?? ROOT_GID)
        current.content[part].content = {}
      }
      current = current.content[part]
    }
    current.content[filename] = makeNode('file', content, perm, uid ?? this.currentUid, gid ?? DEFAULT_GID)
    return { ok: true }
  }

  readFile(path) {
    const node = this._resolve(path)
    if (!node) return { error: `${path}: No such file or directory` }
    if (node.type === 'dir') return { error: `${path}: Is a directory` }
    node.atime = now()
    return { content: node.content }
  }

  appendFile(path, content) {
    const node = this._resolve(path)
    if (!node) {
      return this.writeFile(path, content)
    }
    if (node.type !== 'file') return { error: `${path}: Is a directory` }
    node.content += content
    node.size = node.content.length
    node.mtime = now()
    return { ok: true }
  }

  rm(path, recursive = false) {
    const { parent, basename } = this._resolveParent(path)
    if (!parent || !parent.content[basename]) return { error: `cannot remove '${path}': No such file or directory` }
    const node = parent.content[basename]
    if (node.type === 'dir' && !recursive) {
      if (Object.keys(node.content).length > 0) return { error: `cannot remove '${path}': Directory not empty` }
    }
    delete parent.content[basename]
    return { ok: true }
  }

  cp(src, dst) {
    const srcNode = this._resolve(src)
    if (!srcNode) return { error: `cannot stat '${src}': No such file or directory` }
    if (srcNode.type === 'dir') return { error: `omitting directory '${src}'` }
    const dstNode = this._resolve(dst)
    if (dstNode && dstNode.type === 'dir') {
      const basename = src.split('/').filter(Boolean).pop()
      dstNode.content[basename] = { ...JSON.parse(JSON.stringify(srcNode)), mtime: now() }
    } else {
      const { parent, basename } = this._resolveParent(dst)
      if (!parent) return { error: `cannot create regular file '${dst}': No such file or directory` }
      parent.content[basename] = { ...JSON.parse(JSON.stringify(srcNode)), mtime: now() }
    }
    return { ok: true }
  }

  mv(src, dst) {
    const result = this.cp(src, dst)
    if (result.error) return result
    return this.rm(src)
  }

  ls(path, opts = {}) {
    const abs = this.resolvePath(path || '.')
    const node = this._resolve(abs)
    if (!node) return { error: `cannot access '${path || '.'}': No such file or directory` }
    if (node.type !== 'dir') {
      return { entries: [this._lsEntry(path.split('/').pop() || path, node, opts)] }
    }
    let entries = Object.entries(node.content)
    if (!opts.all) entries = entries.filter(([name]) => !name.startsWith('.'))
    entries.sort((a, b) => a[0].localeCompare(b[0]))
    if (opts.all) {
      entries.unshift(['.', node], ['..', node])
    }
    return { entries: entries.map(([name, n]) => this._lsEntry(name, n, opts)) }
  }

  _lsEntry(name, node, opts) {
    const entry = { name, type: node.type, size: node.size || 0 }
    if (opts.long) {
      const user = this.users[node.uid]?.name || node.uid
      const group = this.groups[node.gid]?.name || node.gid
      const date = new Date(node.mtime)
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const dateStr = `${months[date.getMonth()]} ${String(date.getDate()).padStart(2)} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
      entry.perms = permToString(node.perm, node.type === 'dir')
      entry.links = node.links || 1
      entry.user = user
      entry.group = group
      entry.dateStr = dateStr
      entry.sizeStr = String(node.type === 'dir' ? 4096 : (node.content?.length || 0))
    }
    return entry
  }

  stat(path) {
    const node = this._resolve(path)
    if (!node) return null
    return {
      type: node.type,
      size: node.type === 'file' ? (node.content?.length || 0) : 4096,
      perm: node.perm,
      permOctal: permToOctal(node.perm),
      uid: node.uid,
      gid: node.gid,
      user: this.users[node.uid]?.name || String(node.uid),
      group: this.groups[node.gid]?.name || String(node.gid),
      mtime: node.mtime,
      atime: node.atime,
      ctime: node.ctime,
    }
  }

  chmod(path, mode) {
    const node = this._resolve(path)
    if (!node) return { error: `cannot access '${path}': No such file or directory` }
    node.perm = parsePermOctal(mode)
    node.ctime = now()
    return { ok: true }
  }

  chown(path, owner, group) {
    const node = this._resolve(path)
    if (!node) return { error: `cannot access '${path}': No such file or directory` }
    if (this.currentUid !== ROOT_UID) return { error: `chown: changing ownership: Operation not permitted` }
    // Find uid from name
    const userEntry = Object.entries(this.users).find(([, u]) => u.name === owner)
    if (owner && userEntry) node.uid = parseInt(userEntry[0])
    if (group) {
      const groupEntry = Object.entries(this.groups).find(([, g]) => g.name === group)
      if (groupEntry) node.gid = parseInt(groupEntry[0])
    }
    node.ctime = now()
    return { ok: true }
  }

  find(startPath, opts = {}) {
    const results = []
    const abs = this.resolvePath(startPath)
    const _walk = (path, node) => {
      let match = true
      if (opts.name) {
        const name = path.split('/').pop()
        const pattern = opts.name.replace(/\*/g, '.*').replace(/\?/g, '.')
        match = new RegExp(`^${pattern}$`).test(name)
      }
      if (opts.type) {
        if (opts.type === 'f' && node.type !== 'file') match = false
        if (opts.type === 'd' && node.type !== 'dir') match = false
      }
      if (match) results.push(path)
      if (node.type === 'dir') {
        Object.entries(node.content).forEach(([name, child]) => {
          _walk(path === '/' ? `/${name}` : `${path}/${name}`, child)
        })
      }
    }
    const node = this._resolve(abs)
    if (node) _walk(abs, node)
    return results
  }

  du(path) {
    const abs = this.resolvePath(path || '.')
    const node = this._resolve(abs)
    if (!node) return { error: `cannot access '${path}': No such file or directory` }
    let total = 0
    const _calc = (n) => {
      if (n.type === 'file') { total += n.content?.length || 0 }
      if (n.type === 'dir') { Object.values(n.content).forEach(_calc) }
    }
    _calc(node)
    return { bytes: total, blocks: Math.ceil(total / 1024) }
  }

  exists(path) {
    return this._resolve(path) !== null
  }

  isDir(path) {
    const node = this._resolve(path)
    return node?.type === 'dir'
  }

  // Get display prompt
  getPrompt() {
    const user = this.users[this.currentUid]?.name || 'user'
    let displayPath = this.cwd
    if (displayPath.startsWith(this.env.HOME)) {
      displayPath = '~' + displayPath.slice(this.env.HOME.length)
    }
    return `${user}@${this.env.HOSTNAME}:${displayPath}$ `
  }

  // Reset to a specific lesson state
  resetToLesson(setupFn) {
    this.root = makeNode('dir', '', 0o755, ROOT_UID, ROOT_GID)
    this.root.content = {}
    this.currentUid = DEFAULT_UID
    this.cwd = '/home/clouduser'
    this.env.PWD = this.cwd
    this._buildDefaultFS()
    if (setupFn) setupFn(this)
  }

  // Serialize for state checks
  toJSON() {
    return {
      cwd: this.cwd,
      currentUid: this.currentUid,
      env: { ...this.env },
    }
  }
}

export { permToString, permToOctal, parsePermOctal, DEFAULT_UID, ROOT_UID }
