"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import RetroLoading from "@/components/retro-loading"
import RetroTerminal from "@/components/retro-terminal"

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 8000) // Exactly 8 seconds
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <RetroLoading />
  }

  return (
    <div className="relative w-full bg-black text-[#4ade80] font-mono selection:bg-[#4ade80] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 bg-black/50 backdrop-blur-md border-b border-[#4ade80]/10">
        <span className="text-xs md:text-sm tracking-tighter">TANISH JAGTAP // 2025</span>
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Terminal Section - WITH GRID PATTERN */}
      <section className="relative h-screen pt-20 flex items-center justify-center overflow-hidden bg-black">
        {/* GRID PATTERN - Behind terminal */}
        <div className="absolute inset-0 terminal-grid opacity-40 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,black_100%) pointer-events-none z-5" />
        
        {/* TERMINAL - Higher z-index */}
        <div className="relative z-10 w-full flex items-center justify-center px-4 md:px-20">
          <RetroTerminal />
        </div>
      </section>

      <main className="relative">
        {/* About Section */}
        <section id="about" className="min-h-screen px-6 py-24 md:px-24 flex flex-col justify-center border-t border-[#4ade80]/10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tighter text-glow">I build digital experiences.</h2>
            <p className="text-xl md:text-2xl text-[#4ade80]/80 leading-relaxed max-w-2xl">
              Focused on bridging the gap between design and technology. I create immersive, performance-driven
              applications that live on the edge of innovation.
            </p>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="work" className="min-h-screen px-6 py-24 md:px-24 border-t border-[#4ade80]/10">
          <h3 className="text-sm uppercase tracking-widest text-[#4ade80]/60 mb-12">Selected Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-video bg-[#0a0a0a] border border-[#4ade80]/20 rounded-2xl overflow-hidden hover:border-[#4ade80]/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
                  <h4 className="text-2xl font-bold">Project 0{i}</h4>
                  <p className="text-[#4ade80]/60">Interactive Web Design</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen px-6 md:px-24 flex flex-col items-center justify-center text-center border-t border-[#4ade80]/10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-9xl font-bold tracking-tighter mb-12 text-glow">Let's talk.</h2>
            <a
              href="mailto:hello@tanish.dev"
              className="text-xl hover:text-white transition-colors border-b border-[#4ade80] pb-2"
            >
              hello@tanish.dev
            </a>
          </motion.div>
        </section>
      </main>

      <div className="sr-only">
        <h1>Tanish Jagtap Portfolio</h1>
        <p>Interactive Retro Terminal Portfolio showcasing web development and design skills.</p>
      </div>

      <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </div>
  )
}
