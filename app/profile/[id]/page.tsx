'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Navbar from "@/components/Navbar";

type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    profile_pic_url?: string;
    full_name?: string;
    university?: string;
    teach_skills?: string[];
    want_skills?: string[];
    [key: string]: unknown;
  };
};

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      if (!userId) return;

      try {
        // For now, we'll use dummy data since we don't have a users table
        // In a real app, you'd fetch from a users table
        const dummyUsers: Record<string, UserType> = {
          "0bb7f960-4527-4cb9-9a16-32a5ff2f6346": {
            id: "0bb7f960-4527-4cb9-9a16-32a5ff2f6346",
            email: "chioma@example.com",
            user_metadata: {
              full_name: "Chioma Okonkwo",
              university: "University of Lagos (UNILAG)",
              teach_skills: ["Graphics Design & Makeup"],
              want_skills: ["Python Programming"],
              profile_pic_url: "/vercel.svg"
            }
          },
          "e6dc951b-e963-4a38-a3ae-df79ddb28308": {
            id: "e6dc951b-e963-4a38-a3ae-df79ddb28308",
            email: "tunde@example.com",
            user_metadata: {
              full_name: "Tunde Adebayo",
              university: "Obafemi Awolowo University (OAU)",
              teach_skills: ["Crypto/Forex Trading Tips"],
              want_skills: ["Graphics Design"],
              profile_pic_url: "/vercel.svg"
            }
          },
          "522296d3-9f08-41de-bc8a-f1a903c9e429": {
            id: "522296d3-9f08-41de-bc8a-f1a903c9e429",
            email: "aisha@example.com",
            user_metadata: {
              full_name: "Aisha Yusuf",
              university: "Covenant University",
              teach_skills: ["UI/UX Design"],
              want_skills: ["CV Prep"],
              profile_pic_url: "/vercel.svg"
            }
          },
          "716ffe61-94b4-4de8-ac1f-541d4b9f341f": {
            id: "716ffe61-94b4-4de8-ac1f-541d4b9f341f",
            email: "fatima@example.com",
            user_metadata: {
              full_name: "Fatima Ibrahim",
              university: "University of Ibadan (UI)",
              teach_skills: ["Makeup & Gele Tying"],
              want_skills: ["Photography"],
              profile_pic_url: "/vercel.svg"
            }
          },
          "5932b218-5038-40f7-a2cb-1ac1bff46126": {
            id: "5932b218-5038-40f7-a2cb-1ac1bff46126",
            email: "emeka@example.com",
            user_metadata: {
              full_name: "Emeka Okafor",
              university: "University of Benin (UNIBEN)",
              teach_skills: ["Python Programming"],
              want_skills: ["Video Editing"],
              profile_pic_url: "/vercel.svg"
            }
          }
        };

        const profileUser = dummyUsers[userId];
        if (profileUser) {
          setUser(profileUser);
        } else {
          // If user not found, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [userId, router]);

  const sendSwapRequest = async () => {
    if (!currentUser || !user) return;

    setSendingRequest(true);
    const conversationId = `${currentUser.id}-${user.id}`;

    const { error } = await supabase.from('swap_requests').insert({
      requester_id: currentUser.id,
      target_id: user.id,
      conversation_id: conversationId,
      status: "pending"
    });

    if (!error) {
      router.push(`/chat/${conversationId}`);
    } else {
      alert("Error sending request: " + error.message);
    }
    setSendingRequest(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="skeleton w-96 h-12 mx-auto mb-4 rounded"></div>
              <div className="skeleton w-64 h-6 mx-auto rounded"></div>
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
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                User Not Found
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                The user you're looking for doesn't exist.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white border-opacity-20">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase() || '?'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {user.user_metadata?.full_name || user.email || "Student"}
              </h1>
              <p className="text-xl text-gray-200 mb-4">
                {user.user_metadata?.university ? `${user.user_metadata.university} Student 🇳🇬` : "Student"}
              </p>

              {/* Rating Section */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex text-yellow-400 text-2xl">
                    ★★★★★
                  </div>
                  <span className="text-white font-bold text-lg">4.8</span>
                  <span className="text-gray-300">(24 reviews)</span>
                </div>
                <p className="text-green-300 text-sm">Highly rated tutor • 95% success rate</p>
              </div>

              {!isOwnProfile && currentUser && (
                <button
                  onClick={sendSwapRequest}
                  disabled={sendingRequest}
                  className="inline-block px-8 py-4 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition"
                >
                  {sendingRequest ? "Sending Request..." : "Send Swap Request"}
                </button>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills I Can Teach */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                🎓 Skills I Can Teach
              </h2>
              {user.user_metadata?.teach_skills && user.user_metadata.teach_skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.user_metadata.teach_skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No skills listed yet.</p>
              )}
            </div>

            {/* Skills I Want to Learn */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                📚 Skills I Want to Learn
              </h2>
              {user.user_metadata?.want_skills && user.user_metadata.want_skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.user_metadata.want_skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-pink-600 text-white rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No skills listed yet.</p>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-block px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
