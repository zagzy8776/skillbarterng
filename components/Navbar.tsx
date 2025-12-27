'use client'

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
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

  const toggleTheme = () => {
    const el = document.documentElement;
    const isDark = el.classList.toggle("dark");
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") document.documentElement.classList.add("dark");
      else if (saved === "light") document.documentElement.classList.remove("dark");
    } catch {}
  }, []);

  const profilePicUrl = user?.user_metadata?.profile_pic_url || "/vercel.svg";

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-md shadow-md z-50" role="navigation">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="hidden sm:inline text-2xl font-bold text-white">SkillBarter<span className="text-green-400">NG</span></span>
            <span className="sm:hidden text-2xl font-bold text-white">SB<span className="text-green-400">NG</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition">
            How It Works
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="theme-toggle text-gray-300 hover:text-white">
              🌗
            </button>

            <button aria-label="Notifications" className="relative text-gray-300 hover:text-white" onClick={() => router.push("/notifications")}>
              🔔
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(v => !v)} className="flex items-center gap-3 focus:outline-none">
                <Image
                  src={profilePicUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="avatar ring-2 ring-green-400"
                />
                <span className="text-gray-200 hidden lg:inline">{user?.user_metadata?.full_name || user?.email || 'You'}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white/5 glass rounded-lg shadow-lg py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-white/5">Profile</Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-white hover:bg-white/5">Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signup" className="text-gray-300 hover:text-white transition">Sign Up</Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Log In</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme} className="theme-toggle text-gray-300">🌗</button>
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Open menu" className="text-white text-2xl">
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-sm border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-2">
            <Link href="/dashboard" className="text-white py-2">Dashboard</Link>
            <Link href="#how-it-works" className="text-white py-2">How it works</Link>
            {user ? (
              <>
                <Link href="/profile" className="text-white py-2">Profile</Link>
                <button onClick={handleLogout} className="text-white text-left py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/signup" className="text-white py-2">Sign up</Link>
                <Link href="/login" className="text-white py-2">Log in</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
