import { useState } from 'react'
import { ChevronDown, ChevronRight, Trash2, Calendar, Weight } from 'lucide-react'
import { formatDate, formatVolume } from '../utils/formatters'
import type { useWorkoutData } from '../hooks/useWorkoutData'
import type { Toast } from './Layout'

type WorkoutDataReturn = ReturnType<typeof useWorkoutData>

interface Props {
  workoutData: WorkoutDataReturn
  addToast: (message: string, type: Toast['type']) => void
}

export function SessionHistory({ workoutData, addToast }: Props) {
  const { sessions, deleteSession } = workoutData
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      deleteSession(id)
      setConfirmDeleteId(null)
      addToast('Session deleted.', 'danger')
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  if (sessions.length === 0) {
    return (
      <div>
        <header className="mb-8">
          <h2 className="font-display font-900 text-4xl tracking-wide text-[#fafafa] uppercase">
            History
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Calendar size={48} className="text-[#1f1f1f] mb-4" />
          <p className="font-display font-700 text-xl text-[#9ca3af] uppercase tracking-wide">No sessions yet</p>
          <p className="font-body text-sm text-[#4b5563] mt-2">Finish a session to see it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="mb-8">
        <h2 className="font-display font-900 text-4xl tracking-wide text-[#fafafa] uppercase">
          History
        </h2>
        <p className="text-[#9ca3af] font-body text-sm mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
      </header>

      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedIds.has(session.id)
          const totalVolume = session.exercises.reduce(
            (sum, log) => sum + log.sets.reduce((s, set) => s + set.weight * set.reps, 0),
            0
          )

          return (
            <div key={session.id} className="bg-[#141414] border border-[#1f1f1f] rounded-md overflow-hidden">
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1a1a] transition-all duration-150"
                onClick={() => toggleExpand(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-[#9ca3af] shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-[#9ca3af] shrink-0" />
                    )}
                    <div>
                      <h3 className="font-display font-700 text-base tracking-wide text-[#fafafa] uppercase">
                        {session.name}
                      </h3>
                      <p className="text-[#9ca3af] font-body text-xs mt-0.5">{formatDate(session.date)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase">Volume</p>
                    <p className="font-body font-600 text-sm text-[#f59e0b]">{formatVolume(totalVolume)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(session.id) }}
                    className={`p-1.5 rounded transition-colors duration-150 ${
                      confirmDeleteId === session.id
                        ? 'bg-[#ef4444] text-white'
                        : 'text-[#9ca3af] hover:text-[#ef4444]'
                    }`}
                    title={confirmDeleteId === session.id ? 'Click again to confirm' : 'Delete session'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Summary row (always visible) */}
              {!isExpanded && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {session.exercises.map((log) => {
                    const best = log.sets.reduce((b, s) => (s.weight > b.weight ? s : b), log.sets[0])
                    return (
                      <span
                        key={log.exerciseId}
                        className="text-xs font-body text-[#9ca3af] bg-[#0a0a0a] border border-[#1f1f1f] px-2 py-1 rounded"
                      >
                        {log.exerciseName}
                        {best && best.weight > 0 && (
                          <span className="ml-1 text-[#fafafa]">
                            — {log.sets.length}×{best.weight}kg
                          </span>
                        )}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-[#1f1f1f]">
                  {session.exercises.map((log, i) => (
                    <div key={log.exerciseId} className={i > 0 ? 'border-t border-[#1f1f1f]' : ''}>
                      <div className="px-5 py-3">
                        <h4 className="font-display font-700 text-sm tracking-wide uppercase text-[#f59e0b] mb-2">
                          {log.exerciseName}
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="text-xs font-body w-full">
                            <thead>
                              <tr className="text-[#9ca3af] uppercase tracking-widest">
                                <th className="text-left pb-1 pr-4">Set</th>
                                <th className="text-left pb-1 pr-4">Weight</th>
                                <th className="text-left pb-1 pr-4">Reps</th>
                                <th className="text-left pb-1 pr-4">RPE</th>
                                <th className="text-left pb-1">Volume</th>
                              </tr>
                            </thead>
                            <tbody>
                              {log.sets.map((set, si) => (
                                <tr key={si} className="text-[#fafafa]">
                                  <td className="pr-4 py-0.5 text-[#9ca3af]">{set.setNumber}</td>
                                  <td className="pr-4 py-0.5">{set.weight} kg</td>
                                  <td className="pr-4 py-0.5">{set.reps}</td>
                                  <td className="pr-4 py-0.5 text-[#9ca3af]">{set.rpe ?? '—'}</td>
                                  <td className="py-0.5 text-[#9ca3af]">{set.weight * set.reps} kg</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {log.notes && (
                          <p className="mt-2 text-xs text-[#9ca3af] italic">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {session.notes && (
                    <div className="px-5 py-3 border-t border-[#1f1f1f]">
                      <p className="text-xs font-display font-600 tracking-widest text-[#9ca3af] uppercase mb-1">Session Notes</p>
                      <p className="text-sm font-body text-[#fafafa]">{session.notes}</p>
                    </div>
                  )}
                  <div className="px-5 py-3 border-t border-[#1f1f1f] flex items-center gap-2 text-[#9ca3af]">
                    <Weight size={14} />
                    <span className="font-body text-xs">Total volume: <span className="text-[#f59e0b] font-600">{formatVolume(totalVolume)}</span></span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
