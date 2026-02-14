// Shell Interpreter — parses commands, handles pipes, redirection, and 35+ Linux commands

import { permToString } from './virtualFS'

export class ShellInterpreter {
  constructor(fs, network) {
    this.fs = fs
    this.network = network
    this.history = []
    this.aliases = { ll: 'ls -la', la: 'ls -a', l: 'ls -CF' }
    this.processes = this._defaultProcesses()
  }

  _defaultProcesses() {
    return [
      { pid: 1, user: 'root', cpu: 0.0, mem: 0.3, command: '/sbin/init' },
      { pid: 234, user: 'root', cpu: 0.0, mem: 0.1, command: '/usr/lib/systemd/systemd-journald' },
      { pid: 456, user: 'root', cpu: 0.0, mem: 0.2, command: '/usr/sbin/sshd -D' },
      { pid: 789, user: 'root', cpu: 0.1, mem: 0.4, command: 'nginx: master process /usr/sbin/nginx' },
      { pid: 790, user: 'nginx', cpu: 0.0, mem: 0.2, command: 'nginx: worker process' },
      { pid: 791, user: 'nginx', cpu: 0.0, mem: 0.2, command: 'nginx: worker process' },
      { pid: 1001, user: 'root', cpu: 0.0, mem: 0.1, command: '/usr/sbin/cron -f' },
      { pid: 1500, user: 'clouduser', cpu: 0.0, mem: 0.1, command: '-bash' },
      { pid: 2000, user: 'root', cpu: 0.2, mem: 1.5, command: '/usr/bin/google_guest_agent' },
      { pid: 2100, user: 'root', cpu: 0.0, mem: 0.3, command: '/usr/bin/google_osconfig_agent' },
    ]
  }

  execute(input) {
    const trimmed = input.trim()
    if (!trimmed) return ''
    this.history.push(trimmed)

    // Handle aliases
    let resolved = trimmed
    const firstWord = trimmed.split(/\s+/)[0]
    if (this.aliases[firstWord]) {
      resolved = this.aliases[firstWord] + trimmed.slice(firstWord.length)
    }

    // Handle pipes
    if (resolved.includes('|')) {
      return this._executePipeline(resolved)
    }

    // Handle output redirection
    if (resolved.includes('>>') || resolved.includes('>')) {
      return this._executeRedirect(resolved)
    }

    return this._executeSingle(resolved)
  }

  _executePipeline(input) {
    const commands = input.split('|').map((c) => c.trim())
    let output = ''
    for (const cmd of commands) {
      const prevOutput = output
      output = this._executeSingle(cmd, prevOutput)
    }
    return output
  }

  _executeRedirect(input) {
    const append = input.includes('>>')
    const parts = input.split(append ? '>>' : '>')
    const cmd = parts[0].trim()
    const file = parts[1]?.trim()
    if (!file) return 'bash: syntax error near unexpected token `newline\''

    const output = this._executeSingle(cmd)
    if (append) {
      this.fs.appendFile(file, output + '\n')
    } else {
      this.fs.writeFile(file, output + '\n')
    }
    return ''
  }

  _executeSingle(input, pipeInput = null) {
    const tokens = this._tokenize(input)
    if (tokens.length === 0) return ''

    const cmd = tokens[0]
    const args = tokens.slice(1)

    // Variable expansion
    const expandedArgs = args.map((a) => {
      if (a.startsWith('$')) {
        const varName = a.slice(1)
        return this.fs.env[varName] || ''
      }
      return a
    })

    const commands = {
      // Navigation
      cd: () => this._cd(expandedArgs),
      pwd: () => this.fs.cwd,
      ls: () => this._ls(expandedArgs),

      // File operations
      cat: () => this._cat(expandedArgs, pipeInput),
      touch: () => this._touch(expandedArgs),
      mkdir: () => this._mkdir(expandedArgs),
      rm: () => this._rm(expandedArgs),
      rmdir: () => this._rmdir(expandedArgs),
      cp: () => this._cp(expandedArgs),
      mv: () => this._mv(expandedArgs),
      ln: () => this._ln(expandedArgs),

      // Text processing
      echo: () => this._echo(expandedArgs),
      head: () => this._head(expandedArgs, pipeInput),
      tail: () => this._tail(expandedArgs, pipeInput),
      grep: () => this._grep(expandedArgs, pipeInput),
      wc: () => this._wc(expandedArgs, pipeInput),
      sort: () => this._sort(expandedArgs, pipeInput),
      uniq: () => this._uniq(expandedArgs, pipeInput),
      cut: () => this._cut(expandedArgs, pipeInput),
      tr: () => this._tr(expandedArgs, pipeInput),
      sed: () => this._sed(expandedArgs, pipeInput),
      awk: () => this._awk(expandedArgs, pipeInput),
      tee: () => this._tee(expandedArgs, pipeInput),

      // File info
      file: () => this._file(expandedArgs),
      stat: () => this._stat(expandedArgs),
      find: () => this._find(expandedArgs),
      which: () => this._which(expandedArgs),
      du: () => this._du(expandedArgs),
      df: () => this._df(),
      diff: () => this._diff(expandedArgs),

      // Permissions
      chmod: () => this._chmod(expandedArgs),
      chown: () => this._chown(expandedArgs),
      id: () => this._id(),
      whoami: () => this.fs.users[this.fs.currentUid]?.name || 'unknown',
      groups: () => this._groups(),
      su: () => this._su(expandedArgs),
      sudo: () => this._sudo(expandedArgs),

      // System info
      uname: () => this._uname(expandedArgs),
      hostname: () => this.fs.env.HOSTNAME,
      uptime: () => ' 10:30:00 up 1 day,  0:00,  1 user,  load average: 0.15, 0.10, 0.08',
      free: () => this._free(expandedArgs),
      top: () => this._top(),
      ps: () => this._ps(expandedArgs),
      kill: () => this._kill(expandedArgs),
      date: () => new Date().toString(),
      cal: () => this._cal(),

      // Environment
      env: () => Object.entries(this.fs.env).map(([k, v]) => `${k}=${v}`).join('\n'),
      export: () => this._export(expandedArgs),
      set: () => Object.entries(this.fs.env).map(([k, v]) => `${k}=${v}`).join('\n'),
      printenv: () => this._printenv(expandedArgs),
      alias: () => this._alias(expandedArgs),
      unalias: () => { delete this.aliases[expandedArgs[0]]; return '' },

      // Network commands
      ping: () => this._ping(expandedArgs),
      traceroute: () => this._traceroute(expandedArgs),
      dig: () => this._dig(expandedArgs),
      nslookup: () => this._nslookup(expandedArgs),
      curl: () => this._curl(expandedArgs),
      wget: () => this._wget(expandedArgs),
      ip: () => this._ip(expandedArgs),
      ifconfig: () => this._ifconfig(),
      netstat: () => this._netstat(expandedArgs),
      ss: () => this._ss(expandedArgs),
      iptables: () => this._iptables(expandedArgs),
      route: () => this._route(),
      host: () => this._host(expandedArgs),

      // Service management
      systemctl: () => this._systemctl(expandedArgs),
      service: () => this._service(expandedArgs),
      journalctl: () => this._journalctl(expandedArgs),

      // Misc
      clear: () => '\x1b[CLEAR]',
      history: () => this.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'),
      man: () => this._man(expandedArgs),
      help: () => 'Type "man <command>" for help on a specific command.\nAvailable: ls, cd, cat, grep, find, chmod, chown, ps, top, ping, ip, netstat, iptables, systemctl, and more.',
      exit: () => 'logout',
      true: () => '',
      false: () => '',
      basename: () => expandedArgs[0]?.split('/').pop() || '',
      dirname: () => { const p = expandedArgs[0]?.split('/'); p?.pop(); return p?.join('/') || '/' },
      realpath: () => this.fs.resolvePath(expandedArgs[0] || '.'),
      tree: () => this._tree(expandedArgs),
      xargs: () => this._xargs(expandedArgs, pipeInput),
    }

    if (commands[cmd]) {
      try { return commands[cmd]() }
      catch (e) { return `${cmd}: error: ${e.message}` }
    }

    // Check if it's a variable assignment
    if (input.includes('=') && !input.includes(' ')) {
      const [key, ...vals] = input.split('=')
      this.fs.env[key] = vals.join('=')
      return ''
    }

    return `${cmd}: command not found`
  }

