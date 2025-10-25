import React from 'react'
import { useAppStore } from '../store'
import { Wand2, Image as ImageIcon, Brush, Layers, Bone, PlaySquare, UploadCloud, Eraser } from 'lucide-react'

export default function LeftSidebar() {
  const s = useAppStore()
  const fileRef = React.useRef()
  const mocapRef = React.useRef()

  const startTextGen = () => s.startAIGeneration('text')
  const startImgGen = (f) => {
    if (!f) return
    s.setAIParam('imgFile', f)
    s.startAIGeneration('image')
  }

  return (
    <aside className="w-80 shrink-0 border-r border-neutral-800 bg-[#0f0f0f] h-full overflow-y-auto">
      <div className="p-4">
        <div className="text-neutral-400 text-xs uppercase tracking-wider mb-2">AI Generation</div>
        <div className="space-y-3">
          <button onClick={() => s.setTool('textTo3D')} className={`w-full flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='textTo3D'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <Wand2 size={16}/> Text to 3D
          </button>
          {s.tool==='textTo3D' && (
            <div className="space-y-3 p-3 rounded bg-neutral-900 border border-neutral-800">
              <input value={s.ai.textPrompt} onChange={(e)=>s.setPrompt(e.target.value)} placeholder="Describe your model..." className="w-full px-3 py-2 rounded bg-neutral-800 text-neutral-200 placeholder-neutral-500 outline-none" />
              <div className="flex items-center justify-between text-neutral-300">
                <label className="text-sm">Style</label>
                <select value={s.ai.textStyle} onChange={(e)=>s.setAIParam('textStyle', e.target.value)} className="bg-neutral-800 text-neutral-200 rounded px-2 py-1">
                  <option value="photorealistic">Photorealistic</option>
                  <option value="stylized">Stylized</option>
                  <option value="abstract">Abstract</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Complexity: {(s.ai.complexity*100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={s.ai.complexity} onChange={(e)=>s.setAIParam('complexity', parseFloat(e.target.value))} className="w-full"/>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Detail Level: {(s.ai.detail*100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={s.ai.detail} onChange={(e)=>s.setAIParam('detail', parseFloat(e.target.value))} className="w-full"/>
              </div>
              <button onClick={startTextGen} className="w-full py-2 rounded bg-teal-600 text-white hover:bg-teal-500">Generate</button>
            </div>
          )}

          <button onClick={() => s.setTool('imageTo3D')} className={`w-full flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='imageTo3D'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <ImageIcon size={16}/> Image to 3D
          </button>
          {s.tool==='imageTo3D' && (
            <div className="space-y-3 p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700">
                  <UploadCloud size={16}/> Upload JPG/PNG/TIFF
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/tiff" className="hidden" onChange={(e)=>startImgGen(e.target.files?.[0])} />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Depth Estimation: {(s.ai.recon.depth*100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={s.ai.recon.depth} onChange={(e)=>s.setReconParam('depth', parseFloat(e.target.value))} className="w-full"/>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Mesh Density: {(s.ai.recon.density*100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={s.ai.recon.density} onChange={(e)=>s.setReconParam('density', parseFloat(e.target.value))} className="w-full"/>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Texture Detail: {(s.ai.recon.texDetail*100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={s.ai.recon.texDetail} onChange={(e)=>s.setReconParam('texDetail', parseFloat(e.target.value))} className="w-full"/>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-neutral-400 text-xs uppercase tracking-wider mb-2">Editing</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => s.setTool('sculpt')} className={`flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='sculpt'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <Brush size={16}/> Sculpt
          </button>
          <button onClick={() => s.setTool('paint')} className={`flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='paint'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <Layers size={16}/> Paint
          </button>
          <button onClick={() => s.setTool('rig')} className={`flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='rig'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <Bone size={16}/> Rig
          </button>
          <button onClick={() => s.setTool('animate')} className={`flex items-center gap-2 px-3 py-2 rounded border ${s.tool==='animate'?'border-teal-600 bg-teal-600/10 text-teal-300':'border-neutral-800 hover:bg-neutral-900 text-neutral-300'}`}>
            <PlaySquare size={16}/> Animate
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <button onClick={()=>s.setSimplify(Math.min(1, s.mesh.simplify + 0.1))} className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Mesh Simplification +
          </button>
          <button onClick={()=>s.setMeshResolution(Math.max(0, s.mesh.resolution - 1))} className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Subdivision -
          </button>
          <button onClick={()=>s.setMeshResolution(s.mesh.resolution + 1)} className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Subdivision +
          </button>
          <button className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Boolean Ops
          </button>
          <button className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Retopology
          </button>
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Eraser size={16}/> Non-destructive
            <input type="checkbox" checked={s.mesh.nonDestructive} onChange={()=>useAppStore.setState((st)=>({mesh:{...st.mesh, nonDestructive:!st.mesh.nonDestructive}}))} />
          </div>
        </div>

        <div className="mt-6 text-neutral-400 text-xs uppercase tracking-wider mb-2">Motion Capture</div>
        <div className="space-y-2">
          <button onClick={()=>mocapRef.current?.click()} className="w-full text-left px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300">
            Import BVH/FBX
          </button>
          <input ref={mocapRef} type="file" accept=".bvh,.fbx" className="hidden" onChange={(e)=>{
            const f = e.target.files?.[0]; if (f) alert(`Imported mocap: ${f.name}`)
          }} />
        </div>
      </div>
    </aside>
  )
}
