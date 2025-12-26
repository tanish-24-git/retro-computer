"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

type LogEntry = {
  type: "command" | "output"
  content: string | string[]
}

const COMMANDS = {
  HELP: "help",
  LS: "ls",
  CAT: "cat",
  WHOAMI: "whoami",
  CLEAR: "clear",
  PROJECTS: "projects",
}

const FILES = {
  "about.txt": "I am a Full Stack Developer passionate about bridging the gap between design and technology. I build immersive, performance-driven applications.",
  "work.txt": "Selected Work:\n- Project 01: Interactive Web Design\n- Project 02: AI Dashboard\n- Project 03: E-commerce Platform\n- Project 04: portfolio-v1",
  "contact.txt": "Email: hello@tanish.dev\nGitHub: github.com/tanish-24\nLinkedIn: linkedin.com/in/tanish-jagtap",
}

export default function RetroTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "output", content: "TANISH OS v1.0.0 (release 2025)" },
    { type: "output", content: 'Type "help" to see available commands.' },
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
        output = [
          "Available commands:",
          "  help     - Show this menu",
          "  ls       - List virtual filesystem contents",
          "  cat [f]  - Read file contents",
          "  whoami   - Display user info",
          "  projects - View latest works",
          "  clear    - Flush terminal history",
        ]
        break
      case COMMANDS.LS:
        output = Object.keys(FILES).join("  ")
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
        output = [
          "NAME: Tanish Jagtap",
          "ROLE: Full Stack Developer / Creative Technologist",
          "LOCATION: Pune, India",
          "STATUS: Seeking innovative challenges",
        ]
        break
      case COMMANDS.PROJECTS:
        output = FILES["work.txt"].split("\n")
        break
      case COMMANDS.CLEAR:
        setLogs([])
        return
      case "":
        return
      default:
        output = `Command not found: ${name}. Type "help" for a list of commands.`
    }

    setLogs((prev) => [
      ...prev,
      { type: "command", content: cmd },
      { type: "output", content: output },
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-10 perspective-1000">
      <motion.div 
        initial={{ rotateX: 5, y: 20, opacity: 0 }}
        animate={{ rotateX: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="terminal-bezel w-full max-w-6xl h-[80vh] flex flex-col relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* CRT Effects */}
        <div className="absolute inset-0 pointer-events-none crt-overlay z-10 opacity-40" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.03)_0%,transparent_100%)] z-10" />
        <div className="absolute inset-0 pointer-events-none animate-scanline bg-[linear-gradient(transparent_0%,rgba(74,222,128,0.01)_50%,transparent_100%)] z-10 h-20 w-full" />
        
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto space-y-2 scroll-smooth animate-flicker relative z-0 p-6 md:p-12 mb-8 selection:bg-[#4ade80] selection:text-black"
        >
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="leading-relaxed whitespace-pre-wrap text-[14px] md:text-[18px]"
              >
                {log.type === "command" ? (
                  <div className="flex gap-4">
                    <span className="text-[#4ade80]/40 shrink-0">tanish@os:~$</span>
                    <span className="font-bold text-glow-green">{log.content}</span>
                  </div>
                ) : (
                  <div className="pl-0 md:pl-32">
                    {Array.isArray(log.content) 
                      ? log.content.map((line, j) => <div key={j} className="opacity-90">{line}</div>)
                      : <div className="opacity-90">{log.content}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!isBooting && (
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
              <span className="text-[#4ade80]/40 shrink-0">tanish@os:~$</span>
              <input
                ref={inputRef}
                autoFocus
                className="bg-transparent border-none outline-none text-[#4ade80] flex-1 font-bold caret-[#4ade80] text-[14px] md:text-[18px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              <span className="terminal-cursor" />
            </form>
          )}
        </div>

        {/* Footer / Info */}
        <div className="relative z-30 px-6 py-3 border-t border-[#4ade80]/10 flex justify-between text-[9px] uppercase tracking-widest opacity-40 font-bold bg-[#0a0a0a]">
          <span>TANISH // TERMINAL_v1.2</span>
          <span className="hidden md:block">MEM_LOAD: 42% // STACK_ADDR: 0x7FFD</span>
          <span>STATUS: ONLINE</span>
        </div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-[#4ade80]/40 uppercase tracking-[0.3em] text-[10px]"
      >
        <span className="scroll-hint">Scroll down</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#4ade80]/40 to-transparent" />
      </motion.div>
    </div>
  )
}
