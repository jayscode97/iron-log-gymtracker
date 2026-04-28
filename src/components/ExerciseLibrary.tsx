import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { PRBadge } from './PRBadge'
import type { ExerciseCategory } from '../types'
import type { useWorkoutData } from '../hooks/useWorkoutData'
import type { Toast } from './Layout'

type WorkoutDataReturn = ReturnType<typeof useWorkoutData>

interface Props {
  workoutData: WorkoutDataReturn
  addToast: (message: string, type: Toast['type']) => void
}

const ALL_CATEGORIES: ExerciseCategory[] = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Cardio', 'Custom',
]

export function ExerciseLibrary({ workoutData, addToast }: Props) {
  const { exercises, records, addCustomExercise } = workoutData
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<ExerciseCategory>('Custom')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function handleAddCustom() {
    if (!newName.trim()) return
    addCustomExercise(newName.trim(), newCategory)
    addToast(`Added "${newName.trim()}" to library.`, 'success')
    setNewName('')
    setNewCategory('Custom')
    setShowForm(false)
  }

  const grouped = ALL_CATEGORIES.reduce<Record<string, typeof exercises>>((acc, cat) => {
    const items = exercises.filter((e) => e.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="font-display font-900 text-4xl tracking-wide text-[#fafafa] uppercase">
            Exercise Library
          </h2>
          <p className="text-[#9ca3af] font-body text-sm mt-1">{exercises.length} exercises available</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-[#f59e0b] text-black font-display font-700 tracking-wide uppercase px-4 py-2.5 rounded-md hover:bg-[#fbbf24] transition-all duration-150 text-sm mt-1"
        >
          <Plus size={14} />
          Add Custom
        </button>
      </header>

      {/* Add custom form */}
      {showForm && (
        <div className="bg-[#141414] border border-[#f59e0b]/30 rounded-md p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-700 text-sm tracking-widest uppercase text-[#f59e0b]">
              New Custom Exercise
            </h3>
            <button onClick={() => setShowForm(false)} className="text-[#9ca3af] hover:text-white transition-colors duration-150">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Exercise name"
              className="flex-1 min-w-48 bg-[#0a0a0a] border border-[#1f1f1f] rounded-md px-4 py-2.5 text-[#fafafa] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-150"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ExerciseCategory)}
              className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-md px-4 py-2.5 text-[#fafafa] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-150 cursor-pointer"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={handleAddCustom}
              disabled={!newName.trim()}
              className="bg-[#f59e0b] text-black font-display font-700 tracking-wide uppercase px-4 py-2.5 rounded-md hover:bg-[#fbbf24] disabled:opacity-40 transition-all duration-150 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Exercise groups */}
      <div className="space-y-2">
        {Object.entries(grouped).map(([category, items]) => {
          const isCollapsed = collapsedCategories.has(category)
          return (
            <div key={category} className="bg-[#141414] border border-[#1f1f1f] rounded-md overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#1a1a1a] transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-700 text-sm tracking-widest uppercase text-[#fafafa]">
                    {category}
                  </span>
                  <span className="font-body text-xs text-[#9ca3af]">
                    {items.length} exercise{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-[#9ca3af] text-xs font-display uppercase tracking-wider">
                  {isCollapsed ? '▶' : '▼'}
                </span>
              </button>

              {!isCollapsed && (
                <div className="border-t border-[#1f1f1f] divide-y divide-[#1f1f1f]">
                  {items.map((ex) => {
                    const pr = records.find((r) => r.exerciseId === ex.id)
                    return (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-body text-sm ${
                              ex.isCustom ? 'text-[#f59e0b]' : 'text-[#fafafa]'
                            }`}
                          >
                            {ex.name}
                          </span>
                          {ex.isCustom && (
                            <span className="text-xs font-display font-600 tracking-wider uppercase text-[#9ca3af] border border-[#1f1f1f] px-1.5 py-0.5 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {pr && (
                            <span className="text-xs text-[#9ca3af] font-body">
                              {pr.weight} kg × {pr.reps}
                            </span>
                          )}
                          {pr && <PRBadge />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
