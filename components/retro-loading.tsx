"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOADING_STEPS = [
  "INITIALIZING KERNEL...",
  "LOADING SYSTEM ARCHITECTURE...",
  "MOUNTING VIRTUAL FILESYSTEM...",
  "ESTABLISHING SECURE PROTOCOLS...",
  "UPDATING ASSETS: ABOUT.TXT",
  "UPDATING ASSETS: PROJECTS.DB",
  "UPDATING ASSETS: CONTACT.INF",
  "BOOTING TANISH_OS v1.0.0..."
]

export default function RetroLoading() {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const duration = 8000 // 8 seconds total (change to 5000 for 5 seconds)
    const interval = 30
    const increment = (100 / (duration / interval))

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stepCount = LOADING_STEPS.length
    const currentStep = Math.min(
      Math.floor((progress / 100) * stepCount),
      stepCount - 1
    )
    setStepIndex(currentStep)
  }, [progress])

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono p-10">
      {/* CRT Effects */}
      <div className="absolute inset-0 pointer-events-none crt-overlay z-10 opacity-30" />
      <div className="absolute inset-0 pointer-events-none animate-scanline bg-[linear-gradient(transparent_0%,rgba(74,222,128,0.01)_50%,transparent_100%)] z-10 h-20 w-full" />

      <div className="w-full max-w-2xl space-y-12 relative z-20">
        <div className="space-y-4">
          <div className="flex justify-between text-sm md:text-base tracking-[0.3em] uppercase opacity-60 font-bold">
            <span>System Boot Sequence</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="h-6 w-full border-2 border-[#4ade80]/30 p-1.5 bg-[#050505]">
            <motion.div 
              className="h-full bg-[#4ade80] shadow-[0_0_20px_#4ade80]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[#4ade80] text-lg md:text-2xl tracking-[0.3em] font-black text-center text-glow-green"
            >
              {LOADING_STEPS[stepIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-16 text-xs md:text-sm uppercase tracking-[0.5em] opacity-40 animate-pulse font-bold">
        Secure Terminal Environment // Access Granted
      </div>
    </div>
  )
}