  _tokenize(input) {
    const tokens = []
    let current = ''
    let inSingle = false
    let inDouble = false
    for (let i = 0; i < input.length; i++) {
      const ch = input[i]
      if (ch === "'" && !inDouble) { inSingle = !inSingle; continue }
      if (ch === '"' && !inSingle) { inDouble = !inDouble; continue }
      if (ch === ' ' && !inSingle && !inDouble) {
        if (current) { tokens.push(current); current = '' }
        continue
      }
      current += ch
    }
    if (current) tokens.push(current)
    return tokens
  }

  // --- COMMAND IMPLEMENTATIONS ---

  _cd(args) {
    const target = args[0] || this.fs.env.HOME
    const resolved = this.fs.resolvePath(target)
    const node = this.fs._resolve(resolved)
    if (!node) return `bash: cd: ${target}: No such file or directory`
    if (node.type !== 'dir') return `bash: cd: ${target}: Not a directory`
    this.fs.cwd = resolved
    this.fs.env.PWD = resolved
    return ''
  }

  _ls(args) {
    const opts = { long: false, all: false, human: false, recursive: false }
    const paths = []
    for (const a of args) {
      if (a.startsWith('-')) {
        if (a.includes('l')) opts.long = true
        if (a.includes('a')) opts.all = true
        if (a.includes('h')) opts.human = true
        if (a.includes('R')) opts.recursive = true
      } else {
        paths.push(a)
      }
    }
    if (paths.length === 0) paths.push('.')
    const results = []
    for (const p of paths) {
      const result = this.fs.ls(p, opts)
      if (result.error) { results.push(result.error); continue }
      if (paths.length > 1) results.push(`${p}:`)
      if (opts.long) {
        let total = 0
        result.entries.forEach((e) => { total += Math.ceil((e.sizeStr ? parseInt(e.sizeStr) : 0) / 1024) })
        results.push(`total ${total}`)
        result.entries.forEach((e) => {
          const size = opts.human ? this._humanSize(parseInt(e.sizeStr || 0)) : (e.sizeStr || '0').padStart(8)
          results.push(`${e.perms} ${String(e.links).padStart(2)} ${e.user.padEnd(10)} ${e.group.padEnd(10)} ${size} ${e.dateStr} ${e.name}`)
        })
      } else {
        results.push(result.entries.map((e) => e.name).join('  '))
      }
    }
    return results.join('\n')
  }

