'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'internship' | 'freelance' | 'full-time' | 'part-time'
  salary_range?: string
  description: string
  requirements: string[]
  skills_required: string[]
  posted_by: string
  created_at: string
  application_deadline?: string
  is_active: boolean
}

interface User {
  id: string
  user_metadata?: {
    full_name?: string
    teach_skills?: string[]
    want_skills?: string[]
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [showPostJob, setShowPostJob] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadJobs()
    loadUser()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchQuery, locationFilter, typeFilter, skillFilter])

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter)
    }

    // Skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(job =>
        job.skills_required.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    }

    setFilteredJobs(filtered)
  }

  const applyForJob = async (jobId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: 'pending',
          applied_at: new Date().toISOString()
        })

      if (error) throw error
      alert('Application submitted successfully!')
    } catch (error) {
      const err = error as { code?: string; message?: string }
      if (err.code === '23505') { // Unique constraint violation
        alert('You have already applied for this job!')
      } else {
        alert('Error applying for job: ' + (err.message || 'Unknown error'))
      }
    }
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
              💼 Job Board
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Turn your skills into career opportunities. Find internships, freelance gigs, and full-time positions that match your expertise.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowPostJob(!showPostJob)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
            >
              📝 Post a Job
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Post Job Form */}
          {showPostJob && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Post a New Job</h2>
              <PostJobForm onJobPosted={() => {
                setShowPostJob(false)
                loadJobs()
              }} />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🔍 Search</label>
                <input
                  type="text"
                  placeholder="Job title, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">📍 Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Locations</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">💼 Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🎯 Skill</label>
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Skills</option>
                  <option value="python">Python</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="writing">Writing</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLocationFilter('all')
                    setTypeFilter('all')
                    setSkillFilter('all')
                  }}
                  className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100 rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Available Opportunities ({filteredJobs.length})
            </h2>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No jobs found</h3>
                <p className="text-slate-600 dark:text-slate-300">Try adjusting your filters or check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{job.company}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.type === 'internship' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        job.type === 'freelance' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        job.type === 'full-time' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {job.type}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span>📍</span>
                        {job.location}
                      </p>
                      {job.salary_range && (
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span>💰</span>
                          {job.salary_range}
                        </p>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg">
                            +{job.skills_required.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => applyForJob(job.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                    >
                      🚀 Apply Now
                    </button>
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

// Post Job Form Component
function PostJobForm({ onJobPosted }: { onJobPosted: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'internship' as Job['type'],
    salary_range: '',
    description: '',
    requirements: [''],
    skills_required: ['']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          posted_by: user.id,
          requirements: formData.requirements.filter(r => r.trim()),
          skills_required: formData.skills_required.filter(s => s.trim()),
          is_active: true
        })

      if (error) throw error

      alert('Job posted successfully!')
      onJobPosted()
    } catch (error) {
      const err = error as { message?: string }
      alert('Error posting job: ' + (err.message || 'Unknown error'))
    }
  }

  const addField = (field: 'requirements' | 'skills_required') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateField = (field: 'requirements' | 'skills_required', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Job['type'] }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
            <option value="part-time">Part-time</option>
            <option value="full-time">Full-time</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Salary Range (Optional)</label>
        <input
          type="text"
          placeholder="e.g., ₦50,000 - ₦100,000"
          value={formData.salary_range}
          onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements</label>
        {formData.requirements.map((req, index) => (
          <input
            key={index}
            type="text"
            placeholder="e.g., Bachelor's degree in Computer Science"
            value={req}
            onChange={(e) => updateField('requirements', index, e.target.value)}
            className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
        <button
          type="button"
          onClick={() => addField('requirements')}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          + Add requirement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Required Skills</label>
        {formData.skills_required.map((skill, index) => (
          <input
            key={index}
            type="text"
            placeholder="e.g., Python, React, Figma"
            value={skill}
            onChange={(e) => updateField('skills_required', index, e.target.value)}
            className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
        <button
          type="button"
          onClick={() => addField('skills_required')}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          + Add skill
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          📝 Post Job
        </button>
      </div>
    </form>
  )
}
