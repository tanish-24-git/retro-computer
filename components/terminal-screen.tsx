"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const messages = ["Hello, I'm Tanish Jagtap", "Welcome to my portfolio", "Type or scroll to explore"]

export function TerminalScreen() {
  const [displayText, setDisplayText] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)

  useEffect(() => {
    if (currentLine < messages.length) {
      if (currentChar < messages[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => {
            const next = [...prev]
            if (!next[currentLine]) next[currentLine] = ""
            next[currentLine] += messages[currentLine][currentChar]
            return next
          })
          setCurrentChar((prev) => prev + 1)
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + 1)
          setCurrentChar(0)
        }, 1000)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentLine, currentChar])

  return (
    <div className="w-full h-full bg-[#050505] p-12 font-mono text-[26px] leading-relaxed text-[#4ade80] overflow-hidden rounded-sm flex flex-col justify-center relative border border-[#4ade80]/20">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,118,0.04))] z-10 bg-[length:100%_3px,2px_100%]" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.08)_0%,transparent_100%)] z-15" />

      {/* Subtle Scanline Animation */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(74,222,128,0.06)_50%,transparent_100%)] animate-scanline z-20" />

      <div className="space-y-6 relative z-30">
        {displayText.map((line, i) => (
          <div key={i} className="flex items-start">
            <span className="mr-6 text-[#4ade80]/50 text-xl mt-1">tanish@portfolio:~$</span>
            <span className="drop-shadow-[0_0_12px_rgba(74,222,128,0.7)] font-bold">{line}</span>
            {i === currentLine && i < messages.length && <span className="terminal-cursor ml-1" />}
          </div>
        ))}
        {currentLine === messages.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
            <span className="mr-6 text-[#4ade80]/50 text-xl mt-1">tanish@portfolio:~$</span>
            <span className="terminal-cursor ml-1" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
