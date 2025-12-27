'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    profile_pic_url?: string;
    full_name?: string;
    teach_skills?: string[];
    want_skills?: string[];
    notifications_enabled?: boolean;
    privacy_mode?: boolean;
    theme?: string;
    language?: string;
    timezone?: string;
    font_size?: string;
    high_contrast?: boolean;
    email_notifications?: boolean;
    message_notifications?: boolean;
    match_notifications?: boolean;
    profile_visibility?: string;
    [key: string]: unknown;
  };
};

export default function Settings() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setNotificationsEnabled(u.user_metadata?.notifications_enabled ?? true);
      setPrivacyMode(u.user_metadata?.privacy_mode ?? false);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        notifications_enabled: notificationsEnabled,
        privacy_mode: privacyMode,
        theme: theme,
        language: language
      }
    });
    if (error) {
      alert("Error saving settings: " + error.message);
    } else {
      alert("Settings saved!");
    }
    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      // Delete user data from database if needed
      // For now, just sign out and redirect
      await supabase.auth.signOut();
      alert("Account deletion requested. Please contact support to complete the process.");
      router.push("/");
    } catch (error) {
      alert("Error deleting account: " + (error as Error).message);
    }
    setDeleting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Settings</h1>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <p className="text-gray-300 bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg">{user.email}</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Full Name</label>
              <p className="text-gray-300 bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg">
                {user.user_metadata?.full_name || "Not set"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Security</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Change Password</label>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => alert("Password change functionality would be implemented here")}
                  disabled={changingPassword}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Change Email</label>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="New Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => alert("Email change functionality would be implemented here")}
                  disabled={changingEmail}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition"
                >
                  {changingEmail ? "Changing..." : "Change Email"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Two-Factor Authentication</label>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => alert("2FA setup would be implemented here")}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Email Notifications</label>
                <p className="text-gray-400 text-sm">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Message Notifications</label>
                <p className="text-gray-400 text-sm">Get notified when you receive messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageNotifications}
                  onChange={(e) => setMessageNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Match Notifications</label>
                <p className="text-gray-400 text-sm">Receive notifications about skill matches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchNotifications}
                  onChange={(e) => setMatchNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Privacy & Accessibility</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Profile Visibility</label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public - Everyone can see</option>
                <option value="connections">Connections Only</option>
                <option value="private">Private - Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Time Zone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
                <option value="CET">Central European Time</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">High Contrast Mode</label>
                <p className="text-gray-400 text-sm">Increase contrast for better visibility</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Enable Notifications</label>
                <p className="text-gray-400 text-sm">Receive notifications about skill requests and matches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Privacy Mode</label>
                <p className="text-gray-400 text-sm">Hide your profile from public searches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyMode}
                  onChange={(e) => setPrivacyMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Data & Social</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Data Export</label>
                <p className="text-gray-400 text-sm">Download all your data</p>
              </div>
              <button
                onClick={() => alert("Data export functionality would be implemented here")}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition"
              >
                Export Data
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Social Media Integration</label>
                <p className="text-gray-400 text-sm">Connect your social profiles</p>
              </div>
              <button
                onClick={() => alert("Social media integration would be implemented here")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                Connect
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Skill Verification</label>
                <p className="text-gray-400 text-sm">Request verification badges for your skills</p>
              </div>
              <button
                onClick={() => alert("Skill verification would be implemented here")}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition"
              >
                Request Verification
              </button>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Referral Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value="SKILLBARTER-ABC123"
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => navigator.clipboard.writeText("SKILLBARTER-ABC123")}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mt-8 glass">
          <h2 className="text-2xl font-bold text-white mb-6">Actions</h2>

          <div className="space-y-4">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-lg transition"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() => alert("Account deactivation would temporarily disable your account")}
              className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
            >
              Deactivate Account
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
            >
              Sign Out
            </button>

            <button
              onClick={deleteAccount}
              disabled={deleting}
              className="w-full px-6 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-lg transition"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
