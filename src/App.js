import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/Dashboard';
import { ChatPage } from '@/pages/Chat';
import { UploadPage } from '@/pages/Upload';
import { WorkoutsPage } from '@/pages/Workouts';
import { ProfilePage } from '@/pages/Profile';
import { NutritionPage } from '@/pages/Nutrition';
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60000, refetchOnWindowFocus: false, retry: 1 } },
});
export default function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/chat", element: _jsx(ChatPage, {}) }), _jsx(Route, { path: "/workouts", element: _jsx(WorkoutsPage, {}) }), _jsx(Route, { path: "/nutrition", element: _jsx(NutritionPage, {}) }), _jsx(Route, { path: "/upload", element: _jsx(UploadPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }) }));
}
