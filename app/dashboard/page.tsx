
'use client'

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    university?: string;
    teach_skills?: string[];
    want_skills?: string[];
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [university, setUniversity] = useState("");
  const [filterMySchool, setFilterMySchool] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<'name' | 'university' | 'skill'>('name');
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Advanced Filtering States
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest'>('relevance');

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error getting user:", error);
          // Don't redirect, just set loading to false
        } else if (!user) {
          // Don't redirect, just set loading to false
        } else {
          setUser(user);
          setUniversity(user.user_metadata?.university || "your school");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  const popularSkills = [
    { name: "Graphics Design (Canva/Figma)", offer: 68, want: 142 },
    { name: "Video Editing (CapCut/Premiere)", offer: 55, want: 128 },
    { name: "UI/UX Design", offer: 42, want: 98 },
    { name: "Digital Marketing", offer: 61, want: 115 },
    { name: "Python Programming", offer: 49, want: 89 },
    { name: "Crypto/Forex Trading Tips", offer: 38, want: 105 },
    { name: "CV & Interview Prep", offer: 72, want: 134 },
    { name: "Spoken English/Accent", offer: 45, want: 92 },
  ];

  // Your real seeded fake hot profiles with actual UUIDs
  const dummyMatches = [
    { id: "0bb7f960-4527-4cb9-9a16-32a5ff2f6346", name: "Chioma Okonkwo", university: "University of Lagos (UNILAG)", teach: "Graphics Design & Makeup", want: "Python Programming" },
    { id: "e6dc951b-e963-4a38-a3ae-df79ddb28308", name: "Tunde Adebayo", university: "Obafemi Awolowo University (OAU)", teach: "Crypto/Forex Trading Tips", want: "Graphics Design" },
    { id: "522296d3-9f08-41de-bc8a-f1a903c9e429", name: "Aisha Yusuf", university: "Covenant University", teach: "UI/UX Design", want: "CV Prep" },
    { id: "716ffe61-94b4-4de8-ac1f-541d4b9f341f", name: "Fatima Ibrahim", university: "University of Ibadan (UI)", teach: "Makeup & Gele Tying", want: "Photography" },
    { id: "5932b218-5038-40f7-a2cb-1ac1bff46126", name: "Emeka Okafor", university: "University of Benin (UNIBEN)", teach: "Python Programming", want: "Video Editing" },
  ];

  const filteredMatches = (filterMySchool ? dummyMatches.filter(m => m.university === university) : dummyMatches)
    .filter(m => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      if (searchBy === 'name') return m.name.toLowerCase().includes(q);
      if (searchBy === 'university') return m.university.toLowerCase().includes(q);
      // skill search: match either teach or want
      return m.teach.toLowerCase().includes(q) || m.want.toLowerCase().includes(q);
    });
  const sendSwapRequest = async (targetId: string) => {
    if (!user) return;

    const conversationId = `${user.id}-${targetId}`;

    const { error } = await supabase.from('swap_requests').insert({
      requester_id: user.id,
      target_id: targetId,
      conversation_id: conversationId,
      status: "pending"
    });

    if (!error) {
      router.push(`/chat/${conversationId}`);
    } else {
      alert("Error sending request: " + error.message);
    }
  };



  if (loading) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <div className="text-white text-2xl mb-4">Loading Dashboard...</div>
              <div className="skeleton w-96 h-12 mx-auto mb-4 rounded"></div>
              <div className="skeleton w-64 h-6 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="skeleton w-32 h-6 mx-auto mb-4 rounded"></div>
                  <div className="skeleton w-24 h-4 mx-auto mb-2 rounded"></div>
                  <div className="skeleton w-20 h-4 mx-auto rounded"></div>
                </div>
              ))}
            </div>
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
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to SkillBarterNG!
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Please log in to access your dashboard and start swapping skills.
              </p>
              <Link href="/login" className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition">
                Log In
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const hasSkills = (user.user_metadata?.teach_skills?.length ?? 0) > 0 || (user.user_metadata?.want_skills?.length ?? 0) > 0;
  const profileCompletion = hasSkills ? 100 : 50; // Simple calculation
  const totalConnections = 12; // Mock data
  const activeSwaps = 3; // Mock data

  // Enhanced Achievement System
  const userXP = Math.floor(Math.random() * 2500) + 500; // Mock XP (would come from database)
  const userLevel = Math.floor(userXP / 500) + 1;
  const xpToNextLevel = (userLevel * 500) - (userXP % 500);
  const xpProgress = ((userXP % 500) / 500) * 100;

  // Dynamic achievements based on user data
  const achievements = [
    { id: 'first-profile', name: 'First Steps', emoji: '👶', unlocked: profileCompletion > 0, desc: 'Complete your profile' },
    { id: 'skill-teacher', name: 'Skill Sharer', emoji: '🎓', unlocked: hasSkills && (user.user_metadata?.teach_skills?.length ?? 0) > 0, desc: 'Offer to teach a skill' },
    { id: 'skill-learner', name: 'Knowledge Seeker', emoji: '📚', unlocked: hasSkills && (user.user_metadata?.want_skills?.length ?? 0) > 0, desc: 'Express interest in learning' },
    { id: 'first-swap', name: 'First Swap', emoji: '🤝', unlocked: activeSwaps > 0, desc: 'Complete your first skill exchange' },
    { id: 'social-butterfly', name: 'Social Butterfly', emoji: '🦋', unlocked: totalConnections >= 10, desc: 'Connect with 10+ users' },
    { id: 'top-tutor', name: 'Top Tutor', emoji: '🏆', unlocked: userLevel >= 5, desc: 'Reach level 5' },
    { id: 'verified-student', name: 'Verified Student', emoji: '💎', unlocked: profileCompletion >= 80, desc: '80%+ profile completion' },
    { id: 'skill-master', name: 'Skill Master', emoji: '🧠', unlocked: (user.user_metadata?.teach_skills?.length ?? 0) >= 3, desc: 'Offer 3+ skills to teach' },
    { id: 'active-learner', name: 'Active Learner', emoji: '🔥', unlocked: activeSwaps >= 5, desc: 'Complete 5+ swaps' },
    { id: 'community-helper', name: 'Community Helper', emoji: '❤️', unlocked: Math.random() > 0.7, desc: 'Help 10+ students' },
    { id: 'early-adopter', name: 'Early Adopter', emoji: '🚀', unlocked: true, desc: 'Join SkillBarterNG beta' },
    { id: 'feedback-champion', name: 'Feedback Champion', emoji: '⭐', unlocked: Math.random() > 0.8, desc: 'Rate 10+ sessions' },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const recentAchievements = unlockedAchievements.slice(0, 4); // Show first 4 unlocked

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Professional Header Section with Gradient Theme */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-8 mb-12 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </div>
                  <div className="h-px bg-white/30 flex-1 hidden md:block"></div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                  Welcome back, {user.user_metadata?.full_name || user.email || "Student"}!
                </h1>
                <p className="text-xl text-white/90 drop-shadow-md">
                  {university !== "your school" ? `${university} Student 🇳🇬` : "Add your university to see school mates"}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm">Ready to learn something new today?</span>
                </div>
              </div>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{totalConnections}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{activeSwaps}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Active Swaps</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{profileCompletion}%</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Profile Complete</div>
                </div>
              </div>
            </div>

            {/* XP and Level Display */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-4xl">⭐</div>
                <div>
                  <div className="text-2xl font-bold">Level {userLevel}</div>
                  <div className="text-sm opacity-90">{userXP} XP</div>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-2">
                <div
                  className="bg-white rounded-full h-4 transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-90">{xpToNextLevel} XP to next level</p>
            </div>

            {/* Achievement Badges */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Your Achievements 🏆</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer group"
                    title={achievement.desc}
                  >
                    <span className="text-lg">{achievement.emoji}</span>
                    <span className="hidden sm:inline">{achievement.name}</span>
                  </div>
                ))}
                {unlockedAchievements.length > 4 && (
                  <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg">
                    <span className="text-lg">🎖️</span>
                    <span className="hidden sm:inline">+{unlockedAchievements.length - 4} More</span>
                  </div>
                )}
              </div>
              {unlockedAchievements.length === 0 && (
                <p className="text-center text-gray-600 mt-4">Complete your profile to unlock achievements! 🌟</p>
              )}
            </div>

            {/* Learning Analytics Dashboard */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">📊 Your Learning Journey</h3>

              {/* Main Analytics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">⏱️</div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">47h</div>
                      <div className="text-sm text-gray-600">Learning Time</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">+12h this month</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{activeSwaps}</div>
                      <div className="text-sm text-gray-600">Skills Mastered</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">2 in progress</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">👨‍🏫</div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{Math.floor(totalConnections * 0.7)}</div>
                      <div className="text-sm text-gray-600">Students Taught</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600">4.8⭐ average rating</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>
                  <div className="text-xs text-orange-600">Keep it up!</div>
                </div>
              </div>

              {/* Detailed Progress Bars */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-semibold text-lg">Profile Completion</span>
                    <span className="text-green-600 font-bold text-lg">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Add skills to complete</span>
                    <span>{profileCompletion}/100</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-semibold text-lg">Monthly Progress</span>
                    <span className="text-purple-600 font-bold text-lg">85%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>December goal</span>
                    <span>5/6 skills</span>
                  </div>
                </div>
              </div>

              {/* Skills Progress Grid */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Development Progress</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Python Programming", progress: 75, status: "Active" },
                    { name: "UI/UX Design", progress: 60, status: "Learning" },
                    { name: "Digital Marketing", progress: 90, status: "Mastered" },
                    { name: "Public Speaking", progress: 40, status: "New" }
                  ].map((skill, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          skill.status === 'Mastered' ? 'bg-green-100 text-green-700' :
                          skill.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                          skill.status === 'Learning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {skill.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            skill.status === 'Mastered' ? 'bg-green-500' :
                            skill.status === 'Active' ? 'bg-blue-500' :
                            skill.status === 'Learning' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-gray-600">{skill.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-3xl p-8 mb-12 border border-gray-200 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
              How SkillBarterNG Works 🚀
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Swap skills with fellow Nigerian students in 4 simple steps. Learn what you want, teach what you know!
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition transform group-hover:scale-110">
                  1️⃣
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Set Up Your Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Add your university, skills you can teach, and what you want to learn. Make your profile shine! ✨
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition transform group-hover:scale-110">
                  2️⃣
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Matches</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse trending skills and find students in your school or across Nigeria who match your interests.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition transform group-hover:scale-110">
                  3️⃣
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Send Swap Requests</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with matches and send skill swap requests. Chat and agree on how you'll exchange knowledge!
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition transform group-hover:scale-110">
                  4️⃣
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Learn & Grow</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start teaching and learning! Earn badges, build connections, and become a skill master. 🌟
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link
                href="/profile"
                className="inline-block px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
              >
                Get Started Now - It's Free! 🎯
              </Link>
            </div>
          </div>

          {/* Advanced Search & Filter */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-6 py-3 bg-white rounded-full text-gray-900 font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                🔍 Advanced Search & Filter
              </button>
              <button
                onClick={() => router.push('/ai-chat')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🤖 AI Chat
              </button>
            </div>

            {showSearch && (
              <div className="mt-4 bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                {/* Basic Search */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Basic Search</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Search by name, university, or skill..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                    <select
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value as 'name' | 'university' | 'skill')}
                      className="px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value="name">Search by Name</option>
                      <option value="university">Search by University</option>
                      <option value="skill">Search by Skill</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location</label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value="all">All Locations</option>
                      <option value="lagos">Lagos State</option>
                      <option value="ogun">Ogun State</option>
                      <option value="oyo">Oyo State</option>
                      <option value="osun">Osun State</option>
                      <option value="ondo">Ondo State</option>
                      <option value="ekiti">Ekiti State</option>
                      <option value="kwara">Kwara State</option>
                      <option value="kogi">Kogi State</option>
                      <option value="niger">Niger State</option>
                      <option value="abuja">Abuja (FCT)</option>
                    </select>
                  </div>

                  {/* Skill Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Skill Level</label>
                    <select
                      value={skillLevelFilter}
                      onChange={(e) => setSkillLevelFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">⏰ Availability</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value="all">Any Time</option>
                      <option value="online">Online Only</option>
                      <option value="offline">In-Person Only</option>
                      <option value="both">Both Online & Offline</option>
                    </select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">⭐ Min Rating</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                      <option value={5}>5 Stars Only</option>
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 Sort Results</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="relevance"
                        checked={sortBy === 'relevance'}
                        onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'newest')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Most Relevant</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="rating"
                        checked={sortBy === 'rating'}
                        onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'newest')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Highest Rated</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="newest"
                        checked={sortBy === 'newest'}
                        onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'newest')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Recently Active</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      // Reset all filters
                      setSearchQuery('');
                      setSearchBy('name');
                      setLocationFilter('all');
                      setSkillLevelFilter('all');
                      setAvailabilityFilter('all');
                      setMinRating(0);
                      setSortBy('relevance');
                    }}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                  >
                    🔄 Reset Filters
                  </button>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    ✅ Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-pink-100 rounded-full p-1 flex">
              <button
                onClick={() => setFilterMySchool(true)}
                className={`px-8 py-3 rounded-full font-semibold transition ${filterMySchool ? "bg-pink-500 text-white" : "text-gray-600"}`}
              >
                My School
              </button>
              <button
                onClick={() => setFilterMySchool(false)}
                className={`px-8 py-3 rounded-full font-semibold transition ${!filterMySchool ? "bg-pink-500 text-white" : "text-gray-600"}`}
              >
                All Schools
              </button>
            </div>
          </div>

          {/* Success Stories Section */}
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-3xl p-8 mb-16 border border-green-200 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
              🌟 Success Stories
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Real students transforming their careers through skill swapping on SkillBarterNG
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Story 1 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Adebayo Johnson</h3>
                    <p className="text-sm text-gray-600">UI/UX Designer at TechCorp</p>
                    <p className="text-xs text-green-600">University of Lagos</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "I started with zero design skills. Through SkillBarterNG, I learned Figma from a UNILAG student and now I have my dream job!"
                </blockquote>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">Before: Beginner</span>
                  <span className="text-green-500">After: Professional</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Learned: Figma, Adobe XD • Taught: Python, Data Analysis
                </div>
              </div>

              {/* Story 2 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    K
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Kemi Adeolu</h3>
                    <p className="text-sm text-gray-600">Content Creator</p>
                    <p className="text-xs text-green-600">Covenant University</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "I wanted to start a YouTube channel but couldn't edit videos. A student from OAU taught me CapCut, and now I have 50K subscribers!"
                </blockquote>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">Before: No editing skills</span>
                  <span className="text-green-500">After: Content creator</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Learned: Video Editing, Content Strategy • Taught: Makeup, Photography
                </div>
              </div>

              {/* Story 3 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    T
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Tunde Olayinka</h3>
                    <p className="text-sm text-gray-600">Crypto Trader</p>
                    <p className="text-xs text-green-600">Obafemi Awolowo University</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "From losing money in crypto to making consistent profits. A UNIBEN student taught me technical analysis - now I'm financially free!"
                </blockquote>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">Before: Gambling with crypto</span>
                  <span className="text-green-500">After: Strategic trader</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Learned: Technical Analysis, Risk Management • Taught: Forex Trading, Investment Strategies
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Ready to write your own success story?</p>
              <Link
                href="/profile"
                className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Start Your Journey 🚀
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Trending Skills This Week
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {popularSkills.map((skill, i) => (
              <div key={i} className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-2xl p-6 text-center border border-pink-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{skill.name}</h3>
                <p className="text-green-600 text-lg">{skill.offer} people dey teach am</p>
                <p className="text-pink-600 text-lg">{skill.want} people wan learn am</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Potential Swap Matches {filterMySchool ? "in Your School" : "Across Naija"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredMatches.length > 0 ? filteredMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-8 text-center border border-gray-300 shadow-lg hover:shadow-xl transition transform hover:scale-105 group">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {match.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{match.name}</h3>
                <p className="text-green-600 mb-4 text-sm">{match.university}</p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 text-sm">🎓 <span className="font-semibold text-green-600">{match.teach}</span></p>
                  <p className="text-gray-900 text-sm">📚 <span className="font-semibold text-pink-600">{match.want}</span></p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => sendSwapRequest(match.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700 text-white font-bold rounded-full transition group-hover:from-pink-600 group-hover:via-pink-700 group-hover:to-pink-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Send Swap Request
                  </button>
                  <button
                    onClick={() => router.push(`/profile/${match.id}`)}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white font-bold rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-xl mb-4">
                  No matches yet — invite your mates to join! 🔥
                </p>
                <Link
                  href="/invite"
                  className="inline-block px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Invite Friends 🚀
                </Link>
              </div>
            )}
          </div>

          {!hasSkills && (
            <div className="text-center">
              <Link href="/profile" className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition">
                Add Your Skills & Start Swapping
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
