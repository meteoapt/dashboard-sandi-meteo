import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Sun,
  Moon,
} from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotInfo, setShowForgotInfo] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formattedEmail = username.includes("@")
      ? username.trim()
      : `${username.trim().toLowerCase()}@kantor.go.id`;

    const { error } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password: password,
    });

    if (error) {
      setErrorMsg("Username atau password salah. Silakan cek kembali.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EEF8F7] dark:bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      {/* Tombol Toggle Theme Floating */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200/60 dark:border-slate-700 hover:scale-105 transition cursor-pointer"
        title="Ganti Tema"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Dekorasi Gelombang Latar Belakang */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[300px] h-[300px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#BCE6E1]/70 dark:bg-teal-900/20" />
      <div className="pointer-events-none absolute -top-16 -left-16 w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#9FD9D2]/60 dark:bg-teal-800/20" />
      <div className="pointer-events-none absolute -bottom-40 -right-28 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#BCE6E1]/70 dark:bg-teal-900/20" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] rounded-full bg-[#9FD9D2]/50 dark:bg-teal-800/20" />

      {/* Kartu Utama Split-Screen */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_60px_-15px_rgba(13,110,138,0.16)] dark:shadow-black/50 border border-transparent dark:border-slate-800 overflow-hidden min-h-[500px] sm:min-h-[560px] flex flex-col md:flex-row transition-colors">
        {/* Latar Gelombang Lengkungan Kanan */}
        <svg
          viewBox="0 0 500 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden md:block absolute right-0 top-0 h-full w-[52%] pointer-events-none select-none object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M170 0C70 150 70 450 170 600H500V0H170Z"
            fill={isDark ? "#134E4A" : "#BCEBE4"}
            fillOpacity={isDark ? "0.4" : "1"}
          />
          <path
            d="M255 0C155 160 155 440 255 600H500V0H255Z"
            fill={isDark ? "#0F766E" : "#8ED9CE"}
            fillOpacity={isDark ? "0.5" : "1"}
          />
          <path
            d="M345 0C255 170 255 430 345 600H500V0H345Z"
            fill="url(#mintGrad)"
          />
          <defs>
            <linearGradient
              id="mintGrad"
              x1="280"
              y1="0"
              x2="500"
              y2="600"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={isDark ? "#14B8A6" : "#65CBB9"} />
              <stop offset="1" stopColor={isDark ? "#0D9488" : "#4BB8A6"} />
            </linearGradient>
          </defs>
        </svg>

        {/* SISI KIRI: FORM LOGIN */}
        <div className="relative z-10 w-full md:w-[55%] p-6 sm:p-8 lg:p-11 flex flex-col justify-center order-2 md:order-1 bg-white dark:bg-slate-900">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex items-center justify-center gap-12 mb-8 sm:mb-10">
              <div className="relative pb-2">
                <span className="text-xl sm:text-2xl font-bold text-[#1A7A8C] dark:text-[#52C7B4] tracking-wide">
                  Login METEO QC
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#38B2A6] rounded-full" />
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 flex items-start sm:items-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              {/* Input Username */}
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-full shadow-[0_6px_20px_rgba(15,23,42,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-700 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#4BB8A6]/50 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#E8F6F4] dark:bg-teal-950 flex items-center justify-center text-[#1A7A8C] dark:text-[#52C7B4] shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-transparent px-4 py-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              {/* Input Password */}
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-full shadow-[0_6px_20px_rgba(15,23,42,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-700 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#4BB8A6]/50 transition-all">
                <div className="w-9 h-9 rounded-full bg-[#E8F6F4] dark:bg-teal-950 flex items-center justify-center text-[#1A7A8C] dark:text-[#52C7B4] shrink-0">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent px-4 py-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-[#1A7A8C] dark:hover:text-[#52C7B4] pr-2 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Lupa Password & Tombol Login */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-[#52C7B4] to-[#3BB29F] hover:from-[#45B8A5] hover:to-[#319F8D] disabled:opacity-60 text-white text-sm sm:text-base font-semibold shadow-lg shadow-[#4BB8A6]/30 transition cursor-pointer flex items-center justify-center min-w-[140px] order-1 sm:order-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              {showForgotInfo && (
                <div className="flex items-start gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#EEF8F7] dark:bg-slate-800 text-[#1A7A8C] dark:text-slate-300 text-xs sm:text-sm mt-4 border border-transparent dark:border-slate-700">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#38B2A6]" />
                  <span className="leading-snug">
                    Hubungi Admin atau Koordinator ruangan untuk melakukan reset
                    akun operator Anda.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
