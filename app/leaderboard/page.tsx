'use client';

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type LeaderboardUser = {
  id: string;
  full_name: string;
  university?: string;
  profile_pic_url?: string;
  points: number;
  level: number;
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, university, profile_pic_url, points, level")
        .order("points", { ascending: false })
        .order("level", { ascending: false })
        .limit(100); // Limit to top 100 users for performance

      if (error) {
        console.error("Error fetching leaderboard:", error.message);
        setError("Failed to load leaderboard. Please try again.");
      } else {
        setLeaderboard(data as LeaderboardUser[]);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6 flex items-center justify-center">
        <p className="text-white text-2xl">Loading Leaderboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6 flex items-center justify-center">
        <p className="text-red-400 text-2xl">Error: {error}</p>
      </section>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6">
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">SkillBarterNG Leaderboard</h1>

          {leaderboard.length === 0 ? (
            <p className="text-gray-300 text-center text-xl">No one on the leaderboard yet. Start earning points!</p>
          ) : (
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-600 text-gray-300 font-bold text-sm sm:text-base lg:text-lg">
                <p>Rank</p>
                <p>Name</p>
                <p className="text-center sm:text-left">University</p>
                <p className="text-center sm:text-right">Points</p>
              </div>
              {leaderboard.map((user, index) => (
                <div key={user.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-gray-700 last:border-b-0 text-white items-center">
                  <p className="text-lg sm:text-xl font-bold text-green-300">#{index + 1}</p>
                  <p className="text-base sm:text-lg">{user.full_name || "Anonymous"}</p>
                  <p className="text-sm sm:text-md text-gray-400 text-center sm:text-left">{user.university || "N/A"}</p>
                  <p className="text-base sm:text-lg font-semibold text-center sm:text-right">{user.points}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
