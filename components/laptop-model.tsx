"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, useGLTF, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { TerminalScreen } from "./terminal-screen"

export function LaptopModel({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)
  
  // Load the MacBook GLB
  // Note: Ensure the model is at public/models/macbook_pro_14_inch_M5.glb
  const { nodes, materials, scene } = useGLTF('/models/macbook_pro_14_inch_M5.glb') as any

  // Debug: Log nodes to help user find screen mesh if named differently
  useEffect(() => {
    console.log("Laptop Model Nodes:", nodes)
  }, [nodes])

  // Try to find the screen/display mesh. 
  // Common MacBook GLB node names: "Screen", "Display", "Object_4", "monitor"
  // We'll prioritize "Screen" or "Display"
  const screenMesh = nodes.Screen || nodes.Display || Object.values(nodes).find((node: any) => 
    node.isMesh && (node.name.toLowerCase().includes('screen') || node.name.toLowerCase().includes('display'))
  )

  useFrame((state) => {
    if (!group.current) return

    const t = state.clock.getElapsedTime()

    // Subtle hover effect
    group.current.position.y = THREE.MathUtils.lerp(
      Math.sin(t) * 0.05 - 0.2, 
      -0.8, 
      progress
    )

    // Spin interaction: turns 180 degrees (Math.PI) as user scrolls
    group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI, progress)
    
    // Slight tilt adjustment
    group.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 32, progress)

    // Scale down slightly on scroll
    group.current.scale.setScalar(THREE.MathUtils.lerp(1.2, 0.9, progress))
  })

  return (
    <group ref={group} dispose={null}>
      {/* 
          Instead of just <primitive object={scene} />, we build the mesh tree 
          so we can specifically target the screen for the Html attachment.
      */}
      <primitive object={scene} />

      {/* 
          Overlay Terminal onto the detected screen mesh.
          We use a separate mesh for the Html to ensure correct positioning and rotation.
          If nodes.Screen is found, we match its transform.
      */}
      {screenMesh && (
        <mesh
          geometry={screenMesh.geometry}
          position={screenMesh.position}
          rotation={screenMesh.rotation}
          scale={screenMesh.scale}
        >
          {/* Black background to mask original texture */}
          <meshStandardMaterial color="black" roughness={0.1} />
          
          <Html
            transform
            distanceFactor={1.2} // Adjusted for Mac screen size
            position={[0, 0, 0.02]} // Slight offset to prevent z-fighting
            occlude
            pointerEvents="none"
          >
            <div 
              className="screen-glow"
              style={{
                width: "1024px",
                height: "640px",
                background: "#050505",
                borderRadius: "8px",
                overflow: "hidden",
                opacity: Math.max(0, 1 - progress * 2),
                transition: "opacity 0.2s ease-out"
              }}
            >
              <TerminalScreen />
            </div>
          </Html>
        </mesh>
      )}

      <Environment preset="night" />

      {/* Adjust light for screen readability */}
      <rectAreaLight
        width={3}
        height={2}
        intensity={Math.max(0, 30 - progress * 40)}
        color="#4ade80"
        position={[0, 0.5, 0.5]}
        rotation={[0, 0, 0]}
      />

      <ContactShadows 
        position={[0, -0.7, 0]} 
        opacity={0.4} 
        scale={15} 
        blur={2.5} 
        far={4.5} 
      />
    </group>
  )
}
