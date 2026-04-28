import { Dumbbell, History, TrendingUp, BookOpen } from 'lucide-react'
import type { ActiveView } from '../types'

interface SidebarProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
}

const navItems: { view: ActiveView; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { view: 'session', label: 'New Session', Icon: Dumbbell },
  { view: 'history', label: 'History', Icon: History },
  { view: 'progress', label: 'Progress', Icon: TrendingUp },
  { view: 'library', label: 'Exercise Library', Icon: BookOpen },
]

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col bg-[#141414] border-r border-[#1f1f1f] z-10">
      <div className="px-6 py-6 border-b border-[#1f1f1f]">
        <h1 className="font-display font-black text-2xl tracking-widest text-[#f59e0b] uppercase">
          Iron Log
        </h1>
        <p className="font-display text-xs tracking-wider text-[#9ca3af] mt-0.5 uppercase">
          Gym Tracker
        </p>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map(({ view, label, Icon }) => {
          const isActive = activeView === view
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150 font-display font-600 text-sm tracking-wide uppercase ${
                isActive
                  ? 'bg-[#f59e0b] text-black'
                  : 'text-[#9ca3af] hover:bg-[#1f1f1f] hover:text-[#fafafa]'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-[#1f1f1f]">
        <p className="font-body text-xs text-[#9ca3af]">All data stored locally</p>
      </div>
    </aside>
  )
}
