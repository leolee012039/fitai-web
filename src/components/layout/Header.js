import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useHealthStore } from '@/store/useHealthStore';
import { formatTime } from '@/lib/utils';
const TITLES = {
    '/': { title: '儀表板', sub: '今日健康數據' },
    '/chat': { title: '問問 AI', sub: 'AI 健康助理' },
    '/workouts': { title: '訓練計劃', sub: 'AI 個人化訓練' },
    '/nutrition': { title: '飲食紀錄', sub: '今日營養攝取' },
    '/upload': { title: '上傳報告', sub: 'AI 健康報告分析' },
    '/profile': { title: '個人檔案', sub: '帳號與偏好設定' },
};
export function Header() {
    const location = useLocation();
    const t = TITLES[location.pathname] ?? { title: 'FitAI', sub: '' };
    const { appleHealthConnected, lastSyncedAt, sync } = useHealthStore();
    return (_jsx("header", { className: "sticky top-0 z-10 bg-white border-b border-border-soft/60 shadow-header", children: _jsxs("div", { className: "px-5 lg:px-8 h-[72px] flex items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-xl font-bold text-primary", children: t.title }), t.sub && _jsx("p", { className: "text-xs text-text-secondary mt-0.5", children: t.sub })] }), _jsxs("button", { className: "relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-text-secondary", "aria-label": "\u901A\u77E5", children: [_jsx(Bell, { size: 18 }), _jsx("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" })] }), _jsxs(Button, { variant: "subtle", size: "sm", onClick: sync, className: "gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${appleHealthConnected ? 'bg-success' : 'bg-slate-400'}` }), _jsx(RefreshCw, { size: 12 }), _jsx("span", { className: "hidden sm:inline", children: lastSyncedAt ? `已同步 ${formatTime(lastSyncedAt)}` : '重新同步' })] })] }) }));
}
