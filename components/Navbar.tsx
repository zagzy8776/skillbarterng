'use client'

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    profile_pic_url?: string;
    full_name?: string;
    teach_skills?: string[];
    want_skills?: string[];
    [key: string]: unknown;
  };
};
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetchCount = async () => {
      try {
        const res = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);
        if (!mounted) return;
        setNotificationsCount(res.count ?? 0);
      } catch {
        // ignore
      }
    };
    fetchCount();
    const iv = setInterval(fetchCount, 15000);
    return () => { mounted = false; clearInterval(iv); };
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();

    // subscribe to auth changes (no explicit unsubscribe to avoid any typing)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {};
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const profilePicUrl = user?.user_metadata?.profile_pic_url || "/vercel.svg";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-lg z-50" role="navigation">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="hidden sm:inline text-2xl font-bold text-slate-900 dark:text-slate-100">SkillBarter<span className="text-indigo-600 dark:text-indigo-400">NG</span></span>
            <span className="sm:hidden text-2xl font-bold text-slate-900 dark:text-slate-100">SB<span className="text-indigo-600 dark:text-indigo-400">NG</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="#how-it-works"
            className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
          >
            How It Works
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/dashboard"
            className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
          >
            Dashboard
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/jobs"
            className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
          >
            Jobs
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/study-groups"
            className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
          >
            Study Groups
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </Link>

          <Link
            href="/p2p"
            className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
          >
            P2P Trading
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                {theme === 'dark' ? '☀️' : '🌙'}
              </div>
            </button>

            <button
              aria-label="Notifications"
              className="relative p-3 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
              onClick={() => router.push("/notifications")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                🔔
              </div>
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full min-w-[22px] h-5 shadow-lg animate-pulse">
                  {notificationsCount > 99 ? '99+' : notificationsCount}
                </span>
              )}
            </button>
          </div>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(v => !v)} className="flex items-center gap-3 focus:outline-none p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Image
                  src={profilePicUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="avatar ring-2 ring-indigo-500 dark:ring-indigo-400"
                />
                <span className="text-slate-700 dark:text-slate-300 hidden lg:inline font-medium">
                  {user?.user_metadata?.full_name || user?.email || 'You'}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2">
                  <Link href="/profile" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">👤 Profile</Link>
                  <Link href="/settings" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">⚙️ Settings</Link>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium px-4 py-2"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Open menu"
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="px-6 py-4 flex flex-col gap-1">
            <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
              📊 Dashboard
            </Link>
            <Link href="/ai-chat" className="text-slate-700 dark:text-slate-300 py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
              🤖 AI Mentor
            </Link>
            <Link href="#how-it-works" className="text-slate-700 dark:text-slate-300 py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
              ❓ How it works
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="text-slate-700 dark:text-slate-300 py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 py-3 px-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  🚪 Sign out
                </button>
              </>
            ) : (
              <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-4 flex flex-col gap-2">
                <Link href="/login" className="text-slate-700 dark:text-slate-300 py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition text-center">
                  Log In
                </Link>
                <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg transition text-center shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
