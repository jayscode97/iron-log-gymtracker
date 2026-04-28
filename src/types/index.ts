export type ExerciseCategory =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Core'
  | 'Cardio'
  | 'Custom'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  isCustom: boolean
}

export interface SetEntry {
  setNumber: number
  weight: number
  reps: number
  rpe?: number
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: SetEntry[]
  notes?: string
}

export interface WorkoutSession {
  id: string
  date: string
  name: string
  exercises: ExerciseLog[]
  durationMinutes?: number
  notes?: string
}

export interface PersonalRecord {
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  date: string
}

export type ActiveView = 'session' | 'history' | 'progress' | 'library'
