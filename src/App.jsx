import React from 'react'
import TopBar from './components/TopBar'
import LeftSidebar from './components/LeftSidebar'
import Viewport from './components/Viewport'
import RightSidebar from './components/RightSidebar'
import { useAppStore } from './store'
import { HelpCircle } from 'lucide-react'

export default function App() {
  const [showHelp, setShowHelp] = React.useState(false)
  const s = useAppStore()

  return (
    <div className="h-dvh w-dvw flex flex-col bg-[#121212] text-neutral-100">
      <TopBar />
      <div className="flex-1 min-h-0 flex">
        <LeftSidebar />
        <Viewport />
        <RightSidebar />
      </div>

      <button onClick={()=>setShowHelp(true)} className="fixed bottom-4 right-4 rounded-full bg-teal-600 hover:bg-teal-500 text-white p-3 shadow-lg">
        <HelpCircle />
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-neutral-200">Quick Tutorial</div>
              <button onClick={()=>setShowHelp(false)} className="text-neutral-400 hover:text-neutral-200">Close</button>
            </div>
            <ol className="list-decimal list-inside text-sm space-y-2 text-neutral-300">
              <li>Use Text to 3D or Image to 3D in the left panel to generate a base model. You can adjust style, complexity, and reconstruction parameters.</li>
              <li>Sculpt and paint your model using brush tools. Toggle non-destructive mode to keep edits reversible. Layers can be toggled on/off.</li>
              <li>Add a rig with bones and IK, then animate using the timeline and keyframes. You can also import motion capture data (BVH/FBX).</li>
              <li>Adjust materials using a full PBR workflow on the right panel. Tweak roughness, metalness, normal scale, and add texture maps.</li>
              <li>Export your model to OBJ, FBX, STL, or glTF with custom polygon and texture settings. Use Undo/Redo (Ctrl/Cmd+Z, Shift+Cmd/Ctrl+Z).</li>
              <li>Performance: LOD and frustum culling are active. For heavy scenes, lower mesh resolution or increase simplification.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
