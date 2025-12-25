'use client'

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      router.push("/dashboard");  // THIS ONE NOW REDIRECT TO DASHBOARD SHARP
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 flex items-center justify-center px-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white border-opacity-20">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Welcome Back to SkillBarter<span className="text-green-400">NG</span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          {message && (
            <p className={`text-center mt-6 font-semibold ${message.includes("successful") ? "text-green-300" : "text-red-300"}`}>
              {message}
            </p>
          )}

          <p className="text-gray-300 text-center mt-8">
            No account? {" "}
            <Link href="/signup" className="text-green-400 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}