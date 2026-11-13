import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  FileSignature,
  Users,
  LogOut,
  Menu,
  CloudSunRain,
  Sun,
  Moon,
} from "lucide-react";

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Input Kesalahan", path: "/input", icon: FileSignature },
    { name: "Data Pegawai", path: "/pegawai", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F1F9F8] dark:bg-slate-950 flex font-sans transition-colors duration-300">
      {/* Overlay Gelap untuk Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Kontainer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 shadow-[4px_0_24px_rgba(15,23,42,0.02)] transform transition-all duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#52C7B4] to-[#3BB29F] flex items-center justify-center text-white shadow-md shadow-[#4BB8A6]/20">
              <CloudSunRain className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-[#1A7A8C] dark:text-[#52C7B4] tracking-wide">
              Meteo QC
            </span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#E8F6F4] dark:bg-teal-950/60 text-[#1A7A8C] dark:text-[#52C7B4] font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#38B2A6] dark:text-[#52C7B4]" : "text-slate-400 dark:text-slate-500"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Atas */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 hidden sm:block">
              {menuItems.find((i) => i.path === location.pathname)?.name ||
                "Dashboard"}
            </h2>
          </div>

          {/* Tombol Toggle Dark / Light Mode */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
              </>
            )}
          </button>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
