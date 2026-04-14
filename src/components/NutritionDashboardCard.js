import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNutritionStore } from '@/store/useNutritionStore';
export function NutritionDashboardCard() {
    const navigate = useNavigate();
    const { goals, getTotalsForDate, getCalorieProgress } = useNutritionStore();
    const totals = getTotalsForDate();
    const progress = getCalorieProgress();
    return (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center", children: _jsx(Utensils, { size: 18 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold", children: "\u4ECA\u65E5\u98F2\u98DF" }), _jsx("p", { className: "text-xs text-text-secondary", children: "Nutrition summary" })] })] }), _jsxs(Button, { size: "sm", variant: "ghost", onClick: () => navigate('/nutrition'), children: ["\u67E5\u770B\u8A73\u7D30\u98F2\u98DF\u7D00\u9304 ", _jsx(ArrowRight, { size: 14 })] })] }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-between text-xs font-semibold mb-1", children: [_jsx("span", { children: "\u71B1\u91CF" }), _jsxs("span", { className: "text-text-secondary", children: [_jsx("span", { className: "text-primary font-bold", children: Math.round(totals.calories) }), " / ", goals.calorie_goal, " kcal"] })] }), _jsx("div", { className: "w-full h-2.5 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-accent transition-all", style: { width: `${progress * 100}%` } }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsx(Mini, { label: "\u86CB\u767D\u8CEA", color: "#3B82F6", current: totals.protein_g, goal: goals.protein_goal_g }), _jsx(Mini, { label: "\u78B3\u6C34", color: "#F9A825", current: totals.carbs_g, goal: goals.carbs_goal_g }), _jsx(Mini, { label: "\u8102\u80AA", color: "#F05454", current: totals.fat_g, goal: goals.fat_goal_g })] })] }));
}
function Mini({ label, color, current, goal }) {
    const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-[11px] mb-1", children: [_jsxs("span", { className: "flex items-center gap-1 font-semibold", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full", style: { background: color } }), label] }), _jsxs("span", { className: "text-text-secondary", children: [Math.round(current), "/", goal, "g"] })] }), _jsx("div", { className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full transition-all", style: { width: `${pct}%`, background: color } }) })] }));
}
