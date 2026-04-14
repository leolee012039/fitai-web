import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockAnalysis } from '@/lib/mockData';
export function UploadPage() {
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('fitai-reports') || '[]');
        }
        catch {
            return [];
        }
    });
    const saveHistory = (next) => {
        setHistory(next);
        localStorage.setItem('fitai-reports', JSON.stringify(next));
    };
    const onFiles = (files) => {
        const f = files?.[0];
        if (!f)
            return;
        setFile({
            name: f.name,
            type: f.type,
            url: URL.createObjectURL(f),
            isImage: f.type.startsWith('image/'),
        });
        setAnalysis(null);
        setUploadProgress(100);
    };
    const analyze = () => {
        if (!file)
            return;
        setAnalyzing(true);
        setUploadProgress(0);
        const tick = setInterval(() => {
            setUploadProgress((p) => Math.min(95, p + 8 + Math.random() * 10));
        }, 140);
        setTimeout(() => {
            clearInterval(tick);
            setUploadProgress(100);
            setAnalysis(mockAnalysis);
            setAnalyzing(false);
            const report = {
                id: 'r_' + Date.now(),
                file_name: file.name,
                created_at: new Date().toISOString(),
                status: 'complete',
                analysis: mockAnalysis,
            };
            saveHistory([report, ...history].slice(0, 20));
        }, 1600);
    };
    const reset = () => {
        setFile(null);
        setAnalysis(null);
        setUploadProgress(0);
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-1", children: "\u4E0A\u50B3\u5065\u5EB7\u5831\u544A" }), _jsx("p", { className: "text-xs text-text-secondary mb-4", children: "\u652F\u63F4 PDF\u3001JPG\u3001PNG\uFF0CAI \u6703\u81EA\u52D5\u5206\u6790\u751F\u7269\u6A19\u8A18\u4E26\u6A19\u8A18\u7570\u5E38\u503C\u3002" }), _jsxs("div", { onDragOver: (e) => { e.preventDefault(); setDragOver(true); }, onDragLeave: () => setDragOver(false), onDrop: (e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }, onClick: () => fileInput.current?.click(), className: `cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition
              ${dragOver ? 'border-accent bg-accent/5' : 'border-border-soft hover:border-accent/60 hover:bg-slate-50'}`, children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3", children: _jsx(UploadCloud, { size: 28 }) }), _jsx("div", { className: "font-semibold text-primary", children: "\u62D6\u66F3\u6A94\u6848\u81F3\u6B64\u8655" }), _jsx("div", { className: "text-xs text-text-secondary mt-1", children: "\u6216\u9EDE\u64CA\u9078\u64C7\u6587\u4EF6" }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-4", children: [_jsx(Badge, { tone: "default", children: "PDF" }), _jsx(Badge, { tone: "default", children: "JPG" }), _jsx(Badge, { tone: "default", children: "PNG" })] }), _jsx("input", { ref: fileInput, type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: (e) => onFiles(e.target.files) })] }), file && (_jsxs("div", { className: "mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-border-soft", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-white flex items-center justify-center", children: file.isImage ? _jsx(ImageIcon, { size: 20, className: "text-primary" }) : _jsx(FileText, { size: 20, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-semibold text-sm truncate", children: file.name }), _jsx("div", { className: "w-full h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden", children: _jsx("div", { className: "h-full bg-accent transition-all", style: { width: `${uploadProgress}%` } }) })] }), _jsx("button", { onClick: reset, className: "text-text-secondary hover:text-red-500", "aria-label": "\u79FB\u9664", children: _jsx(X, { size: 18 }) })] })), file && (_jsxs("div", { className: "mt-4 flex gap-3", children: [_jsxs(Button, { variant: "accent", onClick: analyze, loading: analyzing, className: "flex-1", children: [_jsx(Sparkles, { size: 14 }), " ", analyzing ? '分析中...' : 'AI 分析報告'] }), _jsx(Button, { variant: "outline", onClick: reset, children: "\u53D6\u6D88" })] })), file?.isImage && (_jsx("div", { className: "mt-4", children: _jsx("img", { src: file.url, alt: "\u9810\u89BD", className: "w-full max-h-[360px] object-contain rounded-xl bg-slate-100" }) }))] }), analysis && (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-3", children: "\u751F\u7269\u6A19\u8A18" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: analysis.biomarkers.map((b, i) => {
                                            const flagged = analysis.flagged.some((f) => f.name.includes(b.name.split(' ')[0]));
                                            return (_jsxs("div", { className: `flex items-center justify-between p-3 rounded-xl border ${flagged ? 'border-red-200 bg-red-50' : 'border-border-soft bg-slate-50'}`, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold", children: b.name }), b.normalRange && (_jsxs("div", { className: "text-[11px] text-text-secondary", children: ["\u6B63\u5E38\u7BC4\u570D ", b.normalRange] }))] }), _jsxs("div", { className: `text-sm font-bold ${flagged ? 'text-red-600' : 'text-primary'}`, children: [b.value, " ", b.unit] })] }, i));
                                        }) })] }), analysis.flagged.length > 0 && (_jsxs(Card, { className: "border border-red-200 bg-red-50/30", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(AlertTriangle, { size: 18, className: "text-red-600" }), _jsx("h3", { className: "text-base font-bold text-red-700", children: "\u9700\u8981\u95DC\u6CE8\u7684\u9805\u76EE" })] }), _jsx("div", { className: "space-y-2", children: analysis.flagged.map((f, i) => (_jsxs("div", { className: "p-3 rounded-xl bg-white border border-red-200", children: [_jsxs("div", { className: "font-semibold text-red-700", children: [f.name, "\uFF1A", f.value] }), _jsx("div", { className: "text-xs text-text-secondary mt-1", children: f.reason })] }, i))) })] })), _jsxs(Card, { className: "border border-emerald-200 bg-emerald-50/30", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(CheckCircle2, { size: 18, className: "text-emerald-600" }), _jsx("h3", { className: "text-base font-bold text-emerald-700", children: "\u5065\u8EAB\u5EFA\u8B70" })] }), _jsx("ul", { className: "space-y-2", children: analysis.fitnessInsights.map((ins, i) => (_jsxs("li", { className: "text-sm text-primary leading-relaxed flex gap-2", children: [_jsx("span", { className: "text-emerald-600 mt-0.5", children: "\u2022" }), _jsx("span", { children: ins })] }, i))) }), _jsx("p", { className: "text-[11px] italic text-text-muted mt-3", children: "\u4EE5\u4E0A\u70BA\u4E00\u822C\u5065\u8EAB\u8CC7\u8A0A\uFF0C\u975E\u91AB\u7642\u5EFA\u8B70\u3002\u5982\u6709\u91AB\u7642\u7591\u616E\u8ACB\u8AEE\u8A62\u91AB\u5E2B\u3002" })] })] }))] }), _jsx("div", { children: _jsxs(Card, { padded: false, children: [_jsxs("div", { className: "p-5 border-b border-border-soft", children: [_jsx("h3", { className: "font-bold", children: "\u6B77\u53F2\u5831\u544A" }), _jsx("p", { className: "text-xs text-text-secondary mt-0.5", children: "\u6700\u8FD1 20 \u7B46" })] }), _jsx("div", { className: "max-h-[560px] overflow-y-auto divide-y divide-border-soft/60", children: history.length === 0 ? (_jsx("div", { className: "p-5 text-center text-xs text-text-secondary", children: "\u5C1A\u7121\u6B77\u53F2\u5831\u544A" })) : (history.map((r) => (_jsxs("div", { className: "p-4 hover:bg-slate-50 transition cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center", children: _jsx(FileText, { size: 16, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-semibold truncate", children: r.file_name }), _jsx("div", { className: "text-[11px] text-text-secondary", children: new Date(r.created_at).toLocaleString('zh-Hant') })] }), _jsx(Badge, { tone: r.status === 'complete' ? 'success' : r.status === 'error' ? 'danger' : 'warning', children: r.status === 'complete' ? '已完成' : r.status === 'error' ? '失敗' : '分析中' })] }), r.analysis && (_jsxs("div", { className: "mt-2 text-[11px] text-text-secondary", children: [r.analysis.biomarkers.length, " \u500B\u751F\u7269\u6A19\u8A18 \u00B7 ", r.analysis.flagged.length, " \u9805\u7570\u5E38"] }))] }, r.id)))) })] }) })] }));
}
