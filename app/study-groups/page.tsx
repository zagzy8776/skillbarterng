'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StudyGroup {
  id: string
  name: string
  subject: string
  description: string
  max_members: number
  current_members: number
  meeting_schedule?: string
  meeting_link?: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  created_by: string
  created_at: string
  is_active: boolean
  tags: string[]
}

interface GroupMember {
  id: string
  user_id: string
  group_id: string
  joined_at: string
  user_metadata?: {
    full_name?: string
  }
}

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
  const router = useRouter()

  useEffect(() => {
    loadGroups()
    loadUser()
  }, [])

  useEffect(() => {
    filterGroups()
  }, [groups, searchQuery, subjectFilter, difficultyFilter])

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGroups(data || [])
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Load user's groups
        const { data: memberships } = await supabase
          .from('study_group_members')
          .select('group_id')
          .eq('user_id', user.id)

        if (memberships && memberships.length > 0) {
          const groupIds = memberships.map(m => m.group_id)
          const { data: userGroups } = await supabase
            .from('study_groups')
            .select('*')
            .in('id', groupIds)
            .eq('is_active', true)

          setMyGroups(userGroups || [])
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const filterGroups = () => {
    let filtered = groups

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(group => group.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(group => group.difficulty_level === difficultyFilter)
    }

    setFilteredGroups(filtered)
  }

  const joinGroup = async (groupId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        })

      if (error) throw error

      // Update local state
      setGroups(prev => prev.map(group =>
        group.id === groupId
          ? { ...group, current_members: group.current_members + 1 }
          : group
      ))

      alert('Successfully joined the study group!')
      loadUser() // Refresh user's groups
    } catch (error: any) {
      if (error.code === '23505') {
        alert('You are already a member of this group!')
      } else {
        alert('Error joining group: ' + error.message)
      }
    }
  }

  const leaveGroup = async (groupId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setGroups(prev => prev.map(group =>
        group.id === groupId
          ? { ...group, current_members: group.current_members - 1 }
          : group
      ))

      alert('Left the study group successfully!')
      loadUser() // Refresh user's groups
    } catch (error: any) {
      alert('Error leaving group: ' + error.message)
    }
  }

  const isUserInGroup = (groupId: string) => {
    return myGroups.some(group => group.id === groupId)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-64 mx-auto mb-8"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              👥 Study Groups
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join collaborative study sessions with fellow students. Learn together, teach each other, and achieve more!
            </p>
          </div>

          {/* My Groups Section */}
          {myGroups.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">My Study Groups</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {myGroups.map((group) => (
                  <div key={group.id} className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{group.name}</h3>
                        <p className="text-green-600 dark:text-green-400 font-medium">{group.subject}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        group.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        group.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {group.difficulty_level}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">{group.description}</p>

                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <span>👥 {group.current_members}/{group.max_members} members</span>
                      {group.meeting_schedule && (
                        <span>📅 {group.meeting_schedule}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/study-groups/${group.id}`)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                      >
                        Enter Group
                      </button>
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg transition"
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowCreateGroup(!showCreateGroup)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
            >
              ➕ Create Study Group
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Create Group Form */}
          {showCreateGroup && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Create New Study Group</h2>
              <CreateGroupForm onGroupCreated={() => {
                setShowCreateGroup(false)
                loadGroups()
              }} />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🔍 Search</label>
                <input
                  type="text"
                  placeholder="Group name, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">📚 Subject</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Subjects</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="computer science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="business">Business</option>
                  <option value="languages">Languages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🎯 Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSubjectFilter('all')
                    setDifficultyFilter('all')
                  }}
                  className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100 rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Available Groups */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Available Study Groups ({filteredGroups.length})
            </h2>

            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No study groups found</h3>
                <p className="text-slate-600 dark:text-slate-300">Try adjusting your filters or create your own study group!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {group.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{group.subject}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        group.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        group.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {group.difficulty_level}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">{group.description}</p>

                    <div className="space-y-2 mb-4">
                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span>👥</span>
                        {group.current_members}/{group.max_members} members
                      </p>
                      {group.meeting_schedule && (
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span>📅</span>
                          {group.meeting_schedule}
                        </p>
                      )}
                    </div>

                    {group.tags && group.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {group.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {isUserInGroup(group.id) ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/study-groups/${group.id}`)}
                          className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                          Enter Group
                        </button>
                        <button
                          onClick={() => leaveGroup(group.id)}
                          className="px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg transition"
                        >
                          Leave
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => joinGroup(group.id)}
                        disabled={group.current_members >= group.max_members}
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                      >
                        {group.current_members >= group.max_members ? 'Group Full' : '🚀 Join Group'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Create Group Form Component
function CreateGroupForm({ onGroupCreated }: { onGroupCreated: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    max_members: 10,
    meeting_schedule: '',
    meeting_link: '',
    difficulty_level: 'beginner' as StudyGroup['difficulty_level'],
    tags: ['']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('study_groups')
        .insert({
          ...formData,
          created_by: user.id,
          current_members: 1, // Creator is automatically a member
          tags: formData.tags.filter(tag => tag.trim()),
          is_active: true
        })

      if (error) throw error

      // Add creator as first member
      await supabase
        .from('study_group_members')
        .insert({
          group_id: (await supabase.from('study_groups').select('id').eq('created_by', user.id).order('created_at', { ascending: false }).limit(1).single()).data?.id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        })

      alert('Study group created successfully!')
      onGroupCreated()
    } catch (error: any) {
      alert('Error creating group: ' + error.message)
    }
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }))
  }

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Group Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Data Structures Study Group"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Languages">Languages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty Level</label>
          <select
            value={formData.difficulty_level}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value as StudyGroup['difficulty_level'] }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Members</label>
          <input
            type="number"
            min="2"
            max="50"
            value={formData.max_members}
            onChange={(e) => setFormData(prev => ({ ...prev, max_members: Number(e.target.value) }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what your study group will focus on..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meeting Schedule (Optional)</label>
          <input
            type="text"
            value={formData.meeting_schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, meeting_schedule: e.target.value }))}
            placeholder="e.g., Every Tuesday 7 PM"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meeting Link (Optional)</label>
          <input
            type="url"
            value={formData.meeting_link}
            onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
            placeholder="Zoom, Google Meet, etc."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags (Optional)</label>
        {formData.tags.map((tag, index) => (
          <input
            key={index}
            type="text"
            placeholder="e.g., exam-prep, algorithms"
            value={tag}
            onChange={(e) => updateTag(index, e.target.value)}
            className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
        <button
          type="button"
          onClick={addTag}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          + Add tag
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          🎓 Create Study Group
        </button>
      </div>
    </form>
  )
}
