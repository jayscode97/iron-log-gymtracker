import type { Exercise } from '../types'

export const defaultExercises: Exercise[] = [
  // Chest
  { id: 'ex-bench-press', name: 'Bench Press', category: 'Chest', isCustom: false },
  { id: 'ex-incline-bench', name: 'Incline Bench Press', category: 'Chest', isCustom: false },
  { id: 'ex-decline-bench', name: 'Decline Bench Press', category: 'Chest', isCustom: false },
  { id: 'ex-db-fly', name: 'Dumbbell Fly', category: 'Chest', isCustom: false },
  { id: 'ex-cable-crossover', name: 'Cable Crossover', category: 'Chest', isCustom: false },
  { id: 'ex-push-up', name: 'Push-Up', category: 'Chest', isCustom: false },
  { id: 'ex-chest-dips', name: 'Dips (Chest)', category: 'Chest', isCustom: false },

  // Back
  { id: 'ex-deadlift', name: 'Deadlift', category: 'Back', isCustom: false },
  { id: 'ex-pull-up', name: 'Pull-Up', category: 'Back', isCustom: false },
  { id: 'ex-lat-pulldown', name: 'Lat Pulldown', category: 'Back', isCustom: false },
  { id: 'ex-seated-cable-row', name: 'Seated Cable Row', category: 'Back', isCustom: false },
  { id: 'ex-barbell-row', name: 'Barbell Row', category: 'Back', isCustom: false },
  { id: 'ex-tbar-row', name: 'T-Bar Row', category: 'Back', isCustom: false },
  { id: 'ex-face-pull', name: 'Face Pull', category: 'Back', isCustom: false },
  { id: 'ex-shrug', name: 'Shrug', category: 'Back', isCustom: false },

  // Shoulders
  { id: 'ex-ohp', name: 'Overhead Press', category: 'Shoulders', isCustom: false },
  { id: 'ex-arnold-press', name: 'Arnold Press', category: 'Shoulders', isCustom: false },
  { id: 'ex-lateral-raise', name: 'Lateral Raise', category: 'Shoulders', isCustom: false },
  { id: 'ex-front-raise', name: 'Front Raise', category: 'Shoulders', isCustom: false },
  { id: 'ex-rear-delt-fly', name: 'Rear Delt Fly', category: 'Shoulders', isCustom: false },
  { id: 'ex-upright-row', name: 'Upright Row', category: 'Shoulders', isCustom: false },

  // Biceps
  { id: 'ex-barbell-curl', name: 'Barbell Curl', category: 'Biceps', isCustom: false },
  { id: 'ex-db-curl', name: 'Dumbbell Curl', category: 'Biceps', isCustom: false },
  { id: 'ex-hammer-curl', name: 'Hammer Curl', category: 'Biceps', isCustom: false },
  { id: 'ex-preacher-curl', name: 'Preacher Curl', category: 'Biceps', isCustom: false },
  { id: 'ex-concentration-curl', name: 'Concentration Curl', category: 'Biceps', isCustom: false },
  { id: 'ex-cable-curl', name: 'Cable Curl', category: 'Biceps', isCustom: false },

  // Triceps
  { id: 'ex-skull-crusher', name: 'Skull Crusher', category: 'Triceps', isCustom: false },
  { id: 'ex-tricep-pushdown', name: 'Tricep Pushdown', category: 'Triceps', isCustom: false },
  { id: 'ex-overhead-tri-ext', name: 'Overhead Tricep Extension', category: 'Triceps', isCustom: false },
  { id: 'ex-cgbp', name: 'Close-Grip Bench Press', category: 'Triceps', isCustom: false },
  { id: 'ex-tri-dips', name: 'Dips (Triceps)', category: 'Triceps', isCustom: false },

  // Legs
  { id: 'ex-squat', name: 'Squat', category: 'Legs', isCustom: false },
  { id: 'ex-rdl', name: 'Romanian Deadlift', category: 'Legs', isCustom: false },
  { id: 'ex-leg-press', name: 'Leg Press', category: 'Legs', isCustom: false },
  { id: 'ex-leg-curl', name: 'Leg Curl', category: 'Legs', isCustom: false },
  { id: 'ex-leg-extension', name: 'Leg Extension', category: 'Legs', isCustom: false },
  { id: 'ex-calf-raise', name: 'Calf Raise', category: 'Legs', isCustom: false },
  { id: 'ex-bulgarian-split', name: 'Bulgarian Split Squat', category: 'Legs', isCustom: false },
  { id: 'ex-hip-thrust', name: 'Hip Thrust', category: 'Legs', isCustom: false },
  { id: 'ex-hack-squat', name: 'Hack Squat', category: 'Legs', isCustom: false },

  // Core
  { id: 'ex-plank', name: 'Plank', category: 'Core', isCustom: false },
  { id: 'ex-crunch', name: 'Crunch', category: 'Core', isCustom: false },
  { id: 'ex-russian-twist', name: 'Russian Twist', category: 'Core', isCustom: false },
  { id: 'ex-hanging-leg-raise', name: 'Hanging Leg Raise', category: 'Core', isCustom: false },
  { id: 'ex-ab-wheel', name: 'Ab Wheel Rollout', category: 'Core', isCustom: false },
  { id: 'ex-cable-crunch', name: 'Cable Crunch', category: 'Core', isCustom: false },

  // Cardio
  { id: 'ex-treadmill', name: 'Treadmill', category: 'Cardio', isCustom: false },
  { id: 'ex-stationary-bike', name: 'Stationary Bike', category: 'Cardio', isCustom: false },
  { id: 'ex-rowing-machine', name: 'Rowing Machine', category: 'Cardio', isCustom: false },
  { id: 'ex-jump-rope', name: 'Jump Rope', category: 'Cardio', isCustom: false },
  { id: 'ex-stairmaster', name: 'Stairmaster', category: 'Cardio', isCustom: false },
]
