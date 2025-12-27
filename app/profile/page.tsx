'use client'

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, Plus, X, CheckCircle, User } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    profile_pic_url?: string;
    teach_skills?: string[];
    want_skills?: string[];
    [key: string]: unknown;
  };
};

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
  const [user, setUser] = useState<UserType | null>(null);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [wantSkills, setWantSkills] = useState<string[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user ?? null;
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      setTeachSkills((u.user_metadata?.teach_skills as string[]) || []);
      setWantSkills((u.user_metadata?.want_skills as string[]) || []);
      setProfilePicUrl(u.user_metadata?.profile_pic_url as string | undefined || null);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const uploadProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || !user) return;

    // client-side validation
    if (selected.size > 3 * 1024 * 1024) {
      alert("Image must be smaller than 3MB.");
      return;
    }

    setUploading(true);
    const fileExt = selected.name.split('.').pop() ?? "jpg";
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pics')
      .upload(fileName, selected, { upsert: true });

    if (uploadError) {
      alert("Upload error: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { profile_pic_url: publicUrl }
    });

    if (updateError) {
      alert("Save error: " + updateError.message);
    } else {
      setProfilePicUrl(publicUrl);
      alert("Profile pic uploaded!");
    }
    setUploading(false);
  };

  const addSkill = (list: string[], setList: Dispatch<SetStateAction<string[]>>, skill: string) => {
    setList(prev => (prev.includes(skill) ? prev : [...prev, skill]));
  };

  const removeSkill = (setList: Dispatch<SetStateAction<string[]>>, skill: string) => {
    setList(prev => prev.filter(s => s !== skill));
  };

  const saveSkills = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { teach_skills: teachSkills, want_skills: wantSkills }
    });
    if (!error) {
      alert("Skills saved!");
      router.push("/dashboard");
    } else {
      alert("Error saving skills: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center pt-32 text-2xl">
        <span className="skeleton w-64 h-8 mx-auto rounded" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Complete Your Profile</h1>

        {/* Profile Pic Upload */}
        <div className="text-center mb-12" aria-live="polite" aria-busy={uploading}>
          <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-700 border-4 border-green-500 mb-6 shadow-2xl">
            {uploading ? (
              <div className="skeleton rounded-full w-full h-full" aria-hidden="true" />
            ) : profilePicUrl ? (
              <Image src={profilePicUrl} alt="Profile" width={160} height={160} className="object-cover w-full h-full rounded-full" />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-6xl font-bold">?</div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <label className="cursor-pointer inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition shadow-md">
              {uploading ? "Uploading..." : "Upload"}
              <input type="file" accept="image/*" onChange={uploadProfilePic} className="hidden" disabled={uploading} />
            </label>
            <button onClick={() => setProfilePicUrl(null)} className="px-6 py-3 bg-gray-700 text-white rounded-full shadow-md">Remove</button>
          </div>

          <div className="sr-only" aria-live="polite">
            {uploading ? "Uploading profile image" : "Profile image ready"}
          </div>

          <p className="text-gray-300 mt-4">Make your profile stand out!</p>
        </div>

        {/* Skills I Can Teach */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-12 glass" aria-busy={uploading}>
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

          <div className="flex flex-wrap gap-3" role="list" aria-label="Selected teach skills">
            {teachSkills.length === 0 ? (
              <>
                <span className="skeleton w-24 h-8 rounded" aria-hidden="true" />
                <span className="skeleton w-24 h-8 rounded" aria-hidden="true" />
                <span className="skeleton w-24 h-8 rounded" aria-hidden="true" />
                <span className="text-gray-400">No skills selected yet — pick from above</span>
              </>
            ) : (
              teachSkills.map(skill => (
                <span key={skill} role="listitem" className="px-4 py-2 bg-green-600 text-white rounded-full flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeSkill(setTeachSkills, skill)} className="text-xl" aria-label={`Remove ${skill}`}>×</button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-12 glass">
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
                <button onClick={() => removeSkill(setWantSkills, skill)} className="text-xl">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={saveSkills}
            disabled={teachSkills.length === 0 && wantSkills.length === 0}
            className="px-12 py-5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition"
          >
            Save Profile & Go to Dashboard 🔥
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          By saving you agree to our Terms. Keep contact info professional.
        </div>
      </div>
    </section>
  );
}
