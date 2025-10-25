import React from 'react'
import { useAppStore } from '../store'
import { Save, Undo2, Redo2, FileOutput, Share2, Info, Play, Pause, Settings } from 'lucide-react'

export default function TopBar() {
  const {
    undo, redo, pushHistory,
    animation, setAnimation,
  } = useAppStore((s) => ({
    undo: s.undo,
    redo: s.redo,
    pushHistory: s.pushHistory,
    animation: s.animation,
    setAnimation: s.setAnimation,
  }))

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return (
    <div className="flex items-center justify-between px-4 h-12 border-b border-neutral-800 bg-[#121212]/95 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/80">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-teal-400" />
        <span className="font-semibold text-neutral-200">AstraMesh Studio</span>
        <span className="text-xs text-neutral-500">AI 3D Modeling</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={pushHistory} className="px-2 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800">Snapshot</button>
        <div className="h-6 w-px bg-neutral-800" />
        <button onClick={() => useAppStore.getState().undo()} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          <Undo2 size={16} /> Undo
        </button>
        <button onClick={() => useAppStore.getState().redo()} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          <Redo2 size={16} /> Redo
        </button>
        <div className="h-6 w-px bg-neutral-800" />
        <button onClick={() => setAnimation({ playing: !animation.playing })} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          {animation.playing ? <Pause size={16} /> : <Play size={16} />} {animation.playing ? 'Pause' : 'Play'}
        </button>
        <div className="h-6 w-px bg-neutral-800" />
        <button className="flex items-center gap-1 px-2 py-1 rounded bg-teal-600/20 text-teal-300 hover:bg-teal-500/30">
          <Save size={16} /> Save
        </button>
        <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          <FileOutput size={16} /> Export
        </button>
        <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          <Share2 size={16} /> Share
        </button>
        <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300">
          <Settings size={16} />
        </button>
        <button className="ml-2 text-neutral-400 hover:text-neutral-200">
          <Info size={16} />
        </button>
      </div>
    </div>
  )
}
