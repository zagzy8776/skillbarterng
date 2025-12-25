'use client'

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const popularTeach = [
  "Graphics Design (Canva/Figma/Photoshop)",
  "Video Editing (CapCut/Premiere)",
  "UI/UX Design (Figma)",
  "Digital Marketing (Ads/SEO)",
  "Python Programming",
  "Crypto/Forex Trading Tips",
  "CV & Interview Prep",
  "Spoken English/Accent Training",
  "Web Development (HTML/CSS/JS)",
  "Microsoft Excel Advanced",
  "Photography",
  "Music Production (FL Studio)",
  "Makeup & Gele Tying",
  "Cooking & Baking",
  "Public Speaking",
];

const popularWant = [
  "Graphics Design",
  "Video Editing",
  "UI/UX Design",
  "Digital Marketing",
  "Python Programming",
  "Crypto/Forex Trading",
  "CV & Interview Prep",
  "Spoken English",
  "Public Speaking",
  "Photography",
  "Web Development",
  "Music Production",
  "Fashion Design",
  "Betting Tips & Analysis",
  "Dance Choreography",
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [wantSkills, setWantSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setTeachSkills(user.user_metadata?.teach_skills || []);
        setWantSkills(user.user_metadata?.want_skills || []);
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  const addSkill = (list: string[], setList: Function, skill: string) => {
    if (!list.includes(skill)) {
      setList([...list, skill]);
    }
  };

  const removeSkill = (list: string[], setList: Function, skill: string) => {
    setList(list.filter(s => s !== skill));
  };

  const saveSkills = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { 
        teach_skills: teachSkills, 
        want_skills: wantSkills 
      }
    });
    if (!error) {
      alert("Skills saved sharp sharp! 🔥 Now you fit start swapping with school mates");
      router.push("/dashboard");
    } else {
      alert("Error saving skills: " + error.message);
    }
  };

  if (loading) return <div className="text-white text-center pt-32 text-2xl">Loading your profile...</div>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Add Your Skills & Start Swapping
          </h1>
          <p className="text-xl text-gray-200 text-center mb-12">
            {user.user_metadata?.full_name || "Student"} from {user.user_metadata?.university || "your school"} — make we know wetin you fit teach and wetin you wan learn!
          </p>

          {/* Skills I Can Teach */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Skills I Can Teach</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {popularTeach.map(skill => (
                <button
                  key={skill}
                  onClick={() => addSkill(teachSkills, setTeachSkills, skill)}
                  disabled={teachSkills.includes(skill)}
                  className="px-4 py-2 bg-green-500 bg-opacity-30 text-green-300 rounded-full hover:bg-opacity-50 disabled:opacity-50 transition"
                >
                  + {skill}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {teachSkills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-green-600 text-white rounded-full flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeSkill(teachSkills, setTeachSkills, skill)} className="text-xl">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Skills I Want to Learn</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {popularWant.map(skill => (
                <button
                  key={skill}
                  onClick={() => addSkill(wantSkills, setWantSkills, skill)}
                  disabled={wantSkills.includes(skill)}
                  className="px-4 py-2 bg-pink-500 bg-opacity-30 text-pink-300 rounded-full hover:bg-opacity-50 disabled:opacity-50 transition"
                >
                  + {skill}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {wantSkills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-pink-600 text-white rounded-full flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeSkill(wantSkills, setWantSkills, skill)} className="text-xl">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={saveSkills}
              disabled={teachSkills.length === 0 || wantSkills.length === 0}
              className="px-12 py-5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
            >
              Save Skills & Go Back to Dashboard 🔥
            </button>
          </div>
        </div>
      </section>
    </>
  );
}