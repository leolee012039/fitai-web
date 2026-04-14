import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Card({ className, accentTop, padded = true, children, ...props }) {
    return (_jsxs("div", { className: cn('bg-card rounded-2xl shadow-card border border-border-soft/40 relative', padded && 'p-5', accentTop && 'overflow-hidden', className), ...props, children: [accentTop && _jsx("div", { className: "absolute top-0 left-0 right-0 h-1 bg-accent" }), children] }));
}
