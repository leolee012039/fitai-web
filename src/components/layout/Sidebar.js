import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    return (_jsxs("aside", { className: "hidden md:flex fixed inset-y-0 left-0 w-[240px] bg-primary text-white flex-col z-20\n                     md:w-[72px] lg:w-[240px] transition-all", children: [_jsxs("div", { className: "px-5 py-6 flex items-center gap-2 md:justify-center lg:justify-start", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold", children: "F" }), _jsxs("div", { className: "hidden lg:block", children: [_jsx("div", { className: "font-bold tracking-wide", children: "FitAI" }), _jsx("div", { className: "text-[11px] text-white/60", children: "AI Fitness Platform" })] })] }), _jsx("nav", { className: "flex-1 px-3 py-2 space-y-1", children: NAV.map((item) => (_jsx(NavLink, { to: item.to, end: item.to === '/', className: ({ isActive }) => cn('group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition relative', isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white', 'md:justify-center lg:justify-start'), children: ({ isActive }) => (_jsxs(_Fragment, { children: [isActive && (_jsx("span", { className: "absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-accent" })), _jsx(item.icon, { size: 18 }), _jsx("span", { className: "hidden lg:block", children: item.label })] })) }, item.to))) }), _jsxs("div", { className: "p-3 border-t border-white/10 flex items-center gap-3 md:justify-center lg:justify-start", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold", children: user.name[0] }), _jsxs("div", { className: "hidden lg:block", children: [_jsx("div", { className: "text-sm font-semibold", children: user.name }), _jsx("div", { className: "text-[11px] text-white/60", children: user.email })] })] })] }));
}
