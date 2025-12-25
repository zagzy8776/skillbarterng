'use client'

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [university, setUniversity] = useState("");
  const [filterMySchool, setFilterMySchool] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setUniversity(user.user_metadata?.university || "Not set");
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

  // Dummy matches - later replace with real from Supabase
  const dummyMatches = [
    { name: "Chioma", university: "UNILAG", teach: "Graphics Design", want: "Video Editing" },
    { name: "Tunde", university: "UNIBEN", teach: "Python Programming", want: "Crypto Trading Tips" },
    { name: "Aisha", university: "Covenant University", teach: "Digital Marketing", want: "UI/UX Design" },
    { name: "Emeka", university: "OAU", teach: "CV & Interview Prep", want: "Spoken English" },
    { name: "Fatima", university: "UI", teach: "Video Editing", want: "Graphics Design" },
    { name: "David", university: "UNILORIN", teach: "Crypto/Forex Tips", want: "Python Programming" },
  ];

  const filteredMatches = filterMySchool 
    ? dummyMatches.filter(m => m.university === university)
    : dummyMatches;

  if (!user) return null;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Welcome back, {user.user_metadata?.full_name || "Student"}!
          </h1>
          <p className="text-xl text-gray-200 text-center mb-8">
            {university !== "Not set" ? `${university} Student 🇳🇬` : "Complete your profile to see your school mates"}
          </p>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-full p-1 flex">
              <button
                onClick={() => setFilterMySchool(true)}
                className={`px-8 py-3 rounded-full font-semibold transition ${filterMySchool ? "bg-green-500 text-white" : "text-gray-300"}`}
              >
                My School
              </button>
              <button
                onClick={() => setFilterMySchool(false)}
                className={`px-8 py-3 rounded-full font-semibold transition ${!filterMySchool ? "bg-green-500 text-white" : "text-gray-300"}`}
              >
                All Schools
              </button>
            </div>
          </div>

          {/* Trending Skills */}
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Trending Skills This Week
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {popularSkills.map((skill, i) => (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white border-opacity-20">
                <h3 className="text-xl font-semibold text-white mb-4">{skill.name}</h3>
                <p className="text-green-300 text-lg">{skill.offer} people dey teach am</p>
                <p className="text-pink-300 text-lg">{skill.want} people wan learn am</p>
              </div>
            ))}
          </div>

          {/* Matches Feed */}
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Potential Swap Matches {filterMySchool ? "in Your School" : "Across Naija"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredMatches.length > 0 ? filteredMatches.map((match, i) => (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white border-opacity-20">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" /> {/* Placeholder for profile pic later */}
                <h3 className="text-2xl font-bold text-white mb-2">{match.name}</h3>
                <p className="text-green-300 mb-4">{match.university}</p>
                <p className="text-white mb-2">Dey teach: <span className="font-semibold text-green-300">{match.teach}</span></p>
                <p className="text-white mb-6">Wan learn: <span className="font-semibold text-pink-300">{match.want}</span></p>
                <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition">
                  Send Swap Request
                </button>
              </div>
            )) : (
              <p className="text-gray-300 text-center col-span-full text-xl">
                No matches yet for your school — invite your mates to join! 🔥
              </p>
            )}
          </div>

          {/* CTA if no skills yet */}
          {user.user_metadata?.teach_skills?.length > 0 ? null : (
            <div className="text-center">
              <Link
                href="/profile"
                className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
              >
                Add Your Skills & Start Swapping
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}