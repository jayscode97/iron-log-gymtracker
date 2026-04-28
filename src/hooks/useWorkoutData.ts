import { useLocalStorage } from './useLocalStorage'
import { defaultExercises } from '../data/defaultExercises'
import type { Exercise, WorkoutSession, PersonalRecord, ExerciseCategory } from '../types'

const KEYS = {
  exercises: 'iron-log:exercises',
  sessions: 'iron-log:sessions',
  records: 'iron-log:records',
}

export function useWorkoutData() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(KEYS.exercises, defaultExercises)
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(KEYS.sessions, [])
  const [records, setRecords] = useLocalStorage<PersonalRecord[]>(KEYS.records, [])

  function addCustomExercise(name: string, category: ExerciseCategory) {
    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name,
      category,
      isCustom: true,
    }
    setExercises([...exercises, newEx])
    return newEx
  }

  function saveSession(session: WorkoutSession) {
    setSessions([session, ...sessions])
  }

  function deleteSession(id: string) {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  function checkAndUpdatePR(
    exerciseId: string,
    exerciseName: string,
    weight: number,
    reps: number,
    date: string
  ): boolean {
    const existing = records.find((r) => r.exerciseId === exerciseId)
    if (!existing || weight > existing.weight) {
      const newRecord: PersonalRecord = { exerciseId, exerciseName, weight, reps, date }
      setRecords([...records.filter((r) => r.exerciseId !== exerciseId), newRecord])
      return true
    }
    return false
  }

  function getSessionsForExercise(exerciseId: string): WorkoutSession[] {
    return sessions.filter((s) => s.exercises.some((e) => e.exerciseId === exerciseId))
  }

  function getVolumeHistory(exerciseId: string): { date: string; totalVolume: number; maxWeight: number }[] {
    const relevant = getSessionsForExercise(exerciseId)
    return relevant
      .map((s) => {
        const log = s.exercises.find((e) => e.exerciseId === exerciseId)
        if (!log) return null
        const totalVolume = log.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
        const maxWeight = Math.max(...log.sets.map((set) => set.weight), 0)
        return { date: s.date, totalVolume, maxWeight }
      })
      .filter((x): x is { date: string; totalVolume: number; maxWeight: number } => x !== null)
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return {
    exercises,
    addCustomExercise,
    sessions,
    saveSession,
    deleteSession,
    records,
    checkAndUpdatePR,
    getSessionsForExercise,
    getVolumeHistory,
  }
}
