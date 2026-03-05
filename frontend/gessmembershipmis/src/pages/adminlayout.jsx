import { useMemo } from "react";
import Sidebar from "../components/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  // Memoized page title
  const pageTitle = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'admin-dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  }, [location.pathname]);

  // Get current time for status bar
  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-slate-900">
      {/* Sidebar - Let it handle its own mobile logic */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Status Bar */}
        <header className="shrink-0 bg-slate-900/95 border-b border-slate-800">
          {/* Top status bar */}
          <div className="px-4 py-1 bg-slate-800/50 text-xs text-slate-400 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Garden Estate Secondary School</span>
              <span className="sm:hidden">GESS</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Clubs membership Management System</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>{currentTime}</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Main header with title */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Page title */}
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {pageTitle}
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {location.pathname.split('/').filter(Boolean).join(' / ')}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Admin badge */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-slate-400">Admin</span>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-purple-600 
                  flex items-center justify-center text-white font-medium">
                  A
                </div>
              </div>
              
              {/* Mobile admin icon */}
              <div className="sm:hidden w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-purple-600 
                flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 sm:p-6">
              <Outlet />
            </div>

            <footer className="mt-6 text-center text-xs text-slate-600">
              <p>© 2026 Garden Estate Secondary School. All rights reserved.</p>
              <p className="mt-1 hidden sm:block">Version 1.0.0</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}