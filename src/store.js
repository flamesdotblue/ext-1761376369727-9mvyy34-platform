import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const defaultMaterial = {
  color: '#9bd4ce',
  roughness: 0.5,
  metalness: 0.1,
  normalScale: 0.5,
  maps: {
    diffuse: null,
    specular: null,
    normal: null,
    roughness: null,
  },
}

const initialState = {
  theme: 'dark',
  selection: {
    type: 'mesh',
    id: 'primary-mesh',
  },
  camera: {
    autoRotate: false,
  },
  tool: 'textTo3D', // textTo3D | imageTo3D | sculpt | paint | rig | animate
  ai: {
    busy: false,
    progress: 0,
    cancelToken: null,
    textPrompt: '',
    textStyle: 'photorealistic',
    complexity: 0.6,
    detail: 0.7,
    imgFile: null,
    recon: {
      depth: 0.6,
      density: 0.5,
      texDetail: 0.7,
    },
  },
  mesh: {
    resolution: 2, // used for dynamic geom detail
    simplify: 0.0,
    material: { ...defaultMaterial },
    nonDestructive: true,
    layers: [
      { id: 'base', name: 'Base Mesh', visible: true },
      { id: 'sculpt', name: 'Sculpt Layer', visible: true },
      { id: 'paint', name: 'Paint Layer', visible: true },
    ],
  },
  animation: {
    playing: false,
    time: 0,
    duration: 4,
    interpolation: 'linear',
    easing: 'easeInOut',
    keyframes: [],
  },
  rig: {
    bones: 0,
    ik: true,
  },
  export: {
    format: 'gltf',
    polyCount: 100,
    texResolution: 2048,
  },
  collaboration: {
    connected: false,
    users: [],
  },
  history: {
    past: [],
    present: null,
    future: [],
  },
}

const pushHistory = (state) => {
  const snapshot = JSON.stringify({
    selection: state.selection,
    mesh: state.mesh,
    animation: state.animation,
    rig: state.rig,
    ai: state.ai,
  })
  return {
    history: {
      past: [...state.history.past, snapshot],
      present: snapshot,
      future: [],
    },
  }
}

export const useAppStore = create(devtools((set, get) => ({
  ...initialState,

  setTool: (tool) => set((s) => ({ tool })),

  setPrompt: (textPrompt) => set((s) => ({ ai: { ...s.ai, textPrompt } })),
  setAIParam: (k, v) => set((s) => ({ ai: { ...s.ai, [k]: v } })),
  setReconParam: (k, v) => set((s) => ({ ai: { ...s.ai, recon: { ...s.ai.recon, [k]: v } } })),

  setMaterial: (patch) => set((s) => ({ mesh: { ...s.mesh, material: { ...s.mesh.material, ...patch } } }), false, 'material/set'),
  setMaterialMap: (name, file) => set((s) => ({ mesh: { ...s.mesh, material: { ...s.mesh.material, maps: { ...s.mesh.material.maps, [name]: file } } } })),

  setMeshResolution: (resolution) => set((s) => ({ mesh: { ...s.mesh, resolution } }), false, 'mesh/resolution'),
  setSimplify: (simplify) => set((s) => ({ mesh: { ...s.mesh, simplify } })),
  toggleLayer: (id) => set((s) => ({
    mesh: {
      ...s.mesh,
      layers: s.mesh.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    },
  })),

  setAnimation: (patch) => set((s) => ({ animation: { ...s.animation, ...patch } })),
  addKeyframe: (time, value) => set((s) => ({ animation: { ...s.animation, keyframes: [...s.animation.keyframes, { time, value }] } })),

  setRig: (patch) => set((s) => ({ rig: { ...s.rig, ...patch } })),

  startAIGeneration: (kind) => {
    const cancel = { cancelled: false }
    set((s) => ({ ai: { ...s.ai, busy: true, progress: 0, cancelToken: cancel } }))
    const step = () => {
      const { ai } = get()
      if (ai.cancelToken?.cancelled) {
        set((s) => ({ ai: { ...s.ai, busy: false, progress: 0, cancelToken: null } }))
        return
      }
      if (ai.progress >= 100) {
        // In a real app, replace mesh or material here based on AI output
        set((s) => ({ ai: { ...s.ai, busy: false, cancelToken: null } }))
        return
      }
      set((s) => ({ ai: { ...s.ai, progress: Math.min(100, s.ai.progress + 5) } }))
      setTimeout(step, 150)
    }
    setTimeout(step, 250)
  },
  cancelAIGeneration: () => set((s) => { s.ai.cancelToken && (s.ai.cancelToken.cancelled = true); return s }),

  exportSettings: (patch) => set((s) => ({ export: { ...s.export, ...patch } })),

  pushHistory: () => set((s) => pushHistory(s)),
  undo: () => set((s) => {
    const past = [...s.history.past]
    if (!past.length) return {}
    const previous = past[past.length - 1]
    const newPast = past.slice(0, -1)
    const present = s.history.present
    const snap = JSON.parse(previous)
    return {
      ...snap,
      history: { past: newPast, present: previous, future: present ? [present, ...s.history.future] : s.history.future },
    }
  }),
  redo: () => set((s) => {
    const [next, ...rest] = s.history.future
    if (!next) return {}
    const snap = JSON.parse(next)
    return {
      ...snap,
      history: { past: [...s.history.past, s.history.present], present: next, future: rest },
    }
  }),
})))
