import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, Dumbbell, User, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
const NAV = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/workouts', label: '訓練', icon: Dumbbell },
    { to: '/nutrition', label: '飲食', icon: Utensils },
    { to: '/chat', label: 'AI', icon: MessageCircle },
    { to: '/profile', label: 'Me', icon: User },
];
export function BottomNav() {
    return (_jsx("nav", { className: "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-soft z-20 h-[64px] flex pb-2 pt-1", children: NAV.map((item) => (_jsxs(NavLink, { to: item.to, end: item.to === '/', className: ({ isActive }) => cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold', isActive ? 'text-accent' : 'text-text-secondary'), children: [_jsx(item.icon, { size: 20 }), item.label] }, item.to))) }));
}
