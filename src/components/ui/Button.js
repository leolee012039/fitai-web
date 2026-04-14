import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    accent: 'bg-accent text-white hover:bg-accent/90',
    outline: 'border border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary hover:bg-primary/5',
    subtle: 'bg-[#F1F5F9] text-primary hover:bg-slate-200',
};
const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-5 py-3 rounded-xl gap-2',
};
export const Button = forwardRef(({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (_jsxs("button", { ref: ref, disabled: disabled || loading, className: cn('inline-flex items-center justify-center font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed', variantClasses[variant], sizeClasses[size], className), ...props, children: [loading ? (_jsx("span", { className: "inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" })) : null, children] })));
Button.displayName = 'Button';
