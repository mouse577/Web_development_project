import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Blur(props: any) {
  const { nodes } = useGLTF('/productivity-frontend/RoomFloor.glb')

  // create a material texture that emulates a blur effect
  function blurMat() {
    const new_mat = new THREE.MeshPhysicalMaterial( {
      color: 0x8cd3ff,
      transmission: 1,
      opacity: 1,
      roughness: 0.6,
      thickness: 10,
      transparent: true
    } );
    return new_mat;
  }

  return (
    <group {...props} dispose={null}>
      <mesh geometry={(nodes.Plane as THREE.Mesh).geometry}
        material={blurMat()}
        scale={5}>
      </mesh>
    </group>
  )
}

useGLTF.preload('/productivity-frontend/RoomWall.glb')
