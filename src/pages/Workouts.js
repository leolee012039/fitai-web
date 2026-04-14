import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Play, Sparkles, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ProgressRing';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { defaultWorkoutPlan } from '@/lib/mockData';
import { cn } from '@/lib/utils';
export function WorkoutsPage() {
    const { plan, activeDay, completed, setActiveDay, markComplete, replacePlan } = useWorkoutStore();
    const [generating, setGenerating] = useState(false);
    const today = plan.days.find((d) => d.day === activeDay) ?? plan.days[0];
    const workoutDays = plan.days.filter((d) => d.exercises.length > 0);
    const doneCount = workoutDays.filter((d) => completed[d.day]).length;
    const progress = workoutDays.length ? doneCount / workoutDays.length : 0;
    const generate = () => {
        setGenerating(true);
        setTimeout(() => {
            const next = defaultWorkoutPlan();
            next.ai_generated = true;
            next.days.forEach((d) => d.exercises.forEach((ex) => {
                if (typeof ex.sets === 'number')
                    ex.sets = Math.max(2, ex.sets + (Math.random() > 0.5 ? 1 : -1));
            }));
            replacePlan(next);
            setGenerating(false);
        }, 1400);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold", children: "\u672C\u9031\u8A13\u7DF4" }), _jsxs("p", { className: "text-xs text-text-secondary", children: ["Week of ", plan.week_start] })] }), _jsx(ProgressRing, { progress: progress, size: 80, stroke: 9, label: "\u9032\u5EA6" })] }), _jsx("div", { className: "grid grid-cols-7 gap-2", children: plan.days.map((d) => {
                            const isToday = d.day === activeDay;
                            const isDone = completed[d.day];
                            const isRest = d.exercises.length === 0;
                            return (_jsxs("button", { onClick: () => setActiveDay(d.day), className: cn('p-3 rounded-xl text-center transition border', isToday
                                    ? 'bg-accent text-white border-accent shadow-card'
                                    : isRest
                                        ? 'bg-slate-50 border-border-soft text-text-secondary'
                                        : 'bg-white border-border-soft hover:border-accent/60'), children: [_jsx("div", { className: cn('text-[11px]', isToday ? 'text-white/80' : 'text-text-secondary'), children: d.day }), _jsx("div", { className: "font-bold text-base mt-0.5", children: d.day }), _jsx("div", { className: "mt-1 flex justify-center", children: isDone ? (_jsx(Check, { size: 12, className: isToday ? 'text-white' : 'text-success' })) : (_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full', isToday ? 'bg-white' : isRest ? 'bg-text-muted' : 'bg-accent') })) })] }, d.day));
                        }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-xs text-text-secondary", children: [today.day, " \u00B7 \u4ECA\u65E5\u8A13\u7DF4"] }), _jsx("h3", { className: "text-xl font-bold mt-1", children: today.focus })] }), today.exercises.length > 0 && (_jsx(Button, { variant: completed[today.day] ? 'outline' : 'accent', onClick: () => markComplete(today.day), children: completed[today.day] ? '已完成 ✓' : (_jsxs(_Fragment, { children: [_jsx(Play, { size: 14 }), " \u958B\u59CB\u8A13\u7DF4"] })) }))] }), today.exercises.length === 0 ? (_jsxs("div", { className: "mt-6 p-8 bg-slate-50 rounded-xl text-center", children: [_jsx("div", { className: "text-2xl mb-1", children: "\uD83C\uDF3F" }), _jsx("div", { className: "font-bold", children: "\u4F11\u606F\u65E5" }), _jsx("div", { className: "text-sm text-text-secondary mt-1", children: "\u88DC\u5145\u6C34\u5206\u3001\u8F15\u5EA6\u6D3B\u52D5 20-30 \u5206\u9418\u3002" })] })) : (_jsx("div", { className: "mt-5 space-y-2", children: today.exercises.map((ex) => (_jsx("div", { className: "p-4 rounded-xl border border-border-soft bg-slate-50/60 hover:bg-white hover:border-accent/30 transition", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: ex.name }), _jsxs("div", { className: "text-xs text-text-secondary mt-0.5", children: [ex.sets, " \u00D7 ", ex.reps, " \u00B7 \u7D44\u9593\u4F11\u606F ", ex.rest_seconds, "s"] })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: ex.muscle_groups.map((m) => (_jsx(Badge, { tone: "accent", children: m }, m))) })] }) }, ex.id))) }))] }), _jsxs(Card, { className: "bg-gradient-to-br from-primary to-[#2A3D7A] text-white", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4", children: _jsx(Sparkles, { size: 20 }) }), _jsx("h3", { className: "text-lg font-bold", children: "AI \u8A13\u7DF4\u8A08\u5283\u7522\u751F\u5668" }), _jsx("p", { className: "text-sm text-white/80 mt-2", children: "\u4F9D\u60A8\u7684\u5E74\u9F61\u3001\u9AD4\u91CD\u3001\u6062\u5FA9\u72C0\u614B\u8207\u76EE\u6A19\uFF0C\u7531 Claude \u7522\u751F\u4E00\u9031\u5BA2\u88FD\u5316\u8A13\u7DF4\u3002" }), _jsxs(Button, { variant: "accent", size: "lg", className: "w-full mt-5", onClick: generate, loading: generating, children: [_jsx(Sparkles, { size: 14 }), " AI \u751F\u6210\u8A08\u5283"] }), plan.ai_generated && (_jsx("div", { className: "mt-3 text-[11px] text-white/70 text-center", children: "\u76EE\u524D\u986F\u793A\u70BA AI \u751F\u6210\u8A08\u5283" }))] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold mb-3", children: "\u672C\u9031\u6982\u89BD" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3", children: plan.days.map((d) => (_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "font-bold", children: d.day }), completed[d.day] && _jsx(Check, { size: 14, className: "text-success" })] }), _jsx("div", { className: "text-xs text-text-secondary mt-1 line-clamp-2 min-h-[32px]", children: d.focus }), _jsx("div", { className: "text-[11px] text-text-muted mt-2", children: d.exercises.length > 0 ? `${d.exercises.length} 項動作` : '休息' })] }, d.day))) })] })] }));
}
