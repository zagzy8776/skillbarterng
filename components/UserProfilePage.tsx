'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Award, 
  Camera, 
  Play, 
  ExternalLink, 
  CheckCircle, 
  MessageCircle, 
  Calendar,
  Users,
  TrendingUp,
  Heart,
  BookOpen,
  Code,
  Palette,
  Video,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import CTAButton, { ProposeSwapButton } from './CTAButton';

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  verified: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  type: 'image' | 'video' | 'link';
}

interface UserProfilePageProps {
  userId: string;
  userName: string;
  userInitials: string;
  userAvatar?: string;
  university: string;
  location: string;
  bio: string;
  videoIntroUrl?: string;
  skillsICanTeach: Skill[];
  skillsIWantToLearn: Skill[];
  portfolio: PortfolioItem[];
  stats: {
    swapsCompleted: number;
    averageRating: number;
    totalReviews: number;
    responseTime: string;
    yearsExperience: number;
  };
  isOnline?: boolean;
  isOwnProfile?: boolean;
  className?: string;
}

export default function UserProfilePage({
  userId,
  userName,
  userInitials,
  userAvatar,
  university,
  location,
  bio,
  videoIntroUrl,
  skillsICanTeach,
  skillsIWantToLearn,
  portfolio,
  stats,
  isOnline = false,
  isOwnProfile = false,
  className = ''
}: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'portfolio' | 'reviews'>('overview');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  // Get skill level color
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'Expert': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Get skill category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'design': return <Palette className="w-4 h-4" />;
      case 'programming': return <Code className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Avatar Section */}
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={`${userName} profile`}
                className="w-32 h-32 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl">
                {userInitials}
              </div>
            )}
            
            {/* Online Status */}
            {isOnline && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            {/* Verification Badge */}
            <div className="absolute -top-2 -left-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{userName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{university}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.swapsCompleted}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Swaps Done</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    {renderStars(Math.round(stats.averageRating))}
                    <span className="font-semibold">{stats.averageRating}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stats.totalReviews} reviews</div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{bio}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!isOwnProfile && (
                <>
                  <ProposeSwapButton
                    userName={userName}
                    skillOffered={skillsICanTeach[0]?.name || 'Skills'}
                    skillRequested={skillsIWantToLearn[0]?.name || 'Learning'}
                    onClick={() => {/* Handle propose swap */}}
                  />
                  <CTAButton variant="outline" size="md">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </CTAButton>
                </>
              )}
              {isOwnProfile && (
                <CTAButton variant="primary" size="md">
                  <Camera className="w-4 h-4" />
                  Edit Profile
                </CTAButton>
              )}
            </div>
          </div>
        </div>

        {/* Video Introduction */}
        {videoIntroUrl && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Video Introduction
            </h3>
            <div className="relative aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden">
              <iframe
                src={videoIntroUrl}
                className="w-full h-full"
                allowFullScreen
                title={`${userName}'s introduction video`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'skills', label: 'Skills', icon: <Award className="w-4 h-4" /> },
            { id: 'portfolio', label: 'Portfolio', icon: <Camera className="w-4 h-4" /> },
            { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skills Summary */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills Summary</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Can Teach ({skillsICanTeach.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsICanTeach.slice(0, 6).map((skill) => (
                        <span
                          key={skill.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)} flex items-center gap-1`}
                        >
                          {getCategoryIcon(skill.category)}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Want to Learn ({skillsIWantToLearn.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsIWantToLearn.slice(0, 6).map((skill) => (
                        <span
                          key={skill.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)} flex items-center gap-1`}
                        >
                          {getCategoryIcon(skill.category)}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-600">{stats.responseTime}</div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">Avg Response</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{stats.yearsExperience}</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Years Experience</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalReviews}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Total Reviews</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Skills I Can Teach
                </h3>
                <div className="space-y-3">
                  {skillsICanTeach.map((skill) => (
                    <div key={skill.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(skill.category)}
                          <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                          {skill.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{skill.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Skills I Want to Learn
                </h3>
                <div className="space-y-3">
                  {skillsIWantToLearn.map((skill) => (
                    <div key={skill.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(skill.category)}
                          <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                          {skill.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{skill.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Portfolio & Work Samples</h3>
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-slate-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedPortfolioItem(item)}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-slate-600 relative">
                        {item.type === 'image' && item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        )}
                        {item.type === 'video' && (
                          <div className="flex items-center justify-center h-full">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        )}
                        {item.type === 'link' && (
                          <div className="flex items-center justify-center h-full">
                            <External
