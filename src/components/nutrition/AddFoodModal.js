import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Camera, Search, Pencil, X, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNutritionStore } from '@/store/useNutritionStore';
import { searchFoods } from '@/lib/taiwaneseFoods';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';
const MEAL_LABELS = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '點心',
};
export function AddFoodModal({ meal, onClose }) {
    const [tab, setTab] = useState('search');
    const addFood = useNutritionStore((s) => s.addFoodLog);
    const analyze = useNutritionStore((s) => s.analyzePhotoWithAI);
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6 animate-in fade-in", onClick: onClose, children: _jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-white w-full lg:max-w-2xl rounded-t-3xl lg:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border-soft", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: "\u65B0\u589E\u98DF\u7269" }), _jsxs("p", { className: "text-xs text-text-secondary", children: ["\u52A0\u5165\u5230\u300C", MEAL_LABELS[meal], "\u300D"] })] }), _jsx("button", { onClick: onClose, className: "w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center", "aria-label": "\u95DC\u9589", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex border-b border-border-soft px-4", children: [_jsx(TabButton, { active: tab === 'photo', onClick: () => setTab('photo'), icon: _jsx(Camera, { size: 14 }), children: "\u62CD\u7167\u8FA8\u8B58" }), _jsx(TabButton, { active: tab === 'search', onClick: () => setTab('search'), icon: _jsx(Search, { size: 14 }), children: "\u641C\u5C0B\u98DF\u7269" }), _jsx(TabButton, { active: tab === 'manual', onClick: () => setTab('manual'), icon: _jsx(Pencil, { size: 14 }), children: "\u624B\u52D5\u8F38\u5165" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [tab === 'photo' && (_jsx(PhotoTab, { onConfirm: async (food) => {
                                await addFood(meal, {
                                    name_zh: food.name_zh,
                                    name_en: food.name_en,
                                    serving_size: food.serving_size,
                                    calories: food.calories,
                                    protein_g: food.protein_g,
                                    carbs_g: food.carbs_g,
                                    fat_g: food.fat_g,
                                    source: 'photo_ai',
                                    ai_confidence: food.confidence,
                                });
                                onClose();
                            }, analyze: analyze })), tab === 'search' && (_jsx(SearchTab, { onPick: async (f, qty) => {
                                await addFood(meal, {
                                    name_zh: f.name_zh,
                                    name_en: f.name_en,
                                    serving_size: qty > 1 ? `${f.serving_size} × ${qty}` : f.serving_size,
                                    calories: f.calories * qty,
                                    protein_g: f.protein_g * qty,
                                    carbs_g: f.carbs_g * qty,
                                    fat_g: f.fat_g * qty,
                                    source: 'search',
                                });
                                onClose();
                            } })), tab === 'manual' && (_jsx(ManualTab, { onSubmit: async (food) => {
                                await addFood(meal, { ...food, source: 'manual' });
                                onClose();
                            } }))] })] }) }));
}
function TabButton({ active, onClick, children, icon, }) {
    return (_jsxs("button", { onClick: onClick, className: cn('flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 -mb-px transition', active ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-primary'), children: [icon, children] }));
}
/* ------------------------- Photo tab ------------------------- */
function PhotoTab({ onConfirm, analyze, }) {
    const fileRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    useEffect(() => {
        let stream = null;
        if (cameraOn && videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: 'environment' } })
                .then((s) => {
                stream = s;
                if (videoRef.current)
                    videoRef.current.srcObject = s;
            })
                .catch(() => setCameraOn(false));
        }
        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, [cameraOn]);
    const runAnalysis = async (mime, b64) => {
        setLoading(true);
        try {
            const r = await analyze(mime, b64);
            setResult(r);
        }
        finally {
            setLoading(false);
        }
    };
    const capture = () => {
        if (!videoRef.current || !canvasRef.current)
            return;
        const v = videoRef.current;
        const c = canvasRef.current;
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        const dataUrl = c.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        setCameraOn(false);
        const b64 = dataUrl.split(',')[1];
        runAnalysis('image/jpeg', b64);
    };
    const onFile = (f) => {
        if (!f)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            setImage(dataUrl);
            const b64 = dataUrl.split(',')[1];
            runAnalysis(f.type, b64);
        };
        reader.readAsDataURL(f);
    };
    const reset = () => {
        setImage(null);
        setResult(null);
    };
    return (_jsx("div", { className: "space-y-4", children: !image ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center", children: [cameraOn ? (_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full h-full object-cover" })) : (_jsxs("div", { className: "text-white/60 text-center p-6", children: [_jsx(Camera, { size: 40, className: "mx-auto mb-2" }), _jsx("div", { className: "text-sm", children: "\u958B\u555F\u76F8\u6A5F\u62CD\u651D\u60A8\u7684\u9910\u9EDE\uFF0CAI \u6703\u81EA\u52D5\u8FA8\u8B58\u71B1\u91CF\u8207\u71DF\u990A\u7D20" })] })), _jsx("canvas", { ref: canvasRef, className: "hidden" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [!cameraOn ? (_jsxs(Button, { variant: "accent", onClick: () => setCameraOn(true), children: [_jsx(Camera, { size: 14 }), " \u958B\u555F\u76F8\u6A5F"] })) : (_jsxs(Button, { variant: "accent", onClick: capture, children: [_jsx(Camera, { size: 14 }), " \u62CD\u651D"] })), _jsx(Button, { variant: "outline", onClick: () => fileRef.current?.click(), children: "\u4E0A\u50B3\u5716\u7247" }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: (e) => onFile(e.target.files?.[0]) })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "rounded-2xl overflow-hidden", children: _jsx("img", { src: image, alt: "\u9910\u9EDE", className: "w-full max-h-80 object-cover" }) }), loading ? (_jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-accent/5", children: [_jsx(Sparkles, { size: 18, className: "text-accent animate-pulse" }), _jsx("div", { className: "text-sm font-semibold", children: "AI \u6B63\u5728\u8FA8\u8B58\u4E2D..." })] })) : result ? (_jsx(AnalysisEditableCard, { initial: result, onConfirm: onConfirm })) : null, _jsx("div", { className: "flex gap-2", children: _jsx(Button, { variant: "outline", onClick: reset, children: "\u91CD\u62CD" }) })] })) }));
}
function AnalysisEditableCard({ initial, onConfirm, }) {
    const [food, setFood] = useState(initial);
    const setN = (k) => (v) => {
        if (['calories', 'protein_g', 'carbs_g', 'fat_g'].includes(String(k))) {
            setFood({ ...food, [k]: Number(v) || 0 });
        }
        else {
            setFood({ ...food, [k]: v });
        }
    };
    const conf = food.confidence;
    return (_jsxs("div", { className: cn('rounded-2xl p-4 border', conf === 'high' ? 'border-emerald-200 bg-emerald-50/50' :
            conf === 'medium' ? 'border-amber-200 bg-amber-50/50' :
                'border-red-200 bg-red-50/50'), children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-lg", children: food.name_zh }), _jsxs("div", { className: "text-xs text-text-secondary", children: [food.name_en, " \u00B7 ", food.serving_size] })] }), _jsxs(Badge, { tone: conf === 'high' ? 'success' : conf === 'medium' ? 'warning' : 'danger', children: ["\u4FE1\u5FC3\u5EA6 ", conf] })] }), conf === 'low' && (_jsxs("div", { className: "flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs", children: [_jsx(AlertTriangle, { size: 14 }), "\u4F30\u7B97\u53EF\u80FD\u4E0D\u6E96\u78BA\uFF0C\u5EFA\u8B70\u624B\u52D5\u8ABF\u6574"] })), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(EditField, { label: "\u540D\u7A31", value: food.name_zh, onChange: setN('name_zh') }), _jsx(EditField, { label: "\u4EFD\u91CF", value: food.serving_size, onChange: setN('serving_size') }), _jsx(EditField, { label: "\u71B1\u91CF (kcal)", value: String(food.calories), onChange: setN('calories'), type: "number" }), _jsx(EditField, { label: "\u86CB\u767D\u8CEA (g)", value: String(food.protein_g), onChange: setN('protein_g'), type: "number" }), _jsx(EditField, { label: "\u78B3\u6C34 (g)", value: String(food.carbs_g), onChange: setN('carbs_g'), type: "number" }), _jsx(EditField, { label: "\u8102\u80AA (g)", value: String(food.fat_g), onChange: setN('fat_g'), type: "number" })] }), _jsxs(Button, { variant: "accent", className: "w-full mt-4", onClick: () => onConfirm(food), children: [_jsx(Check, { size: 14 }), " \u78BA\u8A8D\u52A0\u5165"] })] }));
}
function EditField({ label, value, onChange, type = 'text', }) {
    return (_jsxs("label", { className: "block", children: [_jsx("div", { className: "text-[10px] font-semibold text-text-secondary uppercase tracking-wide", children: label }), _jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full px-3 py-2 rounded-lg border border-border-soft bg-white focus:border-accent outline-none text-sm" })] }));
}
/* ------------------------- Search tab ------------------------- */
function SearchTab({ onPick }) {
    const [q, setQ] = useState('');
    const [debounced, setDebounced] = useState('');
    const [results, setResults] = useState([]);
    const [picked, setPicked] = useState(null);
    const [qty, setQty] = useState(1);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(q), 300);
        return () => clearTimeout(t);
    }, [q]);
    useEffect(() => {
        if (!debounced) {
            setResults([]);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const { data } = await apiClient.get('/api/nutrition/foods/search', { params: { q: debounced } });
                if (!cancelled) {
                    setResults(data.map((d) => ({
                        ...d,
                        calories: d.calories_per_serving ?? d.calories,
                    })));
                }
            }
            catch {
                if (!cancelled)
                    setResults(searchFoods(debounced));
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [debounced]);
    if (picked) {
        return (_jsxs("div", { children: [_jsx("button", { onClick: () => setPicked(null), className: "text-xs text-text-secondary hover:text-primary mb-3", children: "\u2190 \u8FD4\u56DE\u641C\u5C0B" }), _jsxs("div", { className: "rounded-2xl border border-border-soft p-4 bg-slate-50", children: [_jsx("div", { className: "font-bold text-lg", children: picked.name_zh }), _jsxs("div", { className: "text-xs text-text-secondary", children: [picked.name_en, " \u00B7 ", picked.serving_size] }), _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [_jsx("span", { className: "text-sm font-semibold", children: "\u4EFD\u6578" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => setQty(Math.max(0.25, qty - 0.25)), children: "\u2212" }), _jsx("div", { className: "w-12 text-center font-bold", children: qty }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setQty(qty + 0.25), children: "\uFF0B" })] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4 text-center", children: [_jsx(Stat, { label: "\u71B1\u91CF", value: `${Math.round(picked.calories * qty)} kcal` }), _jsx(Stat, { label: "\u86CB\u767D\u8CEA", value: `${(picked.protein_g * qty).toFixed(1)} g` }), _jsx(Stat, { label: "\u78B3\u6C34", value: `${(picked.carbs_g * qty).toFixed(1)} g` }), _jsx(Stat, { label: "\u8102\u80AA", value: `${(picked.fat_g * qty).toFixed(1)} g` })] }), _jsxs(Button, { variant: "accent", className: "w-full mt-4", onClick: () => onPick(picked, qty), children: [_jsx(Check, { size: 14 }), " \u52A0\u5165\u8A18\u9304"] })] })] }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "\u641C\u5C0B\u98DF\u7269 (\u6EF7\u8089\u98EF\u3001\u96DE\u80F8\u8089...)", autoFocus: true, className: "w-full pl-9 pr-4 py-3 rounded-xl border border-border-soft bg-slate-50 focus:bg-white focus:border-accent outline-none text-sm" })] }), _jsx("div", { className: "mt-3 space-y-1", children: results.length === 0 ? (_jsx("div", { className: "text-center py-10 text-sm text-text-secondary", children: q ? '找不到符合的食物' : '輸入食物名稱開始搜尋' })) : (results.map((f) => (_jsxs("button", { onClick: () => setPicked(f), className: "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left border border-transparent hover:border-border-soft transition", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold", children: f.name_zh }), _jsxs("div", { className: "text-xs text-text-secondary", children: [f.serving_size, " \u00B7 ", f.category] })] }), _jsxs("div", { className: "text-sm font-bold text-accent", children: [f.calories, " kcal"] })] }, f.id)))) })] }));
}
function Stat({ label, value }) {
    return (_jsxs("div", { className: "p-2 bg-white rounded-lg border border-border-soft", children: [_jsx("div", { className: "text-[10px] text-text-secondary", children: label }), _jsx("div", { className: "text-sm font-bold", children: value })] }));
}
/* ------------------------- Manual tab ------------------------- */
function ManualTab({ onSubmit, }) {
    const [form, setForm] = useState({
        name_zh: '',
        serving_size: '1份',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
    });
    const set = (k) => (v) => setForm({ ...form, [k]: v });
    const submit = async () => {
        if (!form.name_zh.trim() || !form.calories)
            return;
        await onSubmit({
            name_zh: form.name_zh.trim(),
            serving_size: form.serving_size,
            calories: Number(form.calories) || 0,
            protein_g: Number(form.protein_g) || 0,
            carbs_g: Number(form.carbs_g) || 0,
            fat_g: Number(form.fat_g) || 0,
        });
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx(EditField, { label: "\u98DF\u7269\u540D\u7A31", value: form.name_zh, onChange: set('name_zh') }), _jsx(EditField, { label: "\u4EFD\u91CF", value: form.serving_size, onChange: set('serving_size') }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(EditField, { label: "\u71B1\u91CF (kcal) *", value: form.calories, onChange: set('calories'), type: "number" }), _jsx(EditField, { label: "\u86CB\u767D\u8CEA (g)", value: form.protein_g, onChange: set('protein_g'), type: "number" }), _jsx(EditField, { label: "\u78B3\u6C34 (g)", value: form.carbs_g, onChange: set('carbs_g'), type: "number" }), _jsx(EditField, { label: "\u8102\u80AA (g)", value: form.fat_g, onChange: set('fat_g'), type: "number" })] }), _jsx(Button, { variant: "accent", className: "w-full", onClick: submit, disabled: !form.name_zh.trim() || !form.calories, children: "\u5132\u5B58" })] }));
}