  _humanSize(bytes) {
    if (bytes < 1024) return `${bytes}`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}K`
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)}M`
    return `${(bytes / 1073741824).toFixed(1)}G`
  }

  _cat(args, pipeInput) {
    if (pipeInput !== null) return pipeInput
    if (args.length === 0) return ''
    const opts = { number: false }
    const files = []
    args.forEach((a) => {
      if (a === '-n') opts.number = true
      else files.push(a)
    })
    const results = []
    for (const f of files) {
      const r = this.fs.readFile(f)
      if (r.error) { results.push(`cat: ${r.error}`); continue }
      if (opts.number) {
        results.push(r.content.split('\n').map((line, i) => `     ${i + 1}\t${line}`).join('\n'))
      } else {
        results.push(r.content)
      }
    }
    return results.join('\n').replace(/\n$/, '')
  }

  _touch(args) {
    for (const a of args) {
      if (!this.fs.exists(a)) {
        this.fs.writeFile(a, '')
      } else {
        const node = this.fs._resolve(a)
        if (node) { node.mtime = Date.now(); node.atime = Date.now() }
      }
    }
    return ''
  }

  _mkdir(args) {
    let parents = false
    const dirs = []
    args.forEach((a) => { if (a === '-p') parents = true; else dirs.push(a) })
    const errors = []
    for (const d of dirs) {
      if (parents) { this.fs.mkdirp(d) }
      else {
        const r = this.fs.mkdir(d)
        if (r.error) errors.push(`mkdir: ${r.error}`)
      }
    }
    return errors.join('\n')
  }

  _rm(args) {
    let recursive = false, force = false
    const files = []
    args.forEach((a) => {
      if (a.startsWith('-')) {
        if (a.includes('r') || a.includes('R')) recursive = true
        if (a.includes('f')) force = true
      } else files.push(a)
    })
    const errors = []
    for (const f of files) {
      const r = this.fs.rm(f, recursive)
      if (r.error && !force) errors.push(`rm: ${r.error}`)
    }
    return errors.join('\n')
  }

  _rmdir(args) {
    const errors = []
    for (const d of args) {
      const node = this.fs._resolve(d)
      if (!node) { errors.push(`rmdir: failed to remove '${d}': No such file or directory`); continue }
      if (node.type !== 'dir') { errors.push(`rmdir: failed to remove '${d}': Not a directory`); continue }
      if (Object.keys(node.content).length > 0) { errors.push(`rmdir: failed to remove '${d}': Directory not empty`); continue }
      this.fs.rm(d)
    }
    return errors.join('\n')
  }

  _cp(args) {
    let recursive = false
    const paths = []
    args.forEach((a) => { if (a === '-r' || a === '-R') recursive = true; else paths.push(a) })
    if (paths.length < 2) return 'cp: missing destination file operand'
    const dst = paths.pop()
    const errors = []
    for (const src of paths) {
      const r = this.fs.cp(src, dst)
      if (r.error) errors.push(`cp: ${r.error}`)
    }
    return errors.join('\n')
  }

  _mv(args) {
    if (args.length < 2) return 'mv: missing destination file operand'
    const dst = args[args.length - 1]
    const sources = args.slice(0, -1)
    const errors = []
    for (const src of sources) {
      const r = this.fs.mv(src, dst)
      if (r.error) errors.push(`mv: ${r.error}`)
    }
    return errors.join('\n')
  }

  _ln(args) { return 'ln: symbolic links simulated' }

  _echo(args) {
    let noNewline = false
    const parts = []
    for (const a of args) {
      if (a === '-n') { noNewline = true; continue }
      if (a === '-e') continue
      parts.push(a)
    }
    return parts.join(' ')
  }

  _head(args, pipeInput) {
    let n = 10
    const files = []
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n' && args[i + 1]) { n = parseInt(args[++i]); continue }
      if (args[i].startsWith('-') && !isNaN(args[i].slice(1))) { n = parseInt(args[i].slice(1)); continue }
      files.push(args[i])
    }
    const text = pipeInput !== null ? pipeInput : (files[0] ? (this.fs.readFile(files[0]).content || '') : '')
    return text.split('\n').slice(0, n).join('\n')
  }

  _tail(args, pipeInput) {
    let n = 10
    const files = []
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n' && args[i + 1]) { n = parseInt(args[++i]); continue }
      if (args[i].startsWith('-') && !isNaN(args[i].slice(1))) { n = parseInt(args[i].slice(1)); continue }
      if (args[i] === '-f') continue // Simulated follow
      files.push(args[i])
    }
    const text = pipeInput !== null ? pipeInput : (files[0] ? (this.fs.readFile(files[0]).content || '') : '')
    const lines = text.split('\n').filter((l) => l)
    return lines.slice(-n).join('\n')
  }

  _grep(args, pipeInput) {
    let caseInsensitive = false, count = false, lineNum = false, invert = false, recursive = false
    let pattern = null
    const files = []
    for (let i = 0; i < args.length; i++) {
      const a = args[i]
      if (a.startsWith('-') && !pattern) {
        if (a.includes('i')) caseInsensitive = true
        if (a.includes('c')) count = true
        if (a.includes('n')) lineNum = true
        if (a.includes('v')) invert = true
        if (a.includes('r') || a.includes('R')) recursive = true
        continue
      }
      if (!pattern) { pattern = a; continue }
      files.push(a)
    }
    if (!pattern) return 'Usage: grep [OPTIONS] PATTERN [FILE...]'

    const regex = new RegExp(pattern, caseInsensitive ? 'i' : '')
    const processText = (text, filename) => {
      const lines = text.split('\n')
      const matches = []
      lines.forEach((line, idx) => {
        const match = regex.test(line)
        if (invert ? !match : match) {
          let prefix = ''
          if (files.length > 1 || recursive) prefix = `${filename}:`
          if (lineNum) prefix += `${idx + 1}:`
          matches.push(prefix + line)
        }
      })
      if (count) return [`${files.length > 1 ? filename + ':' : ''}${matches.length}`]
      return matches
    }

    if (pipeInput !== null) {
      return processText(pipeInput, '(stdin)').join('\n')
    }

    if (files.length === 0) return 'Usage: grep PATTERN FILE'

    const results = []
    for (const f of files) {
      if (recursive && this.fs.isDir(f)) {
        const found = this.fs.find(f, { type: 'f' })
        found.forEach((fp) => {
          const r = this.fs.readFile(fp)
          if (!r.error) results.push(...processText(r.content, fp))
        })
      } else {
        const r = this.fs.readFile(f)
        if (r.error) { results.push(`grep: ${r.error}`); continue }
        results.push(...processText(r.content, f))
      }
    }
    return results.join('\n')
  }

  _wc(args, pipeInput) {
    let showLines = false, showWords = false, showBytes = false
    const files = []
    args.forEach((a) => {
      if (a.startsWith('-')) {
        if (a.includes('l')) showLines = true
        if (a.includes('w')) showWords = true
        if (a.includes('c')) showBytes = true
      } else files.push(a)
    })
    if (!showLines && !showWords && !showBytes) { showLines = true; showWords = true; showBytes = true }

    const countText = (text, name) => {
      const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0)
      const words = text.split(/\s+/).filter(Boolean).length
      const bytes = text.length
      const parts = []
      if (showLines) parts.push(String(lines).padStart(7))
      if (showWords) parts.push(String(words).padStart(7))
      if (showBytes) parts.push(String(bytes).padStart(7))
      if (name) parts.push(` ${name}`)
      return parts.join(' ')
    }

    if (pipeInput !== null) return countText(pipeInput, '')
    if (files.length === 0) return ''
    return files.map((f) => {
      const r = this.fs.readFile(f)
      if (r.error) return `wc: ${r.error}`
      return countText(r.content, f)
    }).join('\n')
  }

  _sort(args, pipeInput) {
    let reverse = false, numeric = false, unique = false
    const files = []
    args.forEach((a) => {
      if (a === '-r') reverse = true
      else if (a === '-n') numeric = true
      else if (a === '-u') unique = true
      else files.push(a)
    })
    let text = pipeInput !== null ? pipeInput : (files[0] ? (this.fs.readFile(files[0]).content || '') : '')
    let lines = text.split('\n').filter(Boolean)
    if (numeric) lines.sort((a, b) => parseFloat(a) - parseFloat(b))
    else lines.sort()
    if (reverse) lines.reverse()
    if (unique) lines = [...new Set(lines)]
    return lines.join('\n')
  }

  _uniq(args, pipeInput) {
    let count = false
    const files = []
    args.forEach((a) => { if (a === '-c') count = true; else files.push(a) })
    const text = pipeInput !== null ? pipeInput : (files[0] ? (this.fs.readFile(files[0]).content || '') : '')
    const lines = text.split('\n')
    const result = []
    let prev = null, cnt = 0
    for (const line of lines) {
      if (line === prev) { cnt++ }
      else {
        if (prev !== null) result.push(count ? `${String(cnt).padStart(7)} ${prev}` : prev)
        prev = line; cnt = 1
      }
    }
    if (prev !== null) result.push(count ? `${String(cnt).padStart(7)} ${prev}` : prev)
    return result.join('\n')
  }

  _cut(args, pipeInput) {
    let delimiter = '\t', fields = null
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-d' && args[i + 1]) delimiter = args[++i]
      if (args[i] === '-f' && args[i + 1]) fields = args[++i]
      if (args[i].startsWith('-d')) delimiter = args[i].slice(2)
      if (args[i].startsWith('-f')) fields = args[i].slice(2)
    }
    if (!fields) return 'cut: you must specify a list of fields'
    const fieldNums = fields.split(',').map((f) => parseInt(f) - 1)
    const text = pipeInput || ''
    return text.split('\n').map((line) => {
      const parts = line.split(delimiter)
      return fieldNums.map((f) => parts[f] || '').join(delimiter)
    }).join('\n')
  }

  _tr(args, pipeInput) {
    if (args.length < 2 || pipeInput === null) return 'Usage: tr SET1 SET2'
    const set1 = args[0], set2 = args[1]
    let text = pipeInput
    for (let i = 0; i < set1.length && i < set2.length; i++) {
      text = text.split(set1[i]).join(set2[i])
    }
    return text
  }

  _sed(args, pipeInput) {
    if (args.length === 0) return 'Usage: sed SCRIPT [FILE]'
    const script = args[0]
    const match = script.match(/^s\/(.+?)\/(.*)\/([gi]*)$/)
    if (!match) return `sed: -e expression #1, char 0: unknown command`
    const [, pattern, replacement, flags] = match
    const regex = new RegExp(pattern, flags.includes('g') ? 'g' : '')
    const text = pipeInput !== null ? pipeInput : (args[1] ? (this.fs.readFile(args[1]).content || '') : '')
    return text.split('\n').map((line) => line.replace(regex, replacement)).join('\n')
  }

  _awk(args, pipeInput) {
    if (args.length === 0) return 'Usage: awk PROGRAM [FILE]'
    const program = args[0]
    // Simple awk: print columns
    const printMatch = program.match(/^\{print\s+(.+)\}$/)
    if (printMatch) {
      const cols = printMatch[1].split(/,\s*/)
      const text = pipeInput !== null ? pipeInput : (args[1] ? (this.fs.readFile(args[1]).content || '') : '')
      return text.split('\n').filter(Boolean).map((line) => {
        const fields = line.split(/\s+/)
        return cols.map((c) => {
          if (c === '$0') return line
          const n = parseInt(c.replace('$', ''))
          return fields[n - 1] || ''
        }).join(' ')
      }).join('\n')
    }
    return 'awk: only simple {print $N} supported in this environment'
  }

  _tee(args, pipeInput) {
    let append = false
    const files = []
    args.forEach((a) => { if (a === '-a') append = true; else files.push(a) })
    const text = pipeInput || ''
    files.forEach((f) => {
      if (append) this.fs.appendFile(f, text + '\n')
      else this.fs.writeFile(f, text + '\n')
    })
    return text
  }

  _file(args) {
    return args.map((f) => {
      const s = this.fs.stat(f)
      if (!s) return `${f}: cannot open (No such file or directory)`
      if (s.type === 'dir') return `${f}: directory`
      const content = this.fs.readFile(f).content || ''
      if (content.startsWith('#!/')) return `${f}: script, ASCII text executable`
      if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) return `${f}: HTML document, ASCII text`
      return `${f}: ASCII text`
    }).join('\n')
  }

  _stat(args) {
    return args.map((f) => {
      const s = this.fs.stat(f)
      if (!s) return `stat: cannot stat '${f}': No such file or directory`
      return `  File: ${f}\n  Size: ${s.size}\tBlocks: ${Math.ceil(s.size / 512)}\t${s.type === 'dir' ? 'directory' : 'regular file'}\nAccess: (${s.permOctal.toString(8).padStart(4, '0')}/${permToString(s.perm, s.type === 'dir')})\tUid: (${s.uid}/${s.user})\tGid: (${s.gid}/${s.group})\nModify: ${new Date(s.mtime).toISOString()}`
    }).join('\n')
  }

  _find(args) {
    let path = '.', name = null, type = null
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name' && args[i + 1]) { name = args[++i]; continue }
      if (args[i] === '-type' && args[i + 1]) { type = args[++i]; continue }
      if (!args[i].startsWith('-')) path = args[i]
    }
    return this.fs.find(path, { name, type }).join('\n')
  }

  _which(args) {
    const bins = ['ls', 'cat', 'grep', 'find', 'chmod', 'chown', 'mkdir', 'rm', 'cp', 'mv', 'ps', 'top', 'ping', 'curl', 'ssh', 'systemctl', 'nginx', 'python3', 'node', 'git', 'docker', 'gcloud']
    return args.map((a) => bins.includes(a) ? `/usr/bin/${a}` : `${a} not found`).join('\n')
  }

  _du(args) {
    let human = false
    const paths = []
    args.forEach((a) => { if (a === '-h' || a === '-sh') human = true; else if (!a.startsWith('-')) paths.push(a) })
    if (paths.length === 0) paths.push('.')
    return paths.map((p) => {
      const r = this.fs.du(p)
      if (r.error) return `du: ${r.error}`
      const size = human ? this._humanSize(r.bytes) : String(r.blocks)
      return `${size}\t${p}`
    }).join('\n')
  }

  _df() {
    return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       20511312 4523456  14924420  24% /
tmpfs            2022784       0   2022784   0% /dev/shm
/dev/sdb1       10255636 1048576   8682832  11% /mnt/data
tmpfs             404560     876    403684   1% /run`
  }

  _diff(args) {
    if (args.length < 2) return 'diff: missing operand'
    const a = this.fs.readFile(args[0])
    const b = this.fs.readFile(args[1])
    if (a.error) return `diff: ${a.error}`
    if (b.error) return `diff: ${b.error}`
    if (a.content === b.content) return ''
    const la = a.content.split('\n'), lb = b.content.split('\n')
    const results = []
    const max = Math.max(la.length, lb.length)
    for (let i = 0; i < max; i++) {
      if (la[i] !== lb[i]) {
        if (la[i] && lb[i]) results.push(`${i + 1}c${i + 1}\n< ${la[i]}\n---\n> ${lb[i]}`)
        else if (la[i]) results.push(`${i + 1}d${i}\n< ${la[i]}`)
        else results.push(`${i}a${i + 1}\n> ${lb[i]}`)
      }
    }
    return results.join('\n')
  }

  _chmod(args) {
    if (args.length < 2) return 'chmod: missing operand'
    const mode = parseInt(args[0], 8)
    if (isNaN(mode)) return `chmod: invalid mode: '${args[0]}'`
    const errors = []
    for (let i = 1; i < args.length; i++) {
      const r = this.fs.chmod(args[i], args[0])
      if (r.error) errors.push(`chmod: ${r.error}`)
    }
    return errors.join('\n')
  }

  _chown(args) {
    if (args.length < 2) return 'chown: missing operand'
    const [ownerGroup, ...files] = args
    const [owner, group] = ownerGroup.split(':')
    const errors = []
    for (const f of files) {
      const r = this.fs.chown(f, owner, group)
      if (r.error) errors.push(r.error)
    }
    return errors.join('\n')
  }

  _id() {
    const uid = this.fs.currentUid
    const user = this.fs.users[uid]
    if (!user) return `uid=${uid}`
    const gids = user.groups || [uid]
    const groupStr = gids.map((g) => `${g}(${this.fs.groups[g]?.name || g})`).join(',')
    return `uid=${uid}(${user.name}) gid=${gids[0]}(${this.fs.groups[gids[0]]?.name || gids[0]}) groups=${groupStr}`
  }

  _groups() {
    const user = this.fs.users[this.fs.currentUid]
    if (!user) return 'unknown'
    return (user.groups || []).map((g) => this.fs.groups[g]?.name || g).join(' ')
  }

  _su(args) {
    const target = args[args.length - 1] || 'root'
    const userEntry = Object.entries(this.fs.users).find(([, u]) => u.name === target)
    if (!userEntry) return `su: user ${target} does not exist`
    this.fs.currentUid = parseInt(userEntry[0])
    this.fs.env.USER = target
    this.fs.env.HOME = this.fs.users[this.fs.currentUid].home
    return ''
  }

  _sudo(args) {
    if (args.length === 0) return 'usage: sudo command'
    // Temporarily become root
    const prevUid = this.fs.currentUid
    this.fs.currentUid = 0
    const result = this._executeSingle(args.join(' '))
    this.fs.currentUid = prevUid
    return result
  }

  _uname(args) {
    const info = { s: 'Linux', n: 'gcp-lab', r: '5.15.0-1049-gcp', v: '#57-Ubuntu SMP', m: 'x86_64', o: 'GNU/Linux' }
    if (args.includes('-a')) return `${info.s} ${info.n} ${info.r} ${info.v} ${info.m} ${info.o}`
    if (args.includes('-r')) return info.r
    if (args.includes('-n')) return info.n
    if (args.includes('-m')) return info.m
    return info.s
  }

  _free(args) {
    const human = args.includes('-h') || args.includes('-m')
    if (human) {
      return `               total        used        free      shared  buff/cache   available
Mem:           3.9Gi       1.2Gi       1.5Gi        12Mi       1.3Gi       2.7Gi
Swap:          2.0Gi          0B       2.0Gi`
    }
    return `               total        used        free      shared  buff/cache   available
Mem:         4045572     1198216     1523456       12340     1323900     2845312
Swap:        2097148           0     2097148`
  }

  _top() {
    const lines = [
      `top - 10:30:00 up 1 day,  0:00,  1 user,  load average: 0.15, 0.10, 0.08`,
      `Tasks: ${this.processes.length} total,   1 running, ${this.processes.length - 1} sleeping,   0 stopped,   0 zombie`,
      `%Cpu(s):  0.5 us,  0.2 sy,  0.0 ni, 99.2 id,  0.0 wa,  0.0 hi,  0.1 si`,
      `MiB Mem :   3950.4 total,   1487.8 free,   1170.1 used,   1292.5 buff/cache`,
      `MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   2778.6 avail Mem`,
      ``,
      `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND`,
    ]
    this.processes.forEach((p) => {
      lines.push(`${String(p.pid).padStart(5)} ${p.user.padEnd(9)} 20   0   ${String(Math.floor(Math.random() * 500000)).padStart(7)} ${String(Math.floor(Math.random() * 50000)).padStart(6)} ${String(Math.floor(Math.random() * 20000)).padStart(6)} S ${String(p.cpu.toFixed(1)).padStart(5)} ${String(p.mem.toFixed(1)).padStart(5)}   0:0${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 99)} ${p.command.split(' ')[0].split('/').pop()}`)
    })
    return lines.join('\n')
  }

  _ps(args) {
    const aux = args.includes('aux') || args.includes('-aux') || (args.includes('-e') && args.includes('-f'))
    if (aux) {
      const lines = ['USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND']
      this.processes.forEach((p) => {
        lines.push(`${p.user.padEnd(8)} ${String(p.pid).padStart(5)} ${String(p.cpu.toFixed(1)).padStart(4)} ${String(p.mem.toFixed(1)).padStart(4)}  ${String(Math.floor(Math.random() * 500000)).padStart(5)} ${String(Math.floor(Math.random() * 50000)).padStart(5)} ?        S${p.pid === 1500 ? 's' : ' '}   Jan15   0:0${Math.floor(Math.random() * 9)} ${p.command}`)
      })
      return lines.join('\n')
    }
    const lines = ['  PID TTY          TIME CMD']
    this.processes.filter((p) => p.user === (this.fs.users[this.fs.currentUid]?.name || 'clouduser')).forEach((p) => {
      lines.push(`${String(p.pid).padStart(5)} pts/0    00:00:0${Math.floor(Math.random() * 9)} ${p.command.split(' ')[0].split('/').pop()}`)
    })
    return lines.join('\n')
  }

  _kill(args) {
    let signal = 'TERM'
    const pids = []
    args.forEach((a) => {
      if (a.startsWith('-')) signal = a.slice(1)
      else pids.push(parseInt(a))
    })
    for (const pid of pids) {
      const idx = this.processes.findIndex((p) => p.pid === pid)
      if (idx === -1) return `kill: (${pid}) - No such process`
      if (signal === '9' || signal === 'KILL') {
        this.processes.splice(idx, 1)
      }
    }
    return ''
  }

  _cal() {
    const d = new Date()
    const month = d.toLocaleString('default', { month: 'long' })
    const year = d.getFullYear()
    return `     ${month} ${year}\nSu Mo Tu We Th Fr Sa\n                1  2\n 3  4  5  6  7  8  9\n10 11 12 13 14 15 16\n17 18 19 20 21 22 23\n24 25 26 27 28 29 30`
  }

  _export(args) {
    for (const a of args) {
      const [key, ...vals] = a.split('=')
      if (vals.length > 0) this.fs.env[key] = vals.join('=')
    }
    return ''
  }

  _printenv(args) {
    if (args.length === 0) return Object.entries(this.fs.env).map(([k, v]) => `${k}=${v}`).join('\n')
    return args.map((a) => this.fs.env[a] || '').join('\n')
  }

  _alias(args) {
    if (args.length === 0) return Object.entries(this.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n')
    for (const a of args) {
      const [key, ...vals] = a.split('=')
      this.aliases[key] = vals.join('=').replace(/^['"]|['"]$/g, '')
    }
    return ''
  }

  _tree(args) {
    const path = args.find((a) => !a.startsWith('-')) || '.'
    let maxDepth = Infinity
    args.forEach((a, i) => { if (a === '-L' && args[i + 1]) maxDepth = parseInt(args[i + 1]) })
    const result = []
    const _walk = (p, prefix, depth) => {
      if (depth > maxDepth) return
      const node = this.fs._resolve(p)
      if (!node || node.type !== 'dir') return
      const entries = Object.entries(node.content).filter(([n]) => !n.startsWith('.')).sort()
      entries.forEach(([name, child], idx) => {
        const isLast = idx === entries.length - 1
        result.push(`${prefix}${isLast ? '└── ' : '├── '}${name}`)
        if (child.type === 'dir') {
          _walk(p === '/' ? `/${name}` : `${p}/${name}`, prefix + (isLast ? '    ' : '│   '), depth + 1)
        }
      })
    }
    result.push(path)
    _walk(this.fs.resolvePath(path), '', 1)
    return result.join('\n')
  }

  _xargs(args, pipeInput) {
    if (!pipeInput || args.length === 0) return ''
    const cmd = args.join(' ')
    const items = pipeInput.split('\n').filter(Boolean)
    return items.map((item) => this._executeSingle(`${cmd} ${item}`)).join('\n')
  }

  // --- NETWORK COMMANDS ---

  _ping(args) {
    let count = 4
    let target = null
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-c' && args[i + 1]) { count = parseInt(args[++i]); continue }
      target = args[i]
    }
    if (!target) return 'Usage: ping [-c count] destination'
    if (!this.network) return `ping: ${target}: Temporary failure in name resolution`
    return this.network.ping(target, count)
  }

  _traceroute(args) {
    const target = args.find((a) => !a.startsWith('-'))
    if (!target) return 'Usage: traceroute host'
    if (!this.network) return 'traceroute: network not available'
    return this.network.traceroute(target)
  }

  _dig(args) {
    const target = args.find((a) => !a.startsWith('-') && !a.startsWith('@') && !['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT', 'SOA', 'ANY'].includes(a))
    const type = args.find((a) => ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT', 'SOA', 'ANY'].includes(a)) || 'A'
    if (!target) return 'Usage: dig [@server] name [type]'
    if (!this.network) return ';; connection timed out; no servers could be reached'
    return this.network.dig(target, type)
  }

  _nslookup(args) {
    const target = args[0]
    if (!target) return 'Usage: nslookup name'
    if (!this.network) return `** server can't find ${target}: SERVFAIL`
    return this.network.nslookup(target)
  }

  _curl(args) {
    let url = null, silent = false, verbose = false, method = 'GET', data = null, headers = []
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-s' || args[i] === '--silent') { silent = true; continue }
      if (args[i] === '-v' || args[i] === '--verbose') { verbose = true; continue }
      if (args[i] === '-X' && args[i + 1]) { method = args[++i]; continue }
      if (args[i] === '-d' && args[i + 1]) { data = args[++i]; method = method === 'GET' ? 'POST' : method; continue }
      if (args[i] === '-H' && args[i + 1]) { headers.push(args[++i]); continue }
      if (args[i] === '-I') { method = 'HEAD'; continue }
      if (args[i] === '-o') { i++; continue } // skip output file
      if (!args[i].startsWith('-')) url = args[i]
    }
    if (!url) return 'curl: no URL specified'
    if (!this.network) return `curl: (6) Could not resolve host`
    return this.network.curl(url, { method, data, headers, verbose, silent })
  }

  _wget(args) {
    const url = args.find((a) => !a.startsWith('-'))
    if (!url) return 'wget: missing URL'
    return `--${new Date().toISOString()}--  ${url}\nResolving host... done.\nConnecting to host... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 612 [text/html]\nSaving to: 'index.html'\nindex.html          100%[===================>]     612  --.-KB/s    in 0s\n${new Date().toISOString()} (4.56 MB/s) - 'index.html' saved [612/612]`
  }

  _ip(args) {
    if (!this.network) return 'ip: network not configured'
    const sub = args[0]
    if (sub === 'addr' || sub === 'a') return this.network.ipAddr()
    if (sub === 'route' || sub === 'r') return this.network.ipRoute()
    if (sub === 'link') return this.network.ipLink()
    if (sub === 'neigh') return this.network.ipNeigh()
    return 'Usage: ip {addr|route|link|neigh}'
  }

  _ifconfig() {
    if (!this.network) return 'ifconfig: network not configured'
    return this.network.ifconfig()
  }

  _netstat(args) {
    if (!this.network) return 'netstat: network not configured'
    const tulnp = args.some((a) => a.includes('t') && a.includes('l'))
    return this.network.netstat(tulnp)
  }

  _ss(args) {
    if (!this.network) return 'ss: network not configured'
    const tulnp = args.some((a) => a.includes('t') && a.includes('l'))
    return this.network.ss(tulnp)
  }

  _iptables(args) {
    if (!this.network) return 'iptables: network not configured'
    if (this.fs.currentUid !== 0) return 'iptables: Permission denied (you must be root)'
    return this.network.iptables(args)
  }

  _route() {
    if (!this.network) return 'route: network not configured'
    return this.network.routeTable()
  }

  _host(args) {
    const target = args[0]
    if (!target || !this.network) return 'Usage: host name'
    return this.network.hostLookup(target)
  }

  _systemctl(args) {
    const action = args[0]
    const service = args[1]
    const services = {
      nginx: { active: true, enabled: true, pid: 789, desc: 'A high performance web server' },
      sshd: { active: true, enabled: true, pid: 456, desc: 'OpenSSH server daemon' },
      cron: { active: true, enabled: true, pid: 1001, desc: 'Regular background program processing daemon' },
      docker: { active: false, enabled: false, pid: null, desc: 'Docker Application Container Engine' },
      'google-guest-agent': { active: true, enabled: true, pid: 2000, desc: 'Google Compute Engine Guest Agent' },
      ufw: { active: false, enabled: false, pid: null, desc: 'Uncomplicated firewall' },
      mysql: { active: false, enabled: false, pid: null, desc: 'MySQL Community Server' },
    }

    if (action === 'list-units' || !action) {
      return Object.entries(services).map(([name, s]) =>
        `${name.padEnd(30)} ${(s.active ? 'loaded' : 'loaded').padEnd(8)} ${(s.active ? 'active' : 'inactive').padEnd(10)} ${s.active ? 'running' : 'dead'}`
      ).join('\n')
    }
    if (!service) return `Usage: systemctl ${action} SERVICE`
    const svc = services[service.replace('.service', '')]
    if (!svc) return `Unit ${service} could not be found.`

    if (action === 'status') {
      return `● ${service}\n   Loaded: loaded (/lib/systemd/system/${service}; ${svc.enabled ? 'enabled' : 'disabled'})\n   Active: ${svc.active ? 'active (running)' : 'inactive (dead)'} since Mon 2025-01-15 08:01:12 UTC\n ${svc.pid ? ` Main PID: ${svc.pid} (${service.replace('.service', '')})` : ''}\n    Tasks: ${svc.active ? Math.floor(Math.random() * 5 + 1) : 0}\n   Memory: ${svc.active ? (Math.random() * 50).toFixed(1) + 'M' : '0B'}\n      CPU: ${svc.active ? (Math.random() * 2).toFixed(3) + 's' : '0'}\n   CGroup: /system.slice/${service}`
    }
    if (action === 'start') { svc.active = true; return '' }
    if (action === 'stop') { svc.active = false; return '' }
    if (action === 'restart') { return '' }
    if (action === 'enable') { svc.enabled = true; return `Created symlink /etc/systemd/system/multi-user.target.wants/${service} → /lib/systemd/system/${service}.` }
    if (action === 'disable') { svc.enabled = false; return `Removed /etc/systemd/system/multi-user.target.wants/${service}.` }
    if (action === 'is-active') return svc.active ? 'active' : 'inactive'
    if (action === 'is-enabled') return svc.enabled ? 'enabled' : 'disabled'
    return `Unknown operation '${action}'.`
  }

  _service(args) {
    return this._systemctl([args[1], args[0]])
  }

  _journalctl(args) {
    let unit = null, lines = 20
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-u' && args[i + 1]) unit = args[++i]
      if (args[i] === '-n' && args[i + 1]) lines = parseInt(args[++i])
    }
    const log = this.fs.readFile('/var/log/syslog')
    if (log.error) return 'No journal data available'
    let entries = log.content.split('\n').filter(Boolean)
    if (unit) entries = entries.filter((l) => l.toLowerCase().includes(unit.toLowerCase()))
    return entries.slice(-lines).join('\n')
  }

  _man(args) {
    const topic = args[0]
    if (!topic) return 'What manual page do you want?\nFor example, try \'man man\'.'
    const manPages = {
      ls: 'LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nOPTIONS\n       -a     do not ignore entries starting with .\n       -l     use a long listing format\n       -h     with -l, print human readable sizes\n       -R     list subdirectories recursively\n       -t     sort by modification time',
      cd: 'CD(1)\n\nNAME\n       cd - change directory\n\nSYNOPSIS\n       cd [dir]\n\nDESCRIPTION\n       Change the current directory to dir. If dir is not given, HOME is used.\n       .. refers to the parent directory, . refers to the current directory.',
      cat: 'CAT(1)\n\nNAME\n       cat - concatenate files and print on stdout\n\nSYNOPSIS\n       cat [OPTION]... [FILE]...\n\nOPTIONS\n       -n     number all output lines',
      grep: 'GREP(1)\n\nNAME\n       grep - print lines matching a pattern\n\nSYNOPSIS\n       grep [OPTIONS] PATTERN [FILE...]\n\nOPTIONS\n       -i     ignore case\n       -c     count matching lines\n       -n     show line numbers\n       -v     invert match\n       -r     recursive search',
      find: 'FIND(1)\n\nNAME\n       find - search for files in a directory hierarchy\n\nSYNOPSIS\n       find [path] [expression]\n\nOPTIONS\n       -name pattern    search by filename\n       -type f|d        search by type (file or directory)',
      chmod: 'CHMOD(1)\n\nNAME\n       chmod - change file mode bits\n\nSYNOPSIS\n       chmod MODE FILE...\n\nDESCRIPTION\n       chmod changes the permissions of files. MODE is an octal number.\n       4=read, 2=write, 1=execute. Three digits: owner, group, other.\n       Example: chmod 755 script.sh (rwxr-xr-x)',
      chown: 'CHOWN(1)\n\nNAME\n       chown - change file owner and group\n\nSYNOPSIS\n       chown OWNER[:GROUP] FILE...\n\nDESCRIPTION\n       Change the owner and/or group of each FILE to OWNER and/or GROUP.\n       Only root can change file ownership.',
      ping: 'PING(8)\n\nNAME\n       ping - send ICMP ECHO_REQUEST to network hosts\n\nSYNOPSIS\n       ping [-c count] destination\n\nDESCRIPTION\n       ping sends ICMP echo requests to a host and reports round-trip time.',
      ip: 'IP(8)\n\nNAME\n       ip - show / manipulate routing, network devices, interfaces\n\nSYNOPSIS\n       ip [ addr | route | link | neigh ]\n\nCOMMANDS\n       ip addr     - display IP addresses\n       ip route    - display routing table\n       ip link     - display network interfaces\n       ip neigh    - display ARP/neighbor cache',
      netstat: 'NETSTAT(8)\n\nNAME\n       netstat - print network connections, routing tables, interface statistics\n\nSYNOPSIS\n       netstat [OPTIONS]\n\nOPTIONS\n       -t     TCP connections\n       -u     UDP connections\n       -l     listening sockets\n       -n     numeric addresses\n       -p     show PID/program name',
      iptables: 'IPTABLES(8)\n\nNAME\n       iptables - administration tool for IPv4 packet filtering\n\nSYNOPSIS\n       iptables -L [-n]              List rules\n       iptables -A INPUT ...         Append rule\n       iptables -D INPUT rulenum     Delete rule\n       iptables -F                   Flush all rules\n\nTARGETS\n       ACCEPT, DROP, REJECT\n\nMATCH OPTIONS\n       -p tcp|udp|icmp    Protocol\n       --dport PORT       Destination port\n       -s SOURCE          Source address\n       -j TARGET          Jump to target',
      systemctl: 'SYSTEMCTL(1)\n\nNAME\n       systemctl - control the systemd system and service manager\n\nSYNOPSIS\n       systemctl COMMAND [SERVICE]\n\nCOMMANDS\n       start      Start a service\n       stop       Stop a service\n       restart    Restart a service\n       status     Show service status\n       enable     Enable a service at boot\n       disable    Disable a service at boot\n       list-units List all units',
      ps: 'PS(1)\n\nNAME\n       ps - report process status\n\nSYNOPSIS\n       ps [OPTIONS]\n\nOPTIONS\n       aux    Show all processes for all users\n       -ef    Show full-format listing of all processes',
      curl: 'CURL(1)\n\nNAME\n       curl - transfer data from or to a server\n\nSYNOPSIS\n       curl [OPTIONS] URL\n\nOPTIONS\n       -s     Silent mode\n       -v     Verbose output\n       -X METHOD    Request method (GET, POST, PUT, DELETE)\n       -H HEADER    Add header\n       -d DATA      Send data (POST)\n       -I           Show headers only',
    }
    return manPages[topic] || `No manual entry for ${topic}`
  }
}
