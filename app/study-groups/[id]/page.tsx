'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Calendar, 
  ExternalLink, 
  MessageCircle, 
  Settings,
  Star,
  Clock,
  BookOpen,
  ArrowLeft,
  UserPlus,
  UserMinus
} from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  max_members: number;
  current_members: number;
  meeting_schedule?: string;
  meeting_link?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  created_by: string;
  created_at: string;
  is_active: boolean;
  tags: string[];
}

interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  joined_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function StudyGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>('overview');

  useEffect(() => {
    if (groupId) {
      loadGroupData();
      loadUser();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      // Load group details
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .eq('is_active', true)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Load members
      const { data: membersData, error: membersError } = await supabase
        .from('study_group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;
      setMembers(membersData || []);

    } catch (error) {
      console.error('Error loading group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: membership } = await supabase
          .from('study_group_members')
          .select('id')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();

        setIsMember(!!membership);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const joinGroup = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsMember(true);
      loadGroupData(); // Refresh data
      alert('Successfully joined the study group!');
    } catch (error: any) {
      if (error.code === '23505') {
        alert('You are already a member of this group!');
      } else {
        alert('Error joining group: ' + error.message);
      }
    }
  };

  const leaveGroup = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      setIsMember(false);
      loadGroupData(); // Refresh data
      alert('Left the study group successfully!');
    } catch (error: any) {
      alert('Error leaving group: ' + error.message);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-64 mb-6"></div>
              <div className="h-64 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Study Group Not Found</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">The study group you're looking for doesn't exist or has been deactivated.</p>
            <button
              onClick={() => router.push('/study-groups')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              ← Back to Study Groups
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/study-groups')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study Groups
          </button>

          {/* Group Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {group.name}
                    </h1>
                    <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                      {group.subject}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.current_members}/{group.max_members} members
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty_level)}`}>
                        {group.difficulty_level}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {formatDate(group.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {group.description}
                </p>

                {group.tags && group.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {group.meeting_schedule && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4">
                    <Calendar className="w-5 h-5" />
                    <span>{group.meeting_schedule}</span>
                  </div>
                )}

                {group.meeting_link && (
                  <a
                    href={group.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join Meeting
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="lg:flex-shrink-0">
                {isMember ? (
                  <div className="flex flex-col gap-3">
                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-center rounded-lg font-medium">
                      ✓ You're a member
                    </div>
                    <button
                      onClick={() => leaveGroup()}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                      Leave Group
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={joinGroup}
                    disabled={group.current_members >= group.max_members}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {group.current_members >= group.max_members ? 'Group Full' : '🚀 Join Group'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-8">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'members', label: 'Members', icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'members')}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">About This Group</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Group Details</h4>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div>Subject: {group.subject}</div>
                        <div>Difficulty: {group.difficulty_level}</div>
                        <div>Max Members: {group.max_members}</div>
                        <div>Current Members: {group.current_members}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Meeting Info</h4>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {group.meeting_schedule && (
                          <div>Schedule: {group.meeting_schedule}</div>
                        )}
                        {group.meeting_link && (
                          <div>
                            Link: 
                            <a href={group.meeting_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1">
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Group Members ({members.length})
                  </h3>

                  {members.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-300">No members yet.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((member) => (
                        <div key={member.id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {member.user_metadata?.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {member.user_metadata?.full_name || 'Anonymous User'}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">
                                Joined {formatDate(member.joined_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
