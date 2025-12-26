import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ComputerScene from './ComputerScene'

gsap.registerPlugin(ScrollTrigger)

// Camera controller component that animates based on scroll
const CameraController = ({ scrollProgress }) => {
  const { camera } = useThree()
  
  useFrame(() => {
    // Animate camera position based on scroll
    // Start very close (terminal fills screen), then zoom out
    const startZ = 1.8   // Very close to screen - terminal fills viewport
    const endZ = 7       // Zoomed out view - full computer visible
    const startY = 0.8   // Eye level with screen
    const endY = 0.5     // Slightly lower view
    const startX = 0     // Centered
    const endX = 1.5     // Slightly to the side for better angle
    
    camera.position.z = startZ + (endZ - startZ) * scrollProgress
    camera.position.y = startY + (endY - startY) * scrollProgress
    camera.position.x = startX + (endX - startX) * scrollProgress
    camera.lookAt(0, 0.5, 0)
  })
  
  return null
}

// Model controller that rotates the model based on scroll
const ModelController = ({ scrollProgress, children }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      // Rotate model as user scrolls
      // Start facing forward, then rotate to show angle
      const startRotationY = 0
      const endRotationY = Math.PI * 0.25  // 45 degrees
      
      groupRef.current.rotation.y = startRotationY + (endRotationY - startRotationY) * scrollProgress
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

const ScrollController = () => {
  const containerRef = useRef()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll animations
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            // Update scroll progress for camera animation
            setScrollProgress(self.progress)
          }
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative', background: '#000' }}>
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
          gl={{ antialias: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <PerspectiveCamera makeDefault position={[0, 0.8, 1.8]} fov={50} />
          <CameraController scrollProgress={scrollProgress} />
          
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.6} />
          
          <ModelController scrollProgress={scrollProgress}>
            <ComputerScene />
          </ModelController>

          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />
        </Canvas>
      </div>

      <div style={{ 
        minHeight: '100vh', 
        background: '#f5f5dc', 
        position: 'relative', 
        zIndex: 1, 
        padding: '100px 10%' 
      }}>
        <h2 style={{ color: '#333', fontSize: '3rem', fontFamily: 'Fira Code, monospace' }}>
          Next Section
        </h2>
        <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.8' }}>
          This is where your portfolio projects or about section would start. 
          The transition should feel seamless as you scroll away from the retro computer.
        </p>
      </div>
    </div>
  )
}

export default ScrollController
