import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Camera, Download, Trash2, LogOut, Smartphone, Apple } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { useProfileStore } from '@/store/useProfileStore';
import { useHealthStore } from '@/store/useHealthStore';
export function ProfilePage() {
    const { user, toggles, updateUser, toggle } = useProfileStore();
    const { appleHealthConnected, toggleAppleHealth } = useHealthStore();
    const avatarInput = useRef(null);
    const [avatar, setAvatar] = useState(user.avatar_url ?? null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        age: String(user.age ?? ''),
        weight: String(user.weight ?? ''),
        height: String(user.height ?? ''),
        goal: user.fitness_goal ?? '',
    });
    const onAvatar = (files) => {
        const f = files?.[0];
        if (!f)
            return;
        const url = URL.createObjectURL(f);
        setAvatar(url);
        updateUser({ avatar_url: url });
    };
    const saveProfile = () => {
        updateUser({
            name: form.name,
            email: form.email,
            age: form.age ? Number(form.age) : undefined,
            weight: form.weight ? Number(form.weight) : undefined,
            height: form.height ? Number(form.height) : undefined,
            fitness_goal: form.goal,
        });
        setEditing(false);
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs(Card, { className: "text-center", children: [_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden", children: avatar ? _jsx("img", { src: avatar, alt: user.name, className: "w-full h-full object-cover" }) : user.name[0] }), _jsx("button", { onClick: () => avatarInput.current?.click(), className: "absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-card hover:scale-105 transition", "aria-label": "\u66F4\u63DB\u982D\u50CF", children: _jsx(Camera, { size: 14 }) }), _jsx("input", { ref: avatarInput, type: "file", accept: "image/*", className: "hidden", onChange: (e) => onAvatar(e.target.files) })] }), _jsx("div", { className: "font-bold text-lg mt-4", children: user.name }), _jsx("div", { className: "text-xs text-text-secondary", children: user.email }), _jsx(Badge, { tone: "warning", className: "mt-3", children: "\uD83C\uDFCB\uFE0F FITAI Gold \u6703\u54E1" })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-2", children: "\u4F7F\u7528\u7D71\u8A08" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u52A0\u5165\u5929\u6578" }), _jsx("span", { className: "font-bold", children: "128 \u5929" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u8A13\u7DF4\u7D00\u9304" }), _jsx("span", { className: "font-bold", children: "47 \u6B21" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "AI \u5C0D\u8A71" }), _jsx("span", { className: "font-bold", children: "132 \u5247" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-text-secondary", children: "\u5206\u6790\u5831\u544A" }), _jsx("span", { className: "font-bold", children: "5 \u4EFD" })] })] })] })] }), _jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-base font-bold", children: "\u57FA\u672C\u8CC7\u6599" }), editing ? (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => setEditing(false), children: "\u53D6\u6D88" }), _jsx(Button, { size: "sm", variant: "accent", onClick: saveProfile, children: "\u5132\u5B58" })] })) : (_jsx(Button, { size: "sm", variant: "subtle", onClick: () => setEditing(true), children: "\u7DE8\u8F2F" }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Field, { label: "\u59D3\u540D", value: form.name, editing: editing, onChange: (v) => setForm({ ...form, name: v }) }), _jsx(Field, { label: "\u96FB\u5B50\u90F5\u4EF6", value: form.email, editing: editing, onChange: (v) => setForm({ ...form, email: v }), type: "email" }), _jsx(Field, { label: "\u5E74\u9F61", value: form.age, editing: editing, onChange: (v) => setForm({ ...form, age: v }), suffix: "\u6B72" }), _jsx(Field, { label: "\u8EAB\u9AD8", value: form.height, editing: editing, onChange: (v) => setForm({ ...form, height: v }), suffix: "cm" }), _jsx(Field, { label: "\u9AD4\u91CD", value: form.weight, editing: editing, onChange: (v) => setForm({ ...form, weight: v }), suffix: "kg" }), _jsx(Field, { label: "\u5065\u8EAB\u76EE\u6A19", value: form.goal, editing: editing, onChange: (v) => setForm({ ...form, goal: v }) })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-4", children: "\u9023\u7DDA\u5E33\u865F" }), _jsxs("div", { className: "space-y-3", children: [_jsx(ConnectedRow, { icon: _jsx(Apple, { size: 18 }), title: "Apple \u5065\u5EB7", subtitle: appleHealthConnected ? '已連線 · 背景同步中' : '未連線', on: appleHealthConnected, onToggle: toggleAppleHealth }), _jsx(ConnectedRow, { icon: _jsx(Smartphone, { size: 18 }), title: "\u624B\u52D5\u8F38\u5165", subtitle: "\u7576 Apple \u5065\u5EB7\u7121\u6CD5\u4F7F\u7528\u6642\u7684\u5099\u63F4", on: toggles.manualEntry, onToggle: () => toggle('manualEntry') })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-4", children: "\u901A\u77E5\u8A2D\u5B9A" }), _jsxs("div", { className: "space-y-3", children: [_jsx(ToggleRow, { title: "\u8A13\u7DF4\u63D0\u9192", subtitle: "\u6392\u5B9A\u8A13\u7DF4\u65E5\u7576\u5929\u63A8\u9001\u63D0\u9192", on: toggles.notifWorkouts, onToggle: () => toggle('notifWorkouts') }), _jsx(ToggleRow, { title: "\u5831\u544A\u5206\u6790\u5B8C\u6210", subtitle: "AI \u5206\u6790\u5B8C\u6210\u6642\u901A\u77E5", on: toggles.notifReports, onToggle: () => toggle('notifReports') }), _jsx(ToggleRow, { title: "AI \u6559\u7DF4\u63D0\u793A", subtitle: "\u6BCF\u65E5\u5065\u5EB7\u5EFA\u8B70", on: toggles.notifAi, onToggle: () => toggle('notifAi') })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-base font-bold mb-4", children: "\u8CC7\u6599\u8207\u96B1\u79C1" }), _jsxs("div", { className: "space-y-3", children: [_jsx(ToggleRow, { title: "\u5206\u4EAB\u533F\u540D\u5316\u8CC7\u6599", subtitle: "\u5354\u52A9\u6211\u5011\u6539\u5584 AI \u5EFA\u8B70\u54C1\u8CEA", on: toggles.shareAnonymized, onToggle: () => toggle('shareAnonymized') }), _jsx(ActionRow, { icon: _jsx(Download, { size: 16 }), title: "\u532F\u51FA\u6211\u7684\u8CC7\u6599", subtitle: "\u4E0B\u8F09\u6240\u6709\u5065\u5EB7\u8CC7\u6599" }), _jsx(ActionRow, { icon: _jsx(Trash2, { size: 16 }), title: "\u522A\u9664\u5E33\u865F", subtitle: "\u6C38\u4E45\u79FB\u9664\u6240\u6709\u8CC7\u6599", danger: true })] })] }), _jsxs(Button, { variant: "outline", size: "lg", className: "w-full", children: [_jsx(LogOut, { size: 16 }), " \u767B\u51FA"] })] })] }));
}
function Field({ label, value, editing, onChange, type = 'text', suffix, }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-text-secondary uppercase tracking-wide", children: label }), editing ? (_jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full px-3 py-2 rounded-lg border border-border-soft focus:border-accent outline-none text-sm" })) : (_jsxs("div", { className: "mt-1 text-base font-semibold", children: [value || '—', suffix && value ? ` ${suffix}` : ''] }))] }));
}
function ConnectedRow({ icon, title, subtitle, on, onToggle, }) {
    return (_jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-border-soft", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary", children: icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold", children: title }), _jsx("div", { className: "text-xs text-text-secondary", children: subtitle })] }), _jsx(Toggle, { on: on, onChange: onToggle, label: title })] }));
}
function ToggleRow({ title, subtitle, on, onToggle, }) {
    return (_jsxs("div", { className: "flex items-center gap-3 py-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold text-sm", children: title }), subtitle && _jsx("div", { className: "text-xs text-text-secondary mt-0.5", children: subtitle })] }), _jsx(Toggle, { on: on, onChange: onToggle, label: title })] }));
}
function ActionRow({ icon, title, subtitle, danger, }) {
    return (_jsxs("button", { className: `w-full flex items-center gap-3 py-3 px-1 border-t border-border-soft text-left hover:bg-slate-50 rounded-lg transition ${danger ? 'text-red-600' : ''}`, children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-slate-100'}`, children: icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold text-sm", children: title }), subtitle && _jsx("div", { className: "text-xs text-text-secondary", children: subtitle })] }), _jsx("span", { className: "text-text-muted", children: "\u203A" })] }));
}
