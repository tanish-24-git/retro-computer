"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { TerminalScreen } from "./terminal-screen"

export function LaptopModel({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Group>(null)

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: "#222222",
        metalness: 0.8,
        roughness: 0.2,
      }),
      screenFrame: new THREE.MeshStandardMaterial({
        color: "#0a0a0a",
        metalness: 0.9,
        roughness: 0.1,
      }),
      screenGlass: new THREE.MeshStandardMaterial({
        color: "#000000",
        roughness: 0,
        transparent: true,
        opacity: 0.9,
      }),
    }),
    [],
  )

  useFrame((state) => {
    if (!group.current || !screenRef.current) return

    const t = state.clock.getElapsedTime()

    group.current.position.y = THREE.MathUtils.lerp(Math.sin(t) * 0.05 - 0.2, -0.8, progress)

    // Rotation: 0 -> 30 degrees right on Y axis
    group.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 6, progress)
    group.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 32, progress)

    group.current.scale.setScalar(THREE.MathUtils.lerp(1.2, 0.9, progress))

    // Lid Animation: Starts almost closed (-Math.PI / 1.3), ends at natural open angle (-Math.PI / 2.2)
    screenRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 1.3, -Math.PI / 2.2, progress)
  })

  return (
    <group ref={group}>
      {/* Laptop Base */}
      <mesh material={materials.body} position={[0, -0.05, 0]}>
        <boxGeometry args={[4.5, 0.15, 2.4]} />
      </mesh>

      {/* Laptop Screen (Top Lid) */}
      <group ref={screenRef} position={[0, 0.02, -1.1]}>
        {/* Lid Outer */}
        <mesh material={materials.body} position={[0, 1.45, 0]}>
          <boxGeometry args={[4.5, 2.9, 0.08]} />
        </mesh>

        {/* Screen Display Area */}
        <mesh material={materials.screenFrame} position={[0, 1.45, 0.05]}>
          <boxGeometry args={[4.2, 2.6, 0.01]} />

          <Html transform distanceFactor={2.5} position={[0, 0, 0.01]} occlude pointerEvents="none">
            <div
              className="terminal-glow-container"
              style={{
                width: "1024px",
                height: "640px",
                opacity: Math.max(0, 1 - progress * 3),
                transition: "opacity 0.1s linear",
                pointerEvents: "none",
                background: "black",
              }}
            >
              <TerminalScreen />
            </div>
          </Html>
        </mesh>
      </group>

      <Environment preset="night" />

      <rectAreaLight
        width={4.5}
        height={3}
        intensity={Math.max(0, 45 - progress * 150)}
        color="#4ade80"
        position={[0, 1.2, 0.2]}
        rotation={[-Math.PI / 10, 0, 0]}
      />

      <ContactShadows position={[0, -0.7, 0]} opacity={0.4} scale={15} blur={2.5} far={4.5} />
    </group>
  )
}
