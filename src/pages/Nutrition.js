import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplet, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ProgressRing';
import { AddFoodModal } from '@/components/nutrition/AddFoodModal';
import { useNutritionStore } from '@/store/useNutritionStore';
import { cn } from '@/lib/utils';
const MEAL_SECTIONS = [
    { key: 'breakfast', label: '早餐', icon: '🍳' },
    { key: 'lunch', label: '午餐', icon: '🍱' },
    { key: 'dinner', label: '晚餐', icon: '🍽' },
    { key: 'snack', label: '點心', icon: '🍪' },
];
export function NutritionPage() {
    const navigate = useNavigate();
    const { selectedDate, goals, setSelectedDate, fetchLogsForDate, getMealsGroupedForDate, getTotalsForDate, getCalorieProgress, getWaterForDate, addWater, removeFoodLog, } = useNutritionStore();
    const [modalMeal, setModalMeal] = useState(null);
    useEffect(() => {
        fetchLogsForDate(selectedDate);
    }, [selectedDate, fetchLogsForDate]);
    const totals = getTotalsForDate();
    const progress = getCalorieProgress();
    const grouped = getMealsGroupedForDate();
    const water = getWaterForDate();
    const aiInsight = useMemo(() => buildInsight(totals, goals), [totals, goals]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\u4ECA\u65E5\u98F2\u98DF" }), _jsx("p", { className: "text-xs text-text-secondary mt-0.5", children: "\u8A18\u9304\u6BCF\u4E00\u9910\uFF0C\u8B93 AI \u5E6B\u60A8\u5206\u6790\u71DF\u990A" })] }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), max: new Date().toISOString().slice(0, 10), className: "px-3 py-2 rounded-lg border border-border-soft bg-white text-sm" }), _jsxs("div", { className: "px-4 py-2 rounded-full bg-accent text-white font-bold text-sm shadow-soft", children: ["\u5DF2\u651D\u53D6 ", Math.round(totals.calories), " / ", goals.calorie_goal, " kcal"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [_jsxs("div", { className: "shrink-0", children: [_jsx(ProgressRing, { progress: progress, size: 160, stroke: 14, label: "\u71B1\u91CF" }), _jsxs("div", { className: "text-center mt-2 text-xs text-text-secondary", children: ["\u9084\u5269 ", Math.max(0, goals.calorie_goal - Math.round(totals.calories)), " kcal"] })] }), _jsxs("div", { className: "flex-1 w-full space-y-3", children: [_jsx(MacroBar, { label: "\u86CB\u767D\u8CEA", color: "#3B82F6", current: totals.protein_g, goal: goals.protein_goal_g, unit: "g" }), _jsx(MacroBar, { label: "\u78B3\u6C34", color: "#F9A825", current: totals.carbs_g, goal: goals.carbs_goal_g, unit: "g" }), _jsx(MacroBar, { label: "\u8102\u80AA", color: "#F05454", current: totals.fat_g, goal: goals.fat_goal_g, unit: "g" }), _jsxs("div", { className: "mt-4 flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100", children: [_jsx(Droplet, { size: 18, className: "text-blue-500" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between text-xs font-semibold mb-1", children: [_jsxs("span", { children: ["\u98F2\u6C34 ", water, " ml"] }), _jsxs("span", { className: "text-text-secondary", children: ["\u76EE\u6A19 ", goals.water_goal_ml, " ml"] })] }), _jsx("div", { className: "w-full h-2 bg-blue-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500 transition-all", style: { width: `${Math.min(100, (water / goals.water_goal_ml) * 100)}%` } }) })] }), _jsxs(Button, { size: "sm", variant: "subtle", onClick: () => addWater(250), children: [_jsx(Plus, { size: 12 }), " 250ml"] })] })] })] }) }), _jsx(Card, { className: "border-l-4 border-accent", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0", children: _jsx(Sparkles, { size: 18 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold mb-1", children: "AI \u6D1E\u5BDF" }), _jsx("p", { className: "text-sm text-primary/90 leading-relaxed", children: aiInsight }), _jsxs(Button, { variant: "outline", size: "sm", className: "mt-3", onClick: () => navigate('/chat?topic=nutrition'), children: [_jsx(MessageCircle, { size: 14 }), " \u554F\u66F4\u591A"] })] })] }) }), _jsx("div", { className: "space-y-4", children: MEAL_SECTIONS.map((m) => {
                                    const list = grouped[m.key];
                                    const total = list.reduce((a, b) => a + b.calories, 0);
                                    return (_jsxs(Card, { padded: false, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-soft/60", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-2xl", children: m.icon }), _jsxs("div", { children: [_jsx("div", { className: "font-bold", children: m.label }), _jsx("div", { className: "text-xs text-text-secondary", children: list.length > 0 ? `${list.length} 項 · ${Math.round(total)} kcal` : '尚未記錄' })] })] }), _jsxs(Button, { size: "sm", variant: "accent", onClick: () => setModalMeal(m.key), children: [_jsx(Plus, { size: 12 }), " \u65B0\u589E"] })] }), list.length > 0 && (_jsx("div", { className: "divide-y divide-border-soft/60", children: list.map((l) => (_jsx(LogRow, { log: l, onRemove: () => removeFoodLog(l.log_id ?? l.id) }, l.log_id ?? l.id))) }))] }, m.key));
                                }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx("h3", { className: "font-bold mb-3", children: "\u4ECA\u65E5\u76EE\u6A19" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsx(GoalRow, { label: "\u71B1\u91CF", current: Math.round(totals.calories), goal: goals.calorie_goal, unit: "kcal" }), _jsx(GoalRow, { label: "\u86CB\u767D\u8CEA", current: Math.round(totals.protein_g), goal: goals.protein_goal_g, unit: "g" }), _jsx(GoalRow, { label: "\u78B3\u6C34", current: Math.round(totals.carbs_g), goal: goals.carbs_goal_g, unit: "g" }), _jsx(GoalRow, { label: "\u8102\u80AA", current: Math.round(totals.fat_g), goal: goals.fat_goal_g, unit: "g" }), _jsx(GoalRow, { label: "\u98F2\u6C34", current: Math.round(water), goal: goals.water_goal_ml, unit: "ml" })] }), _jsxs("div", { className: "mt-4 text-[11px] text-text-secondary", children: ["\u76EE\u6A19\u985E\u578B\uFF1A", _jsx(Badge, { tone: "accent", className: "ml-1", children: goals.goal_type === 'lose_fat' ? '減脂' : goals.goal_type === 'gain_muscle' ? '增肌' : '維持' })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "font-bold mb-3", children: "\u672C\u9031\u6982\u89BD" }), _jsx("p", { className: "text-xs text-text-secondary", children: "\u6301\u7E8C\u8A18\u9304\u8B93 AI \u66F4\u7CBE\u6E96\u5206\u6790\u8DA8\u52E2" }), _jsxs("ul", { className: "mt-3 space-y-2 text-xs", children: [_jsxs("li", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u5DF2\u8A18\u9304\u5929\u6578" }), _jsx("span", { className: "font-bold", children: "3 / 7" })] }), _jsxs("li", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u5E73\u5747\u71B1\u91CF" }), _jsx("span", { className: "font-bold", children: "1,840 kcal" })] }), _jsxs("li", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u5E73\u5747\u86CB\u767D\u8CEA" }), _jsx("span", { className: "font-bold", children: "118 g" })] })] })] })] })] }), modalMeal && _jsx(AddFoodModal, { meal: modalMeal, onClose: () => setModalMeal(null) })] }));
}
function MacroBar({ label, color, current, goal, unit, }) {
    const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs font-semibold mb-1", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: color } }), label] }), _jsxs("span", { className: "text-text-secondary", children: [_jsx("span", { className: "text-primary font-bold", children: current.toFixed(1) }), " / ", goal, " ", unit] })] }), _jsx("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full transition-all", style: { width: `${pct}%`, background: color } }) })] }));
}
function GoalRow({ label, current, goal, unit, }) {
    const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: label }), _jsxs("span", { className: "font-bold", children: [current, _jsxs("span", { className: "text-text-secondary", children: [" / ", goal, " ", unit] })] })] }), _jsx("div", { className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1", children: _jsx("div", { className: "h-full bg-accent", style: { width: `${pct}%` } }) })] }));
}
function LogRow({ log, onRemove }) {
    const [deleting, setDeleting] = useState(false);
    return (_jsxs("div", { className: cn('flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition', deleting && 'opacity-40 pointer-events-none'), children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-semibold truncate", children: log.food_name || log.name_zh }), _jsxs("div", { className: "text-[11px] text-text-secondary", children: [log.serving_size ?? '', " \u00B7 P ", log.protein_g.toFixed(0), "g \u00B7 C ", log.carbs_g.toFixed(0), "g \u00B7 F ", log.fat_g.toFixed(0), "g", log.source === 'photo_ai' && (_jsx("span", { className: "ml-1.5 text-accent", children: "\u00B7 \uD83D\uDCF7 AI" }))] })] }), _jsxs("div", { className: "text-sm font-bold", children: [Math.round(log.calories), " kcal"] }), _jsx("button", { onClick: () => {
                    setDeleting(true);
                    onRemove();
                }, className: "text-text-muted hover:text-red-500 p-1", "aria-label": "\u522A\u9664", children: _jsx(Trash2, { size: 14 }) })] }));
}
function buildInsight(totals, goals) {
    if (totals.calories === 0) {
        return '今天還沒記錄飲食。記錄您的第一餐，AI 會根據您的訓練與營養目標提供建議。';
    }
    const proteinGap = goals.protein_goal_g - totals.protein_g;
    const calGap = goals.calorie_goal - totals.calories;
    if (proteinGap > 30) {
        return `今天練腿消耗約 450 kcal，蛋白質攝取不足 (${Math.round(totals.protein_g)}g / ${goals.protein_goal_g}g)，建議在晚餐補充雞胸肉或豆腐。還可攝取 ${Math.round(calGap)} kcal。`;
    }
    if (totals.calories > goals.calorie_goal) {
        return `今日熱量已達標。考慮增加活動量 (20 分鐘快走) 或將晚餐改為清淡的蛋白質與蔬菜組合。`;
    }
    return `目前進度良好！已攝取 ${Math.round(totals.calories)} kcal，蛋白質 ${Math.round(totals.protein_g)}g。保持均衡比例，並記得補充水分。`;
}
