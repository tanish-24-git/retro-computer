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
    <div 
      className="relative w-full h-screen bg-black overflow-hidden font-mono text-[#4ade80] p-4 md:p-10 flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* CRT Effects */}
      <div className="absolute inset-0 pointer-events-none crt-overlay z-10 opacity-50" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.05)_0%,transparent_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none animate-scanline bg-[linear-gradient(transparent_0%,rgba(74,222,128,0.02)_50%,transparent_100%)] z-10 h-20 w-full" />
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 scroll-smooth animate-flicker relative z-0 mb-8"
      >
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="leading-relaxed whitespace-pre-wrap"
            >
              {log.type === "command" ? (
                <div className="flex gap-4">
                  <span className="text-[#4ade80]/50 shrink-0">tanish@os:~$</span>
                  <span className="font-bold">{log.content}</span>
                </div>
              ) : (
                <div className="pl-0 md:pl-28">
                  {Array.isArray(log.content) 
                    ? log.content.map((line, j) => <div key={j}>{line}</div>)
                    : <div>{log.content}</div>}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {!isBooting && (
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <span className="text-[#4ade80]/50 shrink-0">tanish@os:~$</span>
            <input
              ref={inputRef}
              autoFocus
              className="bg-transparent border-none outline-none text-[#4ade80] flex-1 font-bold caret-[#4ade80]"
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
      <div className="relative z-30 pt-4 border-t border-[#4ade80]/20 flex justify-between text-[10px] uppercase tracking-widest opacity-50">
        <span>TANISH // TERMINAL_PROMPT_v1.0</span>
        <span className="hidden md:block">LOADED_MODULES: [BIO, WORK, CONTACT]</span>
        <span>STATUS: SYSTEM_READY</span>
      </div>
    </div>
  )
}
