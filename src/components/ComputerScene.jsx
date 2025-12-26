import React, { useRef, useLayoutEffect, useEffect } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import TerminalScreen from './TerminalScreen'

const ComputerScene = () => {
  const { nodes, scene } = useGLTF('/models/sci_fi_laptop_90s.glb')
  const groupRef = useRef()
  const laptopMeshRef = useRef()
  
  // Apply shadows to all meshes
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  // Debug: Log available nodes (remove after confirming setup)
  useEffect(() => {
    console.log('Available nodes:', Object.keys(nodes))
    console.log('Laptop mesh:', nodes['Laptop_Export_003_0'])
  }, [nodes])

  return (
    <group ref={groupRef} dispose={null} position={[0, -0.5, 0]} rotation={[0, 0, 0]} scale={2.8}>
      {/* Render the main laptop model */}
      <primitive object={scene} />
      
      {/* 
        Attach terminal HTML to the laptop mesh.
        Since this model doesn't have a separate screen mesh, we position the HTML
        relative to the main laptop mesh at the screen location.
        
        TUNING PARAMETERS:
        - position: Adjust [x, y, z] to align with the physical screen on your model
        - rotation: Match the screen's tilt angle (currently -0.2 radians ≈ -11.5°)
        - distanceFactor: Controls HTML scaling (lower = larger relative to 3D scene)
      */}
      <group position={[0, 1.55, -0.45]} rotation={[-0.2, 0, 0]}>
        <Html
          transform
          distanceFactor={1.0}
          position={[0, 0, 0.02]}  // Small Z offset to prevent z-fighting
          occlude
          zIndexRange={[0, 0]}
        >
          <TerminalScreen />
        </Html>
      </group>
    </group>
  )
}

useGLTF.preload('/models/sci_fi_laptop_90s.glb')

export default ComputerScene

