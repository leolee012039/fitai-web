import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
export function Layout() {
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "md:pl-[72px] lg:pl-[240px]", children: [_jsx(Header, {}), _jsx("main", { className: "px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-10 max-w-[1400px] mx-auto", children: _jsx(Outlet, {}) })] }), _jsx(BottomNav, {})] }));
}
