import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Bot, Plus, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useChatStore } from '@/store/useChatStore';
const SUGGESTED = [
    '分析我今天的飲食',
    '我的蛋白質夠嗎',
    '今天吃什麼比較好',
    '幫我規劃明天飲食',
    '分析我的睡眠',
    '今天的訓練建議',
];
export function ChatPage() {
    const { threads, activeId, loading, createThread, setActive, deleteThread, sendMessage, getActive } = useChatStore();
    const [input, setInput] = useState('');
    const active = getActive();
    const scrollRef = useRef(null);
    useEffect(() => {
        if (!activeId && threads.length === 0)
            createThread();
        else if (!activeId && threads.length > 0)
            setActive(threads[0].id);
    }, [activeId, threads, createThread, setActive]);
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [active?.messages.length, loading]);
    const handleSend = async (text) => {
        const toSend = (text ?? input).trim();
        if (!toSend || loading)
            return;
        setInput('');
        await sendMessage(toSend);
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-140px)]", children: [_jsxs(Card, { padded: false, className: "hidden lg:flex flex-col", children: [_jsxs("div", { className: "p-4 flex items-center justify-between border-b border-border-soft", children: [_jsx("h3", { className: "font-bold", children: "\u5C0D\u8A71\u7D00\u9304" }), _jsxs(Button, { variant: "subtle", size: "sm", onClick: () => createThread(), children: [_jsx(Plus, { size: 14 }), " \u65B0\u5C0D\u8A71"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: threads.length === 0 ? (_jsx("div", { className: "text-center text-xs text-text-secondary py-8", children: "\u5C1A\u7121\u5C0D\u8A71" })) : (threads.map((t) => (_jsxs("button", { onClick: () => setActive(t.id), className: cn('group w-full text-left px-3 py-2.5 rounded-lg mb-1 transition flex items-start gap-2', t.id === activeId ? 'bg-accent/10 text-primary' : 'hover:bg-slate-50 text-text-secondary'), children: [_jsx(MessageIcon, { active: t.id === activeId }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-semibold truncate", children: t.title }), _jsx("div", { className: "text-[10px] text-text-muted", children: new Date(t.createdAt).toLocaleDateString('zh-Hant') })] }), _jsx("span", { role: "button", onClick: (e) => {
                                        e.stopPropagation();
                                        deleteThread(t.id);
                                    }, className: "opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 cursor-pointer", "aria-label": "\u522A\u9664", children: _jsx(Trash2, { size: 14 }) })] }, t.id)))) })] }), _jsxs(Card, { padded: false, className: "flex flex-col overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-border-soft flex flex-wrap gap-2 items-center", children: [_jsx("div", { className: "text-xs font-semibold text-text-secondary mr-2", children: "\u5EFA\u8B70\u63D0\u554F\uFF1A" }), SUGGESTED.map((p) => (_jsx("button", { onClick: () => handleSend(p), className: "px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-50 border border-border-soft hover:border-accent hover:text-accent transition", children: p }, p)))] }), _jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-5 space-y-3 bg-background/40", children: !active || active.messages.length === 0 ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center py-10", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3", children: _jsx(Bot, { size: 28 }) }), _jsx("div", { className: "font-bold text-lg", children: "\u55E8\uFF01\u6211\u662F\u60A8\u7684 AI \u5065\u8EAB\u6559\u7DF4 \uD83D\uDCAA" }), _jsx("div", { className: "text-sm text-text-secondary mt-2 max-w-sm", children: "\u9EDE\u4E0A\u9762\u7684\u63D0\u793A\u6216\u76F4\u63A5\u8F38\u5165\u554F\u984C\uFF0C\u6211\u6703\u6839\u64DA\u60A8\u6700\u65B0\u7684\u5065\u5EB7\u6578\u64DA\u7D66\u4E88\u5EFA\u8B70\u3002" }), _jsx("div", { className: "text-[11px] italic text-text-muted mt-6 max-w-sm", children: "\u63D0\u9192\uFF1A\u6211\u4E0D\u9032\u884C\u91AB\u7642\u8A3A\u65B7\u6216\u958B\u7ACB\u8655\u65B9\u3002\u5982\u6709\u91AB\u7642\u7591\u616E\u8ACB\u8AEE\u8A62\u91AB\u5E2B\u3002" })] })) : (_jsxs(_Fragment, { children: [active.messages.map((m) => m.role === 'user' ? (_jsx("div", { className: "flex justify-end", children: _jsx("div", { className: "max-w-[78%] bg-accent text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-soft", children: m.text }) }, m.id)) : (_jsxs("div", { className: "flex items-end gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0", children: _jsx(Bot, { size: 16 }) }), _jsx("div", { className: "max-w-[78%] bg-white border border-primary/10 text-primary px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap shadow-soft", children: m.text })] }, m.id))), loading && (_jsxs("div", { className: "flex items-end gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0", children: _jsx(Bot, { size: 16 }) }), _jsx(TypingIndicator, {})] }))] })) }), _jsxs("div", { className: "p-4 border-t border-border-soft flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }, placeholder: "\u8A62\u554F\u60A8\u7684\u6559\u7DF4...", "aria-label": "\u8A0A\u606F\u8F38\u5165", className: "flex-1 rounded-xl bg-slate-50 border border-transparent focus:border-accent focus:bg-white outline-none px-4 py-3 text-sm" }), _jsxs(Button, { variant: "accent", onClick: () => handleSend(), disabled: !input.trim() || loading, children: [_jsx(Send, { size: 14 }), " \u50B3\u9001"] })] })] })] }));
}
function MessageIcon({ active }) {
    return (_jsx("div", { className: cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', active ? 'bg-accent text-white' : 'bg-slate-100 text-text-secondary'), children: _jsx(Bot, { size: 14 }) }));
}
