import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, Dumbbell, FileText, User, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/useProfileStore';

const NAV = [
  { to: '/', label: '儀表板', sub: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: '問問 AI', sub: 'AI Chat', icon: MessageCircle },
  { to: '/workouts', label: '訓練計劃', sub: 'Workouts', icon: Dumbbell },
  { to: '/nutrition', label: '飲食紀錄', sub: 'Nutrition', icon: Utensils },
  { to: '/upload', label: '上傳報告', sub: 'Reports', icon: FileText },
  { to: '/profile', label: '個人檔案', sub: 'Profile', icon: User },
];

export function Sidebar() {
  const user = useProfileStore((s) => s.user);

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-[240px] bg-primary text-white flex-col z-20
                     md:w-[72px] lg:w-[240px] transition-all">
      <div className="px-5 py-6 flex items-center gap-2 md:justify-center lg:justify-start">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold">F</div>
        <div className="hidden lg:block">
          <div className="font-bold tracking-wide">FitAI</div>
          <div className="text-[11px] text-white/60">AI Fitness Platform</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition relative',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
                'md:justify-center lg:justify-start',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-accent" />
                )}
                <item.icon size={18} />
                <span className="hidden lg:block">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 flex items-center gap-3 md:justify-center lg:justify-start">
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold">
          {user.name[0]}
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-semibold">{user.name}</div>
          <div className="text-[11px] text-white/60">{user.email}</div>
        </div>
      </div>
    </aside>
  );
}
