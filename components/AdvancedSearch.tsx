'use client';

import { useState } from 'react';
import { Search, Filter, X, MapPin, GraduationCap, Star } from 'lucide-react';

interface SearchFilters {
  query: string;
  university: string;
  location: string;
  skillLevel: string;
  rating: number;
  onlineOnly: boolean;
  sortBy: 'relevance' | 'rating' | 'newest';
}

interface User {
  id: string;
  name: string;
  university: string;
  location: string;
  skillsOffered: string[];
  skillsRequested: string[];
  rating: number;
  isOnline: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export default function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    university: '',
    location: '',
    skillLevel: '',
    rating: 0,
    onlineOnly: false,
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      university: '',
      location: '',
      skillLevel: '',
      rating: 0,
      onlineOnly: false,
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search skills, users, or universities..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* University Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University
              </label>
              <select
                value={filters.university}
                onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Universities</option>
                <option value="unilag">University of Lagos</option>
                <option value="ui">University of Ibadan</option>
                <option value="oau">Obafemi Awolowo University</option>
                <option value="abu">Ahmadu Bello University</option>
                <option value="covenant">Covenant University</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Locations</option>
                <option value="lagos">Lagos</option>
                <option value="ibadan">Ibadan</option>
                <option value="ileife">Ile-Ife</option>
                <option value="zaria">Zaria</option>
                <option value="ota">Ota</option>
              </select>
            </div>

            {/* Skill Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skill Level
              </label>
              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, skillLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'relevance', label: 'Most Relevant' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'newest', label: 'Recently Active' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Online Only Filter */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, onlineOnly: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Online only</span>
            </label>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Search Results Component
interface SearchResultsProps {
  results: User[];
  loading?: boolean;
  className?: string;
}

export function SearchResults({ results, loading = false, className = '' }: SearchResultsProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Search className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {results.map((user) => (
        <div
          key={user.id}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {user.university}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {user.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
              View Profile
            </button>
          </div>
          
          <div className="mt-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Can Teach:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.skillsOffered.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="text-xs text-gray-500">+{user.skillsOffered.length - 3} more</span>
                )}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Want to Learn:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.skillsRequested.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsRequested.length > 3 && (
                  <span className="text-xs text-gray-500">+{user.skillsRequested.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
