import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { formatShortDate, formatDate } from '../utils/formatters'
import { PRBadge } from './PRBadge'
import type { useWorkoutData } from '../hooks/useWorkoutData'

type WorkoutDataReturn = ReturnType<typeof useWorkoutData>

interface Props {
  workoutData: WorkoutDataReturn
}

const tooltipStyle = {
  backgroundColor: '#141414',
  border: '1px solid #1f1f1f',
  borderRadius: '6px',
  color: '#fafafa',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
}

export function ProgressView({ workoutData }: Props) {
  const { exercises, records, getVolumeHistory } = workoutData
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)
  const record = records.find((r) => r.exerciseId === selectedExerciseId)
  const history = selectedExerciseId ? getVolumeHistory(selectedExerciseId) : []

  const weightData = history.map((h) => ({
    date: formatShortDate(h.date),
    weight: h.maxWeight,
  }))

  const volumeData = history.map((h) => ({
    date: formatShortDate(h.date),
    volume: h.totalVolume,
  }))

  return (
    <div>
      <header className="mb-8">
        <h2 className="font-display font-900 text-4xl tracking-wide text-[#fafafa] uppercase">
          Progress
        </h2>
        <p className="text-[#9ca3af] font-body text-sm mt-1">Track your strength over time</p>
      </header>

      {/* Exercise selector */}
      <div className="mb-8 max-w-sm">
        <label className="block font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase mb-2">
          Select Exercise
        </label>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-md px-4 py-2.5 text-[#fafafa] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-150 cursor-pointer"
        >
          <option value="">— Choose an exercise —</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedExerciseId && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <TrendingUp size={48} className="text-[#1f1f1f] mb-4" />
          <p className="font-display font-700 text-xl text-[#9ca3af] uppercase tracking-wide">
            Select an exercise to view progress
          </p>
        </div>
      )}

      {selectedExercise && (
        <div className="space-y-6">
          {/* PR card */}
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-md p-5">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-display font-700 text-base tracking-wide uppercase text-[#fafafa]">
                {selectedExercise.name}
              </h3>
              {record && <PRBadge />}
            </div>
            {record ? (
              <div className="flex gap-8 mt-3">
                <div>
                  <p className="font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase">Best Weight</p>
                  <p className="font-display font-900 text-3xl text-[#f59e0b] tracking-wide">{record.weight} kg</p>
                </div>
                <div>
                  <p className="font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase">Reps</p>
                  <p className="font-display font-900 text-3xl text-[#fafafa] tracking-wide">{record.reps}</p>
                </div>
                <div>
                  <p className="font-display font-600 text-xs tracking-widest text-[#9ca3af] uppercase">Date</p>
                  <p className="font-body text-sm text-[#9ca3af] mt-2">{formatDate(record.date)}</p>
                </div>
              </div>
            ) : (
              <p className="text-[#9ca3af] font-body text-sm mt-2">No data yet. Log a session to start tracking.</p>
            )}
          </div>

          {history.length > 0 && (
            <>
              {/* Max weight chart */}
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-md p-5">
                <h4 className="font-display font-700 text-sm tracking-widest uppercase text-[#9ca3af] mb-4">
                  Max Weight Over Time
                </h4>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Inter' }}
                      axisLine={{ stroke: '#1f1f1f' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Inter' }}
                      axisLine={false}
                      tickLine={false}
                      unit=" kg"
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v} kg`, 'Max Weight']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#fbbf24' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Volume chart */}
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-md p-5">
                <h4 className="font-display font-700 text-sm tracking-widest uppercase text-[#9ca3af] mb-4">
                  Session Volume Over Time
                </h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={volumeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Inter' }}
                      axisLine={{ stroke: '#1f1f1f' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Inter' }}
                      axisLine={false}
                      tickLine={false}
                      unit=" kg"
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v} kg`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {history.length === 0 && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-md p-8 text-center">
              <p className="text-[#9ca3af] font-body text-sm">
                No sessions recorded for {selectedExercise.name} yet. Log a workout to see charts.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
