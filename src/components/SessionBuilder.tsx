import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, X, ChevronDown, ChevronRight, Trash2, CheckCircle } from 'lucide-react'
import type { ExerciseLog, SetEntry, WorkoutSession, ExerciseCategory } from '../types'
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

function defaultSession(): { name: string; exercises: ExerciseLog[]; notes: string } {
  return {
    name: `Session — ${format(new Date(), 'MMM d')}`,
    exercises: [],
    notes: '',
  }
}

export function SessionBuilder({ workoutData, addToast }: Props) {
  const { exercises, saveSession, checkAndUpdatePR } = workoutData
  const [sessionName, setSessionName] = useState(defaultSession().name)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])
  const [sessionNotes, setSessionNotes] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const topRef = useRef<HTMLDivElement>(null)

  function resetBuilder() {
    const d = defaultSession()
    setSessionName(d.name)
    setExerciseLogs([])
    setSessionNotes('')
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function addExercise(exerciseId: string, exerciseName: string) {
    if (exerciseLogs.some((l) => l.exerciseId === exerciseId)) {
      setShowModal(false)
      return
    }
    const newLog: ExerciseLog = {
      exerciseId,
      exerciseName,
      sets: [{ setNumber: 1, weight: 0, reps: 0 }],
      notes: '',
    }
    setExerciseLogs((prev) => [...prev, newLog])
    setShowModal(false)
    addToast(`Added ${exerciseName}`, 'info')
  }

  function removeExercise(exerciseId: string) {
    setExerciseLogs((prev) => prev.filter((l) => l.exerciseId !== exerciseId))
  }

  function updateSet(exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) {
    setExerciseLogs((prev) =>
      prev.map((log) => {
        if (log.exerciseId !== exerciseId) return log
        const newSets = log.sets.map((s, i) => (i === setIndex ? { ...s, [field]: value } : s))
        return { ...log, sets: newSets }
      })
    )
  }

  function addSet(exerciseId: string) {
    setExerciseLogs((prev) =>
      prev.map((log) => {
        if (log.exerciseId !== exerciseId) return log
        const last = log.sets[log.sets.length - 1]
        const newSet: SetEntry = {
          setNumber: log.sets.length + 1,
          weight: last?.weight ?? 0,
          reps: last?.reps ?? 0,
        }
        return { ...log, sets: [...log.sets, newSet] }
      })
    )
  }

  function removeSet(exerciseId: string, setIndex: number) {
    setExerciseLogs((prev) =>
      prev.map((log) => {
        if (log.exerciseId !== exerciseId) return log
        const newSets = log.sets
          .filter((_, i) => i !== setIndex)
          .map((s, i) => ({ ...s, setNumber: i + 1 }))
        return { ...log, sets: newSets }
      })
    )
  }

  function updateExerciseNotes(exerciseId: string, notes: string) {
    setExerciseLogs((prev) =>
      prev.map((log) => (log.exerciseId === exerciseId ? { ...log, notes } : log))
    )
  }

  function finishSession() {
    if (exerciseLogs.length === 0) {
      addToast('Add at least one exercise before finishing.', 'danger')
      return
    }

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: sessionName,
      exercises: exerciseLogs,
      notes: sessionNotes,
    }

    saveSession(session)

    // Check PRs
    const newPRs: string[] = []
    for (const log of exerciseLogs) {
      const bestSet = log.sets.reduce(
        (best, s) => (s.weight > best.weight ? s : best),
        log.sets[0]
      )
      if (bestSet && bestSet.weight > 0) {
        const isNewPR = checkAndUpdatePR(
          log.exerciseId,
          log.exerciseName,
          bestSet.weight,
          bestSet.reps,
          session.date
        )
        if (isNewPR) newPRs.push(log.exerciseName)
      }
    }

    if (newPRs.length > 0) {
      addToast(`New PR${newPRs.length > 1 ? 's' : ''}! ${newPRs.join(', ')}`, 'pr')
    }
    addToast('Session saved!', 'success')
    resetBuilder()
  }

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const grouped = ALL_CATEGORIES.reduce<Record<string, typeof exercises>>((acc, cat) => {
    const items = filteredExercises.filter((e) => e.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div ref={topRef}>
      <header className="mb-8">
        <h2 className="font-display font-900 text-4xl tracking-wide text-[#fafafa] uppercase">
          New Session
        </h2>
        <p className="text-[#9ca3af] font-body text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </header>

      {/* Session name */}
      <div className="mb-6">
        <label className="block font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase mb-2">
          Session Name
        </label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full max-w-md bg-[#141414] border border-[#1f1f1f] rounded-md px-4 py-2.5 text-[#fafafa] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-150"
        />
      </div>

      {/* Exercise list */}
      <div className="space-y-4 mb-6">
        {exerciseLogs.map((log) => (
          <div key={log.exerciseId} className="bg-[#141414] border border-[#1f1f1f] rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
              <h3 className="font-display font-700 text-lg tracking-wide text-[#fafafa] uppercase">
                {log.exerciseName}
              </h3>
              <button
                onClick={() => removeExercise(log.exerciseId)}
                className="text-[#9ca3af] hover:text-[#ef4444] transition-colors duration-150 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sets table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-[#9ca3af] font-500 text-xs uppercase tracking-widest">
                    <th className="px-4 py-2 text-left w-12">Set</th>
                    <th className="px-4 py-2 text-left">Weight (kg)</th>
                    <th className="px-4 py-2 text-left">Reps</th>
                    <th className="px-4 py-2 text-left">RPE</th>
                    <th className="px-4 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {log.sets.map((set, idx) => (
                    <tr key={idx} className="border-t border-[#1f1f1f]">
                      <td className="px-4 py-2 text-[#9ca3af] font-600">{set.setNumber}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weight === 0 ? '' : set.weight}
                          placeholder="0"
                          onChange={(e) => updateSet(log.exerciseId, idx, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-24 bg-[#0a0a0a] border border-[#1f1f1f] rounded px-2 py-1 text-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] transition-all duration-150"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={set.reps === 0 ? '' : set.reps}
                          placeholder="0"
                          onChange={(e) => updateSet(log.exerciseId, idx, 'reps', parseInt(e.target.value) || 0)}
                          className="w-20 bg-[#0a0a0a] border border-[#1f1f1f] rounded px-2 py-1 text-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] transition-all duration-150"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="0.5"
                          value={set.rpe ?? ''}
                          placeholder="—"
                          onChange={(e) => updateSet(log.exerciseId, idx, 'rpe', parseFloat(e.target.value) || 0)}
                          className="w-16 bg-[#0a0a0a] border border-[#1f1f1f] rounded px-2 py-1 text-[#fafafa] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] transition-all duration-150"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => removeSet(log.exerciseId, idx)}
                          disabled={log.sets.length === 1}
                          className="text-[#9ca3af] hover:text-[#ef4444] disabled:opacity-20 transition-colors duration-150"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 flex items-center gap-3 border-t border-[#1f1f1f]">
              <button
                onClick={() => addSet(log.exerciseId)}
                className="flex items-center gap-1.5 text-xs font-display font-600 tracking-wider uppercase text-[#f59e0b] border border-[#f59e0b] px-3 py-1.5 rounded-md hover:bg-[#f59e0b] hover:text-black transition-all duration-150"
              >
                <Plus size={12} />
                Add Set
              </button>
            </div>

            {/* Exercise notes */}
            <div className="px-4 pb-4">
              <input
                type="text"
                value={log.notes ?? ''}
                onChange={(e) => updateExerciseNotes(log.exerciseId, e.target.value)}
                placeholder="Notes for this exercise..."
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded px-3 py-2 text-sm text-[#fafafa] placeholder-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] transition-all duration-150"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add exercise button */}
      <button
        onClick={() => { setShowModal(true); setSearchQuery('') }}
        className="flex items-center gap-2 bg-[#141414] border border-dashed border-[#1f1f1f] hover:border-[#f59e0b] text-[#9ca3af] hover:text-[#f59e0b] px-4 py-3 rounded-md w-full mb-6 transition-all duration-150 font-display font-600 tracking-wide uppercase text-sm"
      >
        <Plus size={16} />
        Add Exercise
      </button>

      {/* Session notes */}
      <div className="mb-8">
        <label className="block font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase mb-2">
          Session Notes
        </label>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="How did the session go?"
          rows={3}
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-md px-4 py-3 text-[#fafafa] font-body text-sm placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] resize-none transition-all duration-150"
        />
      </div>

      {/* Finish button */}
      <button
        onClick={finishSession}
        className="flex items-center gap-2 bg-[#f59e0b] text-black font-display font-700 tracking-wide uppercase px-6 py-3 rounded-md hover:bg-[#fbbf24] transition-all duration-150 text-sm"
      >
        <CheckCircle size={16} />
        Finish Session
      </button>

      {/* Exercise picker modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#141414] border border-[#1f1f1f] rounded-md w-full max-w-lg max-h-[80vh] flex flex-col z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
              <h3 className="font-display font-700 text-lg tracking-wide uppercase">Add Exercise</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9ca3af] hover:text-white transition-colors duration-150">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-[#1f1f1f]">
              <input
                type="text"
                autoFocus
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-md px-4 py-2.5 text-[#fafafa] text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-150"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1f1f1f] rounded-md transition-all duration-150"
                  >
                    <span className="font-display font-700 text-xs tracking-widest uppercase text-[#9ca3af]">
                      {category}
                    </span>
                    {collapsedCategories.has(category) ? (
                      <ChevronRight size={14} className="text-[#9ca3af]" />
                    ) : (
                      <ChevronDown size={14} className="text-[#9ca3af]" />
                    )}
                  </button>
                  {!collapsedCategories.has(category) && (
                    <div className="mt-0.5">
                      {items.map((ex) => {
                        const alreadyAdded = exerciseLogs.some((l) => l.exerciseId === ex.id)
                        return (
                          <button
                            key={ex.id}
                            onClick={() => addExercise(ex.id, ex.name)}
                            disabled={alreadyAdded}
                            className={`w-full text-left px-6 py-2 rounded-md text-sm font-body transition-all duration-150 ${
                              alreadyAdded
                                ? 'text-[#4b5563] cursor-not-allowed'
                                : 'text-[#fafafa] hover:bg-[#f59e0b] hover:text-black'
                            }`}
                          >
                            {ex.name}
                            {alreadyAdded && <span className="ml-2 text-xs text-[#4b5563]">(added)</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
              {Object.keys(grouped).length === 0 && (
                <p className="text-center text-[#9ca3af] py-8 font-body text-sm">No exercises match your search.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
