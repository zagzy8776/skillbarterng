'use client'

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const universities = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "Obafemi Awolowo University (OAU)",
  "University of Nigeria, Nsukka (UNN)",
  "Ahmadu Bello University (ABU)",
  "University of Benin (UNIBEN)",
  "Federal University of Technology, Akure (FUTA)",
  "University of Ilorin (UNILORIN)",
  "University of Port Harcourt (UNIPORT)",
  "Nnamdi Azikiwe University (UNIZIK)",
  "Covenant University",
  "Babcock University",
  "Lagos State University (LASU)",
  "Rivers State University (RSU)",
  "Delta State University (DELSU)",
  "Landmark University",
  "Afe Babalola University (ABUAD)",
  "Bowen University",
  "Pan-Atlantic University",
  "Redeemer's University",
  // add more if you want
  "Other (not listed)"
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");

  const searchParams = useSearchParams();
  const referrerId = searchParams.get('ref');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          university: university
        },
        emailRedirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Success! Check your email for confirmation link.");
    }
    setLoading(false);
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      phone: phone.startsWith('+') ? phone : `+234${phone}`,
      password,
      options: {
        data: {
          full_name: name,
          university: university
        },
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Success! Check your phone for OTP verification.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 flex items-center justify-center px-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white border-opacity-20">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Join SkillBarter<span className="text-green-400">NG</span>
          </h2>

          {referrerId && (
            <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded-lg p-3 mb-6 text-center">
              <p className="text-green-300 text-sm">
                🎉 You were invited by a friend! Join SkillBarterNG and start earning rewards together! 🌟
              </p>
            </div>
          )}

          {/* Signup Method Tabs */}
          <div className="flex mb-6 bg-gray-800 bg-opacity-60 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setSignupMethod("email")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                signupMethod === "email"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignupMethod("phone")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                signupMethod === "phone"
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Phone
            </button>
          </div>

          {signupMethod === "email" ? (
            <form onSubmit={handleEmailSignup} className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              >
                <option value="" disabled>Select Your University</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Password (min 6 chars)"
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSignup} className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g., 08012345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              >
                <option value="" disabled>Select Your University</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Password (min 6 chars)"
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {message && (
            <p className={`text-center mt-6 font-semibold ${message.includes("Success") ? "text-green-300" : "text-red-300"}`}>
              {message}
            </p>
          )}

          <p className="text-gray-300 text-center mt-8">
            Already have an account? {" "}
            <Link href="/login" className="text-green-400 hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
