'use client'

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    university?: string;
    profile_pic_url?: string;
  };
}

export default function InvitePage() {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const referralLink = user ? `${window.location.origin}/signup?ref=${user.id}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Hey! Join me on SkillBarterNG - the best platform for Nigerian students to swap skills! 🎓✨\n\nLearn Python, design, trading, and more from fellow students. It's FREE! \n\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const text = "Join me on SkillBarterNG - swap skills with Nigerian students! 🎓✨ Learn Python, design, trading & more. FREE! #SkillBarterNG";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="text-white text-2xl">Loading...</div>
          </div>
        </section>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Please Log In First
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              You need to be logged in to invite friends.
            </p>
            <Link href="/login" className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition">
              Log In
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Invite Your Friends!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Help your schoolmates discover SkillBarterNG! Share the platform and earn rewards when they join. 🌟
            </p>
          </div>

          {/* Referral Link Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-gray-200 dark:border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Your Personal Referral Link
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={copyToClipboard}
                className={`px-6 py-3 font-bold rounded-lg transition ${
                  copied
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Share this link with your friends. When they sign up, they'll be connected to you! 🤝
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-gray-200 dark:border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Share on Social Media
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl">💬</span>
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareOnFacebook}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl">📘</span>
                <span>Facebook</span>
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl">🐦</span>
                <span>Twitter</span>
              </button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-8 border border-green-200 dark:border-green-800 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🎁 Referral Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Earn XP Points</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get 100 XP for each friend who joins and completes their profile!
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Unlock Achievements</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reach new levels and unlock special badges for being a community builder!
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-gray-200 dark:border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              How Referral Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">1</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Share Your Link</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Send your referral link to friends via WhatsApp, Facebook, or copy it directly.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">2</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">They Sign Up</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your friends click the link and create their SkillBarterNG account.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">3</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">You Both Benefit</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You earn XP and achievements, they get access to skill swapping!
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
            >
              Back to Dashboard ←
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
