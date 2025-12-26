"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

type LogEntry = {
  type: "command" | "output"
  content: string | string[]
}

const COMMANDS = {
  HELP: "help", LS: "ls", CAT: "cat", 
  WHOAMI: "whoami", CLEAR: "clear", PROJECTS: "projects"
}

const FILES = {
  "about.txt": "I am a Full Stack Developer passionate about bridging the gap between design and technology. I build immersive, performance-driven applications.",
  "work.txt": "Selected Work:\n- Project 01: Interactive Web Design\n- Project 02: AI Dashboard\n- Project 03: E-commerce Platform\n- Project 04: portfolio-v1",
  "contact.txt": "Email: hello@tanish.dev\nGitHub: github.com/tanish-24\nLinkedIn: linkedin.com/in/tanish-jagtap"
}

export default function RetroTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "output", content: "TANISH OS v1.0.0 (release 2025)" },
    { type: "output", content: 'Type "help" to see available commands.' }
  ])
  const [input, setInput] = useState("")
  const [isBooting, setIsBooting] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  const handleCommand = (cmd: string) => {
    const fullCmd = cmd.trim().toLowerCase()
    const [name, ...args] = fullCmd.split(" ")
    let output: string | string[] = ""

    switch (name) {
      case COMMANDS.HELP:
        output = ["Available commands:", "  help     - Show this menu", "  ls       - List virtual filesystem contents", "  cat [f]  - Read file contents", "  whoami   - Display user info", "  projects - View latest works", "  clear    - Flush terminal history"]
        break
      case COMMANDS.LS: output = Object.keys(FILES).join("  ")
        break
      case COMMANDS.CAT:
        const fileName = args[0]
        if (fileName && FILES[fileName as keyof typeof FILES]) {
          output = FILES[fileName as keyof typeof FILES].split("\n")
        } else {
          output = `cat: ${fileName || "missing file"}: No such file or directory`
        }
        break
      case COMMANDS.WHOAMI:
        output = ["NAME: Tanish Jagtap", "ROLE: Full Stack Developer / Creative Technologist", "LOCATION: Pune, India", "STATUS: Seeking innovative challenges"]
        break
      case COMMANDS.PROJECTS: output = FILES["work.txt"].split("\n")
        break
      case COMMANDS.CLEAR: setLogs([]); return
      case "": return
      default: output = `Command not found: ${name}. Type "help" for a list of commands.`
    }

    setLogs((prev) => [...prev, { type: "command", content: cmd }, { type: "output", content: output }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* BIG WINDOWS/MAC STYLE TERMINAL */}
      <motion.div 
        initial={{ rotateX: 8, rotateY: -3, y: 30, opacity: 0, scale: 0.9 }}
        animate={{ rotateX: 3, rotateY: 0, y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-[85%] max-w-4xl max-h-[700px] aspect-[16/10] md:aspect-[5/3] flex flex-col relative
                   terminal-electric-border terminal-back-glow terminal-3d-border shadow-3xl rounded-3xl overflow-hidden
                   border-4 border-[#4ade80]/40"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* TOP BAR - Like Mac/Windows terminal */}
        <div className="h-8 bg-[#1a1a1a/80] backdrop-blur-md border-b border-[#4ade80]/30 flex items-center px-4 z-40">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500/70 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500/70 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500/70 rounded-full animate-pulse"></div>
          </div>
          <div className="ml-3 text-xs font-mono text-[#4ade80]/60 tracking-wider flex-1 truncate">tanish-os-terminal</div>
        </div>

        {/* CRT Effects */}
        <div className="absolute inset-0 pointer-events-none crt-overlay z-10 opacity-60" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.06)_0%,transparent_100%)] z-10" />
        <div className="absolute inset-0 pointer-events-none animate-scanline bg-[linear-gradient(transparent_0%,rgba(74,222,128,0.03)_50%,transparent_100%)] z-10 h-1 w-full" />

        {/* Floating User Image - Bigger */}
        <div className="absolute top-12 right-6 z-20 pointer-events-none opacity-40 hover:opacity-90 transition-opacity duration-500">
          <img 
            src="/terminal-image.png" 
            alt="Terminal Visual" 
            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover grayscale sepia hue-rotate-[90deg] brightness-125 rounded-xl shadow-lg"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>

        {/* Terminal Content - More space */}
        <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 scroll-smooth relative z-0 p-8 md:p-12 lg:p-16 selection:bg-[#4ade80]/80 selection:text-black/90">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="leading-relaxed whitespace-pre-wrap text-base md:text-lg lg:text-xl">
                {log.type === "command" ? (
                  <div className="flex gap-4">
                    <span className="text-[#4ade80]/60 shrink-0 font-mono text-sm md:text-base">tanish@os:~$</span>
                    <span className="font-bold text-glow-green text-base md:text-lg">{log.content}</span>
                  </div>
                ) : (
                  <div className="pl-14 md:pl-20 lg:pl-24">
                    {Array.isArray(log.content) 
                      ? log.content.map((line, j) => <div key={j} className="opacity-90 font-mono">{line}</div>)
                      : <div className="opacity-90 font-mono">{log.content}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!isBooting && (
            <form onSubmit={handleSubmit} className="flex gap-4 items-end pt-4 pb-2 px-2">
              <span className="text-[#4ade80]/60 shrink-0 font-mono text-sm md:text-base">tanish@os:~$</span>
              <input
                ref={inputRef}
                autoFocus
                className="bg-transparent border-none outline-none text-[#4ade80] flex-1 font-bold caret-[#4ade80] text-base md:text-lg lg:text-xl min-h-[1.5em]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              <span className="terminal-cursor w-[0.8em] h-[1.4em]" />
            </form>
          )}
        </div>

        {/* Status Bar - Bigger + More info */}
        <div className="relative z-40 px-6 py-3 border-t border-[#4ade80]/30 flex justify-between items-center text-sm md:text-base uppercase tracking-widest opacity-70 font-bold bg-gradient-to-r from-[#0a0a0a/90] to-[#050505/90] backdrop-blur-md">
          <span className="font-mono">TANISH OS v1.2</span>
          <div className="hidden md:flex gap-6 text-xs">
            <span>MEM: 42% | CPU: 15% | GPU: 22%</span>
          </div>
          <span className="font-mono text-glow-green">STATUS: LIVE</span>
        </div>
      </motion.div>
    </div>
  )
}
