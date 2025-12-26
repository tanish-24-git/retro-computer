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
  "about.txt":
    "I am a Full Stack Developer passionate about bridging the gap between design and technology. I build immersive, performance-driven applications.",
  "work.txt":
    "Selected Work:\n- Project 01: Interactive Web Design\n- Project 02: AI Dashboard\n- Project 03: E-commerce Platform\n- Project 04: portfolio-v1",
  "contact.txt":
    "Email: hello@tanish.dev\nGitHub: github.com/tanish-24\nLinkedIn: linkedin.com/in/tanish-jagtap",
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
      case COMMANDS.CAT: {
        const fileName = args[0]
        if (fileName && FILES[fileName as keyof typeof FILES]) {
          output = FILES[fileName as keyof typeof FILES].split("\n")
        } else {
          output = `cat: ${fileName || "missing file"}: No such file or directory`
        }
        break
      }
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
    <div className="w-full h-screen overflow-hidden bg-black grid-background" onClick={() => inputRef.current?.focus()}>
      {/* CRT SCREEN WITH EFFECTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full h-full bg-[#0a1f1f] rounded-[60px] md:rounded-[80px] lg:rounded-[100px]"
      >
        {/* FINE NOISE TEXTURE */}
        <div className="absolute inset-0 crt-noise rounded-[60px] md:rounded-[80px] lg:rounded-[100px]" />
        
        {/* MULTIPLE HORIZONTAL SCAN LINES AT DIFFERENT SPEEDS */}
        <div className="absolute inset-0 pointer-events-none z-10 rounded-[60px] md:rounded-[80px] lg:rounded-[100px]">
          <div className="crt-scanline-1" />
          <div className="crt-scanline-2" />
          <div className="crt-scanline-3" />
          <div className="crt-scanline-4" />
          <div className="crt-scanline-5" />
        </div>
        
        {/* CURVED SCREEN GLASS EFFECT */}
        <div className="absolute inset-0 pointer-events-none crt-glass-curve z-20 rounded-[60px] md:rounded-[80px] lg:rounded-[100px]" />
        
        {/* VIGNETTE FOR EDGES */}
        <div className="absolute inset-0 pointer-events-none crt-vignette-heavy z-20 rounded-[60px] md:rounded-[80px] lg:rounded-[100px]" />

        {/* FLOATING RETRO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="absolute top-8 right-8 md:top-12 md:right-12 lg:top-16 lg:right-16 z-40 
                     pointer-events-none group"
        >
          <div className="relative">
            {/* Green glow behind image */}
            <div className="absolute inset-0 bg-[#4ade80] blur-2xl opacity-30 scale-110 
                            group-hover:opacity-50 transition-opacity duration-500" />
            
            {/* Image with retro CRT effects */}
            <img
              src="/terminal-image.png"
              alt="Terminal Visual"
              className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 
                         object-cover rounded-2xl
                         opacity-70 hover:opacity-95 transition-all duration-500
                         shadow-[0_0_40px_rgba(74,222,128,0.4)]
                         border-2 border-[#4ade80]/30
                         group-hover:border-[#4ade80]/60
                         group-hover:shadow-[0_0_60px_rgba(74,222,128,0.6)]
                         saturate-50 contrast-125 brightness-110
                         hue-rotate-[10deg]"
              style={{
                filter: 'sepia(0.2) hue-rotate(10deg) saturate(0.8) contrast(1.2) brightness(1.1)',
                mixBlendMode: 'screen'
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            
            {/* Scan line overlay on image */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4ade80]/10 to-transparent 
                              animate-pulse opacity-50" />
            </div>
          </div>
        </motion.div>
        
        {/* TERMINAL CONTENT */}
        <div className="relative z-30 h-full flex flex-col">
          {/* TERMINAL LOGS */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto space-y-3 scroll-smooth p-8 md:p-12 lg:p-16
                       selection:bg-[#4ade80]/80 selection:text-black"
          >
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="leading-relaxed whitespace-pre-wrap text-base md:text-lg lg:text-xl"
                >
                  {log.type === "command" ? (
                    <div className="flex gap-3">
                      <span className="text-[#4ade80]/60 shrink-0 font-mono text-sm md:text-base">
                        tanish@os:~$
                      </span>
                      <span className="font-bold text-[#4ade80] terminal-text-glow">
                        {log.content}
                      </span>
                    </div>
                  ) : (
                    <div className="pl-12 md:pl-16 lg:pl-20">
                      {Array.isArray(log.content) ? (
                        log.content.map((line, j) => (
                          <div key={j} className="text-[#4ade80]/90 font-mono">
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-[#4ade80]/90 font-mono">{log.content}</div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {!isBooting && (
              <form
                onSubmit={handleSubmit}
                className="flex gap-3 items-center pt-2"
              >
                <span className="text-[#4ade80]/60 shrink-0 font-mono text-sm md:text-base">
                  tanish@os:~$
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  className="bg-transparent border-none outline-none text-[#4ade80] flex-1 
                             font-bold caret-[#4ade80] terminal-text-glow
                             text-base md:text-lg lg:text-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="terminal-cursor-block" />
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
