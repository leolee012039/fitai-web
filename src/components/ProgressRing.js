import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ProgressRing({ progress, size = 96, stroke = 10, label, color = '#F05454', }) {
    const clamped = Math.max(0, Math.min(1, progress));
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - clamped);
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: r, stroke: "#F1F5F9", strokeWidth: stroke, fill: "none" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: r, stroke: color, strokeWidth: stroke, fill: "none", strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: offset, transform: `rotate(-90 ${size / 2} ${size / 2})` })] }), _jsxs("div", { className: "absolute text-center", children: [_jsxs("div", { className: "text-lg font-bold", children: [Math.round(clamped * 100), "%"] }), label && _jsx("div", { className: "text-[10px] text-text-secondary mt-0.5", children: label })] })] }));
}
