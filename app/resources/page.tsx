'use client'

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Resources() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Resources 📚
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Coming soon! Access tutorials, guides, and study materials to enhance your skills.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
