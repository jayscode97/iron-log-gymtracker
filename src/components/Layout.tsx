import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { SessionBuilder } from './SessionBuilder'
import { SessionHistory } from './SessionHistory'
import { ProgressView } from './ProgressView'
import { ExerciseLibrary } from './ExerciseLibrary'
import type { ActiveView } from '../types'
import { useWorkoutData } from '../hooks/useWorkoutData'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'pr' | 'info' | 'danger'
}

export function Layout() {
  const [activeView, setActiveView] = useState<ActiveView>('session')
  const [toasts, setToasts] = useState<Toast[]>([])
  const workoutData = useWorkoutData()

  function addToast(message: string, type: Toast['type'] = 'success') {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] font-body">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="ml-56 min-h-screen p-8">
        {activeView === 'session' && (
          <SessionBuilder workoutData={workoutData} addToast={addToast} />
        )}
        {activeView === 'history' && (
          <SessionHistory workoutData={workoutData} addToast={addToast} />
        )}
        {activeView === 'progress' && (
          <ProgressView workoutData={workoutData} />
        )}
        {activeView === 'library' && (
          <ExerciseLibrary workoutData={workoutData} addToast={addToast} />
        )}
      </main>

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`flex items-start gap-3 px-4 py-3 rounded-md shadow-lg cursor-pointer transition-all duration-150 font-body text-sm ${
              toast.type === 'pr'
                ? 'bg-[#f59e0b] text-black font-600'
                : toast.type === 'danger'
                ? 'bg-[#ef4444] text-white'
                : 'bg-[#1f1f1f] border border-[#2a2a2a] text-[#fafafa]'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <span className="text-xs opacity-60 mt-0.5">✕</span>
          </div>
        ))}
      </div>
    </div>
  )
}
