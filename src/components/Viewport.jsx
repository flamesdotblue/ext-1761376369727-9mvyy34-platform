import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, StatsGl, Grid, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFExporter } from 'three-stdlib'
import { saveAs } from 'file-saver'
import { useAppStore } from '../store'

function AnimatedMesh() {
  const s = useAppStore()
  const ref = useRef()
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(s.mesh.material.color), roughness: s.mesh.material.roughness, metalness: s.mesh.material.metalness }), [s.mesh.material.color, s.mesh.material.roughness, s.mesh.material.metalness])

  const lod = useMemo(() => {
    const l = new THREE.LOD()
    const levels = [
      { res: Math.max(1, s.mesh.resolution), dist: 0 },
      { res: Math.max(1, s.mesh.resolution - 1), dist: 30 },
      { res: Math.max(1, s.mesh.resolution - 2), dist: 60 },
    ]
    levels.forEach(({ res, dist }) => {
      const geom = new THREE.IcosahedronGeometry(1, res)
      const m = new THREE.Mesh(geom, mat)
      m.castShadow = true
      m.receiveShadow = true
      l.addLevel(m, dist)
    })
    return l
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.mesh.resolution, s.mesh.material.color, s.mesh.material.roughness, s.mesh.material.metalness])

  useFrame((state, delta) => {
    if (!ref.current) return
    const { animation } = useAppStore.getState()
    if (animation.playing) {
      const t = (animation.time + delta) % animation.duration
      useAppStore.setState({ animation: { ...animation, time: t } })
    }
    const tnorm = animation.time / Math.max(0.0001, animation.duration)
    ref.current.rotation.y = tnorm * Math.PI * 2
    ref.current.position.y = Math.sin(tnorm * Math.PI * 2) * 0.2
  })

  // Apply simple visual for simplification
  const wire = s.mesh.simplify > 0.01

  return (
    <group ref={ref} frustumCulled>
      <primitive object={lod} />
      {wire && (
        <mesh>
          <icosahedronGeometry args={[1.01, Math.max(0, s.mesh.resolution - Math.floor(3 * s.mesh.simplify))]} />
          <meshBasicMaterial color="#26A69A" wireframe transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  )
}

function Scene() {
  const s = useAppStore()
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Grid args={[100, 100]} position={[0, -1.2, 0]} cellSize={0.5} cellColor="#222" sectionColor="#333" />
      <AnimatedMesh />
      <Environment preset="city" />
      {s.ai.busy && (
        <Html fullscreen>
          <div className="absolute inset-0 bg-black/60 backdrop-blur flex items-center justify-center">
            <div className="w-80 rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-neutral-200">
              <div className="font-medium mb-2">Generating 3D Model...</div>
              <div className="w-full h-2 bg-neutral-800 rounded overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${s.ai.progress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span>{s.ai.progress}%</span>
                <button onClick={()=>useAppStore.getState().cancelAIGeneration()} className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700">Cancel</button>
              </div>
            </div>
          </div>
        </Html>
      )}
      <StatsGl showPanel={0} className="stats"/>
    </>
  )
}

export default function Viewport() {
  const s = useAppStore()

  React.useEffect(() => {
    const onExport = async () => {
      const exporter = new GLTFExporter()
      const scene = window.__r3f?.roots?.[0]?.store.getState().scene || null
      if (!scene) return
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([JSON.stringify(gltf)], { type: 'model/gltf+json' })
          saveAs(blob, `export-${Date.now()}.gltf`)
        },
        { binary: false, trs: true, onlyVisible: true, truncateDrawRange: true }
      )
    }
    window.addEventListener('export-scene', onExport)
    return () => window.removeEventListener('export-scene', onExport)
  }, [])

  return (
    <div className="flex-1 relative bg-[#121212]">
      <Canvas shadows camera={{ position: [3, 2, 3], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} autoRotate={s.camera.autoRotate} />
      </Canvas>
      <div className="pointer-events-none absolute left-2 bottom-2 text-xs text-neutral-500">Occlusion culling, LOD, and real-time rendering enabled</div>
    </div>
  )
}
