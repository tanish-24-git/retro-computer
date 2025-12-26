"use client"

import { Canvas } from "@react-three/fiber"
import { useScroll as useFramerScroll, useTransform, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { LaptopModel } from "./laptop-model"
import * as THREE from "three"

function SceneContent() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          // Smooth progress over 1.2 viewports for more cinematic feel
          const progress = Math.min(scrollY / (windowHeight * 1.2), 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <LaptopModel progress={scrollProgress} />
}

export default function HeroScene() {
  const { scrollY } = useFramerScroll()

  const opacity = useTransform(scrollY, [0, 800, 1200], [1, 1, 0])
  const scale = useTransform(scrollY, [0, 1200], [1, 0.8])

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#020202] overflow-hidden pointer-events-none z-10"
        style={{ opacity, scale }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.6, 3], fov: 40 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <pointLight position={[-10, 5, 5]} intensity={1} />
          <SceneContent />
        </Canvas>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.15)_0%,transparent_60%)]" />
      </motion.div>

      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 text-white">
        <span className="font-mono text-xs md:text-sm tracking-tighter">TANISH JAGTAP // 2025</span>
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest">
          <a href="#work" className="hover:text-primary transition-colors">
            Work
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
      </nav>

      <main className="relative z-20">
        {/* Hero Spacer - allows scroll interaction with 3D scene */}
        <section className="h-screen" />

        {/* About Section */}
        <section id="about" className="min-h-screen px-6 py-24 md:px-24 flex flex-col justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tighter">I build digital experiences.</h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Focused on bridging the gap between design and technology. I create immersive, performance-driven
              applications that live on the edge of innovation.
            </p>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="work" className="min-h-screen px-6 py-24 md:px-24 bg-background">
          <h3 className="text-sm uppercase tracking-widest text-primary mb-12">Selected Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-video bg-muted rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                  <h4 className="text-2xl font-bold">Project 0{i}</h4>
                  <p className="text-muted-foreground">Interactive Web Design</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen px-6 md:px-24 flex flex-col items-center justify-center text-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-9xl font-bold tracking-tighter mb-12">Let's talk.</h2>
            <a
              href="mailto:hello@tanish.dev"
              className="text-xl hover:text-primary transition-colors border-b border-primary pb-2"
            >
              hello@tanish.dev
            </a>
          </motion.div>
        </section>
      </main>
    </>
  )
}
