import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
const tones = {
    default: 'bg-slate-100 text-primary',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    accent: 'bg-accent/10 text-accent',
};
export function Badge({ className, tone = 'default', ...props }) {
    return (_jsx("span", { className: cn('inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full', tones[tone], className), ...props }));
}
