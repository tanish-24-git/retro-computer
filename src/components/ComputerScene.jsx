import React, { useRef, useLayoutEffect } from 'react'
import { useGLTF, Html, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import TerminalScreen from './TerminalScreen'

const ComputerScene = () => {
  const { scene } = useGLTF('/models/sci_fi_laptop_90s.glb')
  const group = useRef()
  
  // Center the model
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group ref={group} dispose={null} position={[0, -1.2, 0]} rotation={[0, 0, 0]} scale={1.8}>
      <primitive object={scene} />
      
      {/* 
          Terminal screen positioned on the laptop screen.
          Made larger to fill viewport when camera is close
      */}
      <Html
        transform
        distanceFactor={1.2}
        position={[0, 1.55, -0.45]}
        rotation={[-0.2, 0, 0]}
        occlude
      >
        <TerminalScreen />
      </Html>
    </group>
  )
}

useGLTF.preload('/models/sci_fi_laptop_90s.glb')

export default ComputerScene
