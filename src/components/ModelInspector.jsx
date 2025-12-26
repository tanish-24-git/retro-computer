import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Helper component to inspect GLB model structure
 * This will log all mesh names to the console
 */
const ModelInspector = () => {
  const { nodes, scene } = useGLTF('/models/sci_fi_laptop_90s.glb')
  
  useEffect(() => {
    console.log('=== GLB Model Structure ===')
    console.log('All nodes:', Object.keys(nodes))
    console.log('\nDetailed node info:')
    
    Object.entries(nodes).forEach(([name, node]) => {
      if (node.isMesh) {
        console.log(`\n📦 Mesh: ${name}`)
        console.log('  - Type:', node.type)
        console.log('  - Geometry:', node.geometry?.type)
        console.log('  - Material:', node.material?.name || node.material?.type)
        console.log('  - Position:', node.position)
        console.log('  - Rotation:', node.rotation)
        console.log('  - Scale:', node.scale)
      }
    })
    
    console.log('\n=== Scene Traversal ===')
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log(`Mesh in scene: ${child.name || 'unnamed'}`, child)
      }
    })
  }, [nodes, scene])
  
  return (
    <group>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/sci_fi_laptop_90s.glb')

export default ModelInspector
