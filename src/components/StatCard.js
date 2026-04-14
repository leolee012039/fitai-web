import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from './ui/Card';
const trendColor = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-slate-500',
};
const trendArrow = {
    up: '↑',
    down: '↓',
    neutral: '→',
};
export function StatCard({ icon, label, value, unit, delta, note }) {
    return (_jsxs(Card, { accentTop: true, className: "flex flex-col gap-3 pt-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg", children: icon }), _jsx("div", { className: "text-sm text-text-secondary font-medium", children: label })] }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("div", { className: "text-3xl font-bold tracking-tight", children: value }), unit && _jsx("div", { className: "text-sm text-text-secondary", children: unit })] }), delta ? (_jsxs("div", { className: `text-xs font-semibold ${trendColor[delta.trend]}`, children: [delta.value, " ", trendArrow[delta.trend]] })) : note ? (_jsx("div", { className: "text-xs text-text-secondary", children: note })) : null] }));
}
