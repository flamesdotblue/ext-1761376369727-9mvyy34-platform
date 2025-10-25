import React from 'react'
import { useAppStore } from '../store'
import { Slider } from '@radix-ui/themes'

export default function RightSidebar() {
  const s = useAppStore()
  const m = s.mesh.material
  const exp = s.export

  const onColor = (e) => s.setMaterial({ color: e.target.value })

  return (
    <aside className="w-88 max-w-[22rem] shrink-0 border-l border-neutral-800 bg-[#0f0f0f] h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <section>
          <div className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Properties</div>
          <div className="space-y-3 p-3 rounded bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-300">
              <label className="text-sm">Mesh Resolution</label>
              <span className="text-xs text-neutral-400">{s.mesh.resolution}</span>
            </div>
            <input type="range" min={0} max={6} step={1} value={s.mesh.resolution} onChange={(e)=>s.setMeshResolution(parseInt(e.target.value))} />
            <div className="flex items-center justify-between text-neutral-300">
              <label className="text-sm">Simplification</label>
              <span className="text-xs text-neutral-400">{(s.mesh.simplify*100).toFixed(0)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={s.mesh.simplify} onChange={(e)=>s.setSimplify(parseFloat(e.target.value))} />
          </div>
        </section>

        <section>
          <div className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Material (PBR)</div>
          <div className="space-y-4 p-3 rounded bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-300">Color</label>
              <input type="color" value={m.color} onChange={onColor} className="w-10 h-6 bg-transparent border border-neutral-700 rounded" />
            </div>
            <div>
              <div className="flex items-center justify-between text-neutral-300"><span>Roughness</span><span className="text-xs text-neutral-400">{m.roughness.toFixed(2)}</span></div>
              <input type="range" min={0} max={1} step={0.01} value={m.roughness} onChange={(e)=>s.setMaterial({ roughness: parseFloat(e.target.value) })} />
            </div>
            <div>
              <div className="flex items-center justify-between text-neutral-300"><span>Metalness</span><span className="text-xs text-neutral-400">{m.metalness.toFixed(2)}</span></div>
              <input type="range" min={0} max={1} step={0.01} value={m.metalness} onChange={(e)=>s.setMaterial({ metalness: parseFloat(e.target.value) })} />
            </div>
            <div>
              <div className="flex items-center justify-between text-neutral-300"><span>Normal Scale</span><span className="text-xs text-neutral-400">{m.normalScale.toFixed(2)}</span></div>
              <input type="range" min={0} max={2} step={0.01} value={m.normalScale} onChange={(e)=>s.setMaterial({ normalScale: parseFloat(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['diffuse','specular','normal','roughness'].map((map)=> (
                <label key={map} className="flex flex-col gap-1 text-neutral-300">
                  <span className="capitalize">{map} map</span>
                  <input type="file" accept="image/*" onChange={(e)=>s.setMaterialMap(map, e.target.files?.[0]||null)} className="text-xs text-neutral-500" />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="text-neutral-400 text-xs uppercase tracking-wider mb-2">AI Parameters</div>
          <div className="space-y-3 p-3 rounded bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-300">
              <label className="text-sm">Interpolation</label>
              <select value={s.animation.interpolation} onChange={(e)=>s.setAnimation({ interpolation: e.target.value })} className="bg-neutral-800 text-neutral-200 rounded px-2 py-1">
                <option value="linear">Linear</option>
                <option value="bezier">Bezier</option>
                <option value="catmull">Catmull-Rom</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <label className="text-sm">Easing</label>
              <select value={s.animation.easing} onChange={(e)=>s.setAnimation({ easing: e.target.value })} className="bg-neutral-800 text-neutral-200 rounded px-2 py-1">
                <option value="linear">Linear</option>
                <option value="easeIn">Ease In</option>
                <option value="easeOut">Ease Out</option>
                <option value="easeInOut">Ease In-Out</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400">Timeline: {s.animation.time.toFixed(2)}s / {s.animation.duration.toFixed(1)}s</label>
              <input type="range" min={0} max={s.animation.duration} step={0.01} value={s.animation.time} onChange={(e)=>s.setAnimation({ time: parseFloat(e.target.value) })} />
            </div>
          </div>
        </section>

        <section>
          <div className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Export</div>
          <div className="space-y-3 p-3 rounded bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-300">
              <label className="text-sm">Format</label>
              <select value={exp.format} onChange={(e)=>s.exportSettings({ format: e.target.value })} className="bg-neutral-800 text-neutral-200 rounded px-2 py-1">
                <option value="gltf">glTF</option>
                <option value="fbx">FBX</option>
                <option value="obj">OBJ</option>
                <option value="stl">STL</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400">Polygon Count Target: {exp.polyCount}k</label>
              <input type="range" min={10} max={1000} step={10} value={exp.polyCount} onChange={(e)=>s.exportSettings({ polyCount: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Texture Resolution: {exp.texResolution}px</label>
              <input type="range" min={256} max={8192} step={256} value={exp.texResolution} onChange={(e)=>s.exportSettings({ texResolution: parseInt(e.target.value) })} />
            </div>
            <button onClick={()=>window.dispatchEvent(new CustomEvent('export-scene'))} className="w-full py-2 rounded bg-teal-600 text-white hover:bg-teal-500">Export</button>
          </div>
        </section>
      </div>
    </aside>
  )
}
