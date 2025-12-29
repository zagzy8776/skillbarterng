'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Filter,
  Search,
  X,
  Users,
  Award,
  MessageCircle,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Zap
} from 'lucide-react';
import CTAButton, { ProposeSwapButton } from './CTAButton';

interface MatchUser {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  university: string;
  location: string;
  skillsOffered: string[];
  skillsRequested: string[];
  rating: number;
  reviewCount: number;
  responseTime: string;
  compatibilityScore: number;
  isOnline: boolean;
  lastActive: string;
  bio: string;
}

interface SmartMatchesDashboardProps {
  currentUserId: string;
  currentUserSkills: string[];
  onProposeSwap?: (userId: string, skillOffered: string, skillRequested: string) => void;
  onSendMessage?: (userId: string) => void;
  className?: string;
}

export default function SmartMatchesDashboard({
  currentUserId,
  currentUserSkills,
  onProposeSwap,
  onSendMessage,
  className = ''
}: SmartMatchesDashboardProps) {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    university: '',
    skillLevel: '',
    location: '',
    onlineOnly: false,
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'compatibility' | 'rating' | 'responseTime'>('compatibility');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockMatches: MatchUser[] = [
      {
        id: '1',
        name: 'Adaora Okafor',
        initials: 'AO',
        university: 'University of Lagos',
        location: 'Lagos',
        skillsOffered: ['Python Programming', 'Data Analysis', 'Machine Learning'],
        skillsRequested: ['UI/UX Design', 'Video Editing', 'Digital Marketing'],
        rating: 4.8,
        reviewCount: 24,
        responseTime: '2 hours',
        compatibilityScore: 95,
        isOnline: true,
        lastActive: 'Now',
        bio: 'Computer Science student passionate about AI and helping others learn design skills.'
      },
      {
        id: '2',
        name: 'Chidi Nwankwo',
        initials: 'CN',
        university: 'Obafemi Awolowo University',
        location: 'Ile-Ife',
        skillsOffered: ['Graphics Design', 'Brand Identity', 'Adobe Creative Suite'],
        skillsRequested: ['Public Speaking', 'Leadership Skills', 'Entrepreneurship'],
        rating: 4.9,
        reviewCount: 18,
        responseTime: '1 hour',
        compatibilityScore: 92,
        isOnline: false,
        lastActive: '30 mins ago',
        bio: 'Design enthusiast who loves teaching and helping students build their brands.'
      },
      {
        id: '3',
        name: 'Fatima Ibrahim',
        initials: 'FI',
        university: 'Ahmadu Bello University',
        location: 'Zaria',
        skillsOffered: ['French Language', 'International Relations', 'Cultural Studies'],
        skillsRequested: ['Web Development', 'React.js', 'JavaScript'],
        rating: 4.7,
        reviewCount: 31,
        responseTime: '4 hours',
        compatibilityScore: 88,
        isOnline: true,
        lastActive: 'Now',
        bio: 'Language enthusiast wanting to bridge cultures through tech skills.'
      },
      {
        id: '4',
        name: 'Emeka Okoro',
        initials: 'EO',
        university: 'Covenant University',
        location: 'Ota',
        skillsOffered: ['Financial Analysis', 'Business Strategy', 'Excel Mastery'],
        skillsRequested: ['Photography', 'Video Production', 'Content Creation'],
        rating: 4.6,
        reviewCount: 15,
        responseTime: '3 hours',
        compatibilityScore: 85,
        isOnline: false,
        lastActive: '1 hour ago',
        bio: 'Business student sharing financial expertise for creative skills.'
      }
    ];

    setTimeout(() => {
      setMatches(mockMatches);
      setFilteredMatches(mockMatches);
      setLoading(false);
    }, 1500);
  }, []);

  // Filter and search matches
  useEffect(() => {
    let filtered = matches.filter(match => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          match.name.toLowerCase().includes(query) ||
          match.skillsOffered.some(skill => skill.toLowerCase().includes(query)) ||
          match.skillsRequested.some(skill => skill.toLowerCase().includes(query)) ||
          match.university.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Filters
      if (selectedFilters.university && !match.university.includes(selectedFilters.university)) {
        return false;
      }
      
      if (selectedFilters.onlineOnly && !match.isOnline) {
        return false;
      }
      
      if (selectedFilters.minRating > 0 && match.rating < selectedFilters.minRating) {
        return false;
      }

      return true;
    });

    // Sort matches
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'responseTime':
          return a.responseTime.localeCompare(b.responseTime);
        default:
          return b.compatibilityScore - a.compatibilityScore;
      }
    });

    setFilteredMatches(filtered);
  }, [matches, searchQuery, selectedFilters, sortBy]);

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'expert': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
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

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto ${className}`}>
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="animate-pulse flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 dark:bg-slate-700 rounded w-32"></div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-emerald-500" />
              Smart Matches
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered matches based on your skills and preferences
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder names="Search skills or..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedFilters.university}
                onChange={(e) => setSelectedFilters({...selectedFilters, university: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">All Universities</option>
                <option value="Lagos">University of Lagos</option>
                <option value="Ibadan">University of Ibadan</option>
                <option value="OAU">Obafemi Awolowo University</option>
                <option value="ABU">Ahmadu Bello University</option>
                <option value="Covenant">Covenant University</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="compatibility">Best Match</option>
                <option value="rating">Highest Rated</option>
                <option value="responseTime">Fastest Response</option>
              </select>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onlineOnly"
                  checked={selectedFilters.onlineOnly}
                  onChange={(e) => setSelectedFilters({...selectedFilters, onlineOnly: e.target.checked})}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="onlineOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Online only
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Min Rating
                </label>
                <select
                  value={selectedFilters.minRating}
                  onChange={(e) => setSelectedFilters({...selectedFilters, minRating: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value={0}>Any</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Users className="w-5 h-5" />
          <span>{filteredMatches.length} matches found</span>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Sorted by {sortBy === 'compatibility' ? 'compatibility score' : sortBy === 'rating' ? 'rating' : 'response time'}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    {match.avatar ? (
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {match.initials}
                      </div>
                    )}
                    
                    {/* Online Status */}
                    {match.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{match.name}</h3>
