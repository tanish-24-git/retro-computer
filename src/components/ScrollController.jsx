import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ComputerScene from './ComputerScene'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cinematic camera controller with 4-stage animation
 * Stage 1 (0-30%):   Extreme close-up of screen
 * Stage 2 (30-50%):  Slight pullback, terminal readable
 * Stage 3 (50-80%):  Orbit and reveal full laptop
 * Stage 4 (80-100%): Final hero shot, hold position
 */
const CameraController = ({ scrollProgress }) => {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0, y: 0.8, z: 0 })
  
  useFrame(() => {
    // Define camera stages
    const stages = {
      // Stage 1: Extreme close-up - screen fills viewport
      stage1: {
        position: { x: 0, y: 0.9, z: 1.1 },
        target: { x: 0, y: 0.9, z: 0 }
      },
      // Stage 2: Slight pullback - terminal clearly readable
      stage2: {
        position: { x: 0.3, y: 0.8, z: 2.2 },
        target: { x: 0, y: 0.7, z: 0 }
      },
      // Stage 3: Orbit - laptop shape becomes visible
      stage3: {
        position: { x: 1.8, y: 1.1, z: 4.0 },
        target: { x: 0, y: 0.4, z: 0 }
      },
      // Stage 4: Hero shot - full laptop centered and large
      stage4: {
        position: { x: 2.2, y: 1.3, z: 5.5 },
        target: { x: 0, y: 0.2, z: 0 }
      }
    }
    
    // Interpolate between stages based on scroll progress
    let currentPos, currentTarget
    
    if (scrollProgress < 0.3) {
      // Stage 1 → 2
      const t = scrollProgress / 0.3
      const eased = gsap.parseEase("power2.out")(t)
      currentPos = {
        x: gsap.utils.interpolate(stages.stage1.position.x, stages.stage2.position.x, eased),
        y: gsap.utils.interpolate(stages.stage1.position.y, stages.stage2.position.y, eased),
        z: gsap.utils.interpolate(stages.stage1.position.z, stages.stage2.position.z, eased)
      }
      currentTarget = {
        x: gsap.utils.interpolate(stages.stage1.target.x, stages.stage2.target.x, eased),
        y: gsap.utils.interpolate(stages.stage1.target.y, stages.stage2.target.y, eased),
        z: gsap.utils.interpolate(stages.stage1.target.z, stages.stage2.target.z, eased)
      }
    } else if (scrollProgress < 0.5) {
      // Stage 2 → 3
      const t = (scrollProgress - 0.3) / 0.2
      const eased = gsap.parseEase("power1.inOut")(t)
      currentPos = {
        x: gsap.utils.interpolate(stages.stage2.position.x, stages.stage3.position.x, eased),
        y: gsap.utils.interpolate(stages.stage2.position.y, stages.stage3.position.y, eased),
        z: gsap.utils.interpolate(stages.stage2.position.z, stages.stage3.position.z, eased)
      }
      currentTarget = {
        x: gsap.utils.interpolate(stages.stage2.target.x, stages.stage3.target.x, eased),
        y: gsap.utils.interpolate(stages.stage2.target.y, stages.stage3.target.y, eased),
        z: gsap.utils.interpolate(stages.stage2.target.z, stages.stage3.target.z, eased)
      }
    } else if (scrollProgress < 0.8) {
      // Stage 3 → 4
      const t = (scrollProgress - 0.5) / 0.3
      const eased = gsap.parseEase("power2.inOut")(t)
      currentPos = {
        x: gsap.utils.interpolate(stages.stage3.position.x, stages.stage4.position.x, eased),
        y: gsap.utils.interpolate(stages.stage3.position.y, stages.stage4.position.y, eased),
        z: gsap.utils.interpolate(stages.stage3.position.z, stages.stage4.position.z, eased)
      }
      currentTarget = {
        x: gsap.utils.interpolate(stages.stage3.target.x, stages.stage4.target.x, eased),
        y: gsap.utils.interpolate(stages.stage3.target.y, stages.stage4.target.y, eased),
        z: gsap.utils.interpolate(stages.stage3.target.z, stages.stage4.target.z, eased)
      }
    } else {
      // Hold at stage 4
      currentPos = stages.stage4.position
      currentTarget = stages.stage4.target
    }
    
    // Apply camera position and target
    camera.position.set(currentPos.x, currentPos.y, currentPos.z)
    camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z)
    
    // Store target for debugging
    targetRef.current = currentTarget
  })
  
  return null
}

/**
 * Model rotation controller
 * Rotates laptop to show different angles as camera orbits
 */
const ModelController = ({ scrollProgress, children }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      // Rotation stages aligned with camera movement
      let rotation
      
      if (scrollProgress < 0.3) {
        // Stage 1-2: Face forward
        rotation = 0
      } else if (scrollProgress < 0.5) {
        // Stage 2-3: Start rotating
        const t = (scrollProgress - 0.3) / 0.2
        const eased = gsap.parseEase("power1.inOut")(t)
        rotation = gsap.utils.interpolate(0, Math.PI * 0.15, eased)
      } else if (scrollProgress < 0.8) {
        // Stage 3-4: Continue to final angle
        const t = (scrollProgress - 0.5) / 0.3
        const eased = gsap.parseEase("power2.inOut")(t)
        rotation = gsap.utils.interpolate(Math.PI * 0.15, Math.PI * 0.25, eased)
      } else {
        // Hold at final rotation (45 degrees)
        rotation = Math.PI * 0.25
      }
      
      groupRef.current.rotation.y = rotation
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

const ScrollController = () => {
  const containerRef = useRef()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ScrollTrigger to track scroll progress
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress)
          }
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ height: '500vh', position: 'relative', background: '#000' }}>
      {/* Sticky 3D canvas section */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        width: '100%', 
        height: '100vh', 
        overflow: 'hidden', 
        background: '#000'
      }}>
        <Canvas 
          shadows 
          gl={{ 
            antialias: true,
            alpha: false
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Camera with reduced FOV for less distortion */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 0.9, 1.1]} 
            fov={42}
            near={0.1}
            far={100}
          />
          <CameraController scrollProgress={scrollProgress} />
          
          {/* Lighting setup */}
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -5, -10]} intensity={0.7} color="#4080ff" />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff8040" />
          
          {/* 3D laptop with terminal */}
          <ModelController scrollProgress={scrollProgress}>
            <ComputerScene />
          </ModelController>

          {/* Ground shadow */}
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.5} 
            scale={25} 
            blur={2.5} 
            far={5} 
          />
        </Canvas>
        
        {/* Vignette overlay */}
        <div className="vignette" />
      </div>

      {/* Portfolio content section */}
      <div style={{ 
        minHeight: '100vh', 
        background: '#f5f5dc', 
        position: 'relative', 
        zIndex: 1, 
        padding: '100px 10%',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#333', 
          fontSize: '3rem', 
          fontFamily: 'Fira Code, monospace',
          marginBottom: '1rem'
        }}>
          About Me
        </h2>
        <p style={{ 
          color: '#666', 
          fontSize: '1.2rem', 
          maxWidth: '700px', 
          lineHeight: '1.8',
          fontFamily: 'Fira Code, monospace'
        }}>
          This is where your portfolio content begins. Add your projects, skills, experience, 
          and contact information here. The retro-futuristic aesthetic continues with the 
          monospace font and soft color palette.
        </p>
      </div>
    </div>
  )
}

export default ScrollController

