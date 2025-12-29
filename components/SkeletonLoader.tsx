'use client';

import React from 'react';

// Base skeleton component with pulsing animation
function Skeleton({
  className = '',
  animate = true,
  variant = 'rectangular'
}: {
  className?: string;
  animate?: boolean;
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
}) {
  const baseClasses = 'bg-gray-300 dark:bg-slate-700';
  
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    text: 'rounded h-4',
    rounded: 'rounded-lg'
  };

  const animationClass = animate ? 'animate-pulse' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// User card skeleton for search results
export function UserCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
      {/* Header with avatar and name */}
      <div className="flex items-start space-x-4 mb-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
        <Skeleton variant="rectangular" className="w-16 h-6 rounded-full" />
      </div>

      {/* Skills section */}
      <div className="mb-4">
        <Skeleton variant="text" className="h-4 w-1/4 mb-2" />
        <div className="flex flex-wrap gap-2">
          <Skeleton variant="rounded" className="h-6 w-20" />
          <Skeleton variant="rounded" className="h-6 w-16" />
          <Skeleton variant="rounded" className="h-6 w-24" />
        </div>
      </div>

      {/* University and rating */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" className="h-4 w-2/3" />
        <div className="flex items-center space-x-1">
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-8" />
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <Skeleton variant="text" className="h-4 w-full mb-2" />
        <Skeleton variant="text" className="h-4 w-5/6" />
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Skeleton variant="rounded" className="h-10 w-28" />
        <Skeleton variant="rounded" className="h-10 w-24" />
      </div>
    </div>
  );
}

// Search results grid skeleton
export function SearchResultsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <UserCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="rectangular" className="w-12 h-12 rounded-lg" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <Skeleton variant="text" className="h-8 w-3/4 mb-2" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Recent activity skeleton
export function ActivitySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <Skeleton variant="text" className="h-6 w-1/3 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Skeleton variant="circular" className="w-8 h-8" />
            <div className="flex-1">
              <Skeleton variant="text" className="h-4 w-3/4 mb-2" />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile page skeleton
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Skeleton variant="circular" className="w-24 h-24" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-8 w-1/3 mb-2" />
            <Skeleton variant="text" className="h-5 w-1/2 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton variant="rounded" className="h-6 w-20" />
              <Skeleton variant="rounded" className="h-6 w-16" />
              <Skeleton variant="rounded" className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <Skeleton variant="text" className="h-6 w-1/4 mb-4" />
            <div className="space-y-3">
              <div>
                <Skeleton variant="text" className="h-4 w-1/5 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton variant="rounded" className="h-6 w-16" />
                  <Skeleton variant="rounded" className="h-6 w-20" />
                  <Skeleton variant="rounded" className="h-6 w-14" />
                </div>
              </div>
              <div>
                <Skeleton variant="text" className="h-4 w-1/4 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton variant="rounded" className="h-6 w-18" />
                  <Skeleton variant="rounded" className="h-6 w-22" />
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <Skeleton variant="text" className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} variant="rounded" className="aspect-square" />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <Skeleton variant="text" className="h-6 w-1/2 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-1/3" />
                <Skeleton variant="text" className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-2/5" />
                <Skeleton variant="text" className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-1/3" />
                <Skeleton variant="text" className="h-4 w-1/4" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <Skeleton variant="text" className="h-6 w-1/3 mb-4" />
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-3/4" />
              <Skeleton variant="text" className="h-4 w-2/3" />
              <Skeleton variant="rounded" className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat skeleton
export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div>
            <Skeleton variant="text" className="h-5 w-32 mb-1" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs lg:max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
              <Skeleton
                variant="rounded"
                className={`h-12 ${index % 2 === 0 ? 'w-3/4' : 'w-2/3'} mb-1`}
              />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex space-x-3">
          <Skeleton variant="rounded" className="flex-1 h-10" />
          <Skeleton variant="rounded" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}

// Generic list skeleton
export function ListSkeleton({
  items = 5,
  showAvatar = true
}: {
  items?: number;
  showAvatar?: boolean;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            {showAvatar && <Skeleton variant="circular" className="w-10 h-10" />}
            <div className="flex-1">
              <Skeleton variant="text" className="h-5 w-1/3 mb-2" />
              <Skeleton variant="text" className="h-4 w-2/3 mb-1" />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
            <Skeleton variant="rounded" className="w-20 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-700 px-6 py-3">
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton
              key={index}
              variant="text"
              className={`h-4 ${index === 0 ? 'col-span-3' : index === columns - 1 ? 'col-span-2' : 'col-span-2'}`}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-12 gap-4">
              {Array.from({ length: columns }, (_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  className={`h-4 ${
                    colIndex === 0 ? 'col-span-3' : colIndex === columns - 1 ? 'col-span-2' : 'col-span-2'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Full page skeleton loader
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton variant="rectangular" className="w-40 h-8" />
            <div className="flex space-x-4">
              <Skeleton variant="rounded" className="w-20 h-8" />
              <Skeleton variant="rounded" className="w-16 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Skeleton variant="text" className="h-4 w-1/4" />
        </div>

        {/* Page header */}
        <div className="mb-8">
          <Skeleton variant="text" className="h-8 w-1/3 mb-2" />
          <Skeleton variant="text" className="h-5 w-1/2" />
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <SearchResultsSkeleton />
          </div>
          <div className="space-y-6">
            <ActivitySkeleton />
            <ListSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
