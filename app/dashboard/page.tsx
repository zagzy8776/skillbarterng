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

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Professional Header Section */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 mb-12 border border-pink-200 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email || "Student"}!
                </h1>
                <p className="text-xl text-gray-700">
                  {university !== "your school" ? `${university} Student 🇳🇬` : "Add your university to see school mates"}
                </p>
              </div>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{totalConnections}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{activeSwaps}</div>
                  <div className="text-sm text-gray-600">Active Swaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{profileCompletion}%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg">
                <span className="text-lg">🏆</span>
                <span>Top Tutor</span>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg">
                <span className="text-lg">⭐</span>
                <span>5-Star Rated</span>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg">
                <span className="text-lg">🔥</span>
                <span>Active Learner</span>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold shadow-lg">
                <span className="text-lg">💎</span>
                <span>Verified Student</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-900 font-semibold">Profile Completion</span>
                  <span className="text-green-600 font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-900 font-semibold">Skills Learned</span>
                  <span className="text-purple-600 font-bold">75%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-900 font-semibold">Teaching Impact</span>
                  <span className="text-yellow-600 font-bold">90%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="flex justify-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-6 py-3 bg-white rounded-full text-gray-900 font-semibold hover:bg-gray-100 transition"
              >
                🔍 Search & Filter
              </button>
            </div>
            {showSearch && (
              <div className="mt-4 bg-white rounded-2xl p-6 border border-gray-300">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Search by name, university, or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value as 'name' | 'university' | 'skill')}
                    className="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="name">Search by Name</option>
                    <option value="university">Search by University</option>
                    <option value="skill">Search by Skill</option>
                  </select>
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
                <button className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition">
                  Invite Friends
                </button>
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
