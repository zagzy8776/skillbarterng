'use client'

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+234${phone}`,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("OTP sent to your phone!");
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+234${phone}`,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
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
      router.push("/dashboard");
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

          {/* Login Method Tabs */}
          <div className="flex mb-6 bg-gray-800 bg-opacity-60 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                loginMethod === "email"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                loginMethod === "phone"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Phone
            </button>
          </div>

          {loginMethod === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-6">
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
          ) : (
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g., 08012345678)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    required
                    maxLength={6}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full py-2 text-gray-300 hover:text-white text-sm underline"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {message && (
            <p className={`text-center mt-6 font-semibold ${message.includes("successful") || message.includes("sent") ? "text-green-300" : "text-red-300"}`}>
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