import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-[72px] lg:pl-[240px]">
        <Header />
        <main className="px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-10 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
