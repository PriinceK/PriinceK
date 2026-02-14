import { useState, useRef, useEffect, useCallback } from 'react'

export default function Terminal({ shell, onCommand, className = '' }) {
  const [lines, setLines] = useState([
    { type: 'system', text: 'Welcome to GCP Linux Lab — Interactive Terminal' },
    { type: 'system', text: 'Type commands below. Use "help" for available commands, "man <cmd>" for details.' },
    { type: 'system', text: '' },
  ])
  const [input, setInput] = useState('')
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState([])
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const [tabSuggestion, setTabSuggestion] = useState(null)

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => { scrollToBottom() }, [lines, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const cmd = input.trim()
    const prompt = shell.fs.getPrompt()

    // Add the command line to output
    setLines((prev) => [...prev, { type: 'prompt', text: prompt, cmd }])

    if (cmd) {
      setCmdHistory((prev) => [...prev, cmd])
      setHistoryIdx(-1)

      // Execute command
      const output = shell.execute(cmd)

      if (output === '\x1b[CLEAR]') {
        setLines([])
      } else if (output) {
        setLines((prev) => [...prev, { type: 'output', text: output }])
      }

      // Notify parent of command execution
      if (onCommand) onCommand(cmd, output)
    }

    setInput('')
    setTabSuggestion(null)
  }

  function handleKeyDown(e) {
    // Up arrow — history
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(newIdx)
      setInput(cmdHistory[newIdx] || '')
    }

    // Down arrow — history
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx === -1) return
      const newIdx = historyIdx + 1
      if (newIdx >= cmdHistory.length) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        setHistoryIdx(newIdx)
        setInput(cmdHistory[newIdx] || '')
      }
    }

    // Tab — autocomplete
    if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.split(' ')
      const current = parts[parts.length - 1]
      if (!current) return

      // Autocomplete paths
      const lastSlash = current.lastIndexOf('/')
      let dir = lastSlash >= 0 ? current.slice(0, lastSlash + 1) : '.'
      const prefix = lastSlash >= 0 ? current.slice(lastSlash + 1) : current

      if (parts.length === 1) {
        // Command autocomplete
        const cmds = ['ls', 'cd', 'cat', 'grep', 'find', 'chmod', 'chown', 'mkdir', 'rm', 'cp', 'mv',
          'touch', 'echo', 'head', 'tail', 'wc', 'sort', 'uniq', 'cut', 'sed', 'awk',
          'ping', 'traceroute', 'dig', 'nslookup', 'curl', 'ip', 'netstat', 'ss', 'iptables',
          'ps', 'top', 'kill', 'systemctl', 'service', 'df', 'du', 'free', 'uname',
          'whoami', 'id', 'sudo', 'man', 'history', 'clear', 'tree', 'stat', 'file', 'diff']
        const matches = cmds.filter((c) => c.startsWith(prefix))
        if (matches.length === 1) {
          setInput(matches[0] + ' ')
        } else if (matches.length > 1) {
          setTabSuggestion(matches.join('  '))
        }
        return
      }

      // File/directory autocomplete
      try {
        const listing = shell.fs.ls(dir === '.' ? undefined : dir, { all: true })
        if (listing.entries) {
          const matches = listing.entries.filter((e) => e.name.startsWith(prefix) && e.name !== '.' && e.name !== '..')
          if (matches.length === 1) {
            const completion = matches[0].name
            const suffix = matches[0].type === 'dir' ? '/' : ' '
            parts[parts.length - 1] = (lastSlash >= 0 ? current.slice(0, lastSlash + 1) : '') + completion + suffix
            setInput(parts.join(' '))
            setTabSuggestion(null)
          } else if (matches.length > 1) {
            setTabSuggestion(matches.map((m) => m.name).join('  '))
          }
        }
      } catch {}
    }

    // Ctrl+C — cancel
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      const prompt = shell.fs.getPrompt()
      setLines((prev) => [...prev, { type: 'prompt', text: prompt, cmd: input + '^C' }])
      setInput('')
    }

    // Ctrl+L — clear
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  function handleContainerClick() {
    inputRef.current?.focus()
  }

  // Write system message
  function writeSystem(text) {
    setLines((prev) => [...prev, { type: 'system', text }])
  }

  // Expose writeSystem via ref trick
  useEffect(() => {
    if (shell) {
      shell._terminalWrite = writeSystem
    }
  }, [shell])

  return (
    <div
      className={`flex flex-col bg-[#0a0e1a] rounded-xl border border-nebula-border overflow-hidden ${className}`}
      style={{ fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace' }}
    >
      {/* Title bar */}
      <div className="h-8 flex items-center px-3 gap-2 border-b border-nebula-border shrink-0"
        style={{ background: 'rgba(12, 16, 36, 0.95)' }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-nebula-dim ml-2">
          {shell?.fs?.users[shell.fs.currentUid]?.name || 'clouduser'}@{shell?.fs?.env.HOSTNAME || 'gcp-lab'}: {shell?.fs?.cwd || '~'}
        </span>
      </div>

      {/* Terminal output */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 min-h-0 cursor-text"
        onClick={handleContainerClick}
        style={{ fontSize: '13px', lineHeight: '1.6' }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.type === 'system' && (
              <span className="text-neon-cyan/70">{line.text}</span>
            )}
            {line.type === 'prompt' && (
              <span>
                <span className="text-neon-emerald">{line.text}</span>
                <span className="text-nebula-text">{line.cmd}</span>
              </span>
            )}
            {line.type === 'output' && (
              <span className="text-nebula-text/90">{line.text}</span>
            )}
            {line.type === 'error' && (
              <span className="text-neon-rose">{line.text}</span>
            )}
            {line.type === 'success' && (
              <span className="text-neon-emerald">{line.text}</span>
            )}
          </div>
        ))}

        {/* Tab suggestions */}
        {tabSuggestion && (
          <div className="text-neon-cyan/50 whitespace-pre-wrap mb-1">{tabSuggestion}</div>
        )}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-start">
          <span className="text-neon-emerald shrink-0">{shell?.fs?.getPrompt() || '$ '}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setTabSuggestion(null) }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 outline-none text-nebula-text caret-neon-cyan"
            style={{ fontSize: '13px', fontFamily: 'inherit', lineHeight: '1.6' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}
