'use client';

import { Star, CheckCircle, User } from 'lucide-react';

interface TestimonialCardProps {
  userName: string;
  userUniversity: string;
  userInitials: string;
  userAvatar?: string;
  rating: number;
  reviewText: string;
  verified?: boolean;
  swapDetails?: {
    skillLearned: string;
    skillTaught: string;
    university?: string;
  };
  className?: string;
}

export default function TestimonialCard({
  userName,
  userUniversity,
  userInitials,
  userAvatar,
  rating,
  reviewText,
  verified = false,
  swapDetails,
  className = ''
}: TestimonialCardProps) {
  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
        aria-label={`${rating} star rating`}
      />
    ));
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700 ${className}`}>
      {/* Header with user info and verification */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={`${userName} avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {userInitials}
              </div>
            )}
            
            {/* Verification Badge */}
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{userName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{userUniversity}</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {renderStars(rating)}
          <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{rating}.0</span>
        </div>
      </div>
      
      {/* Review Text */}
      <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">
        "{reviewText}"
      </blockquote>
      
      {/* Swap Details (if provided) */}
      {swapDetails && (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-center flex-1">
              <div className="text-green-600 dark:text-green-400 font-medium">Learned</div>
              <div className="text-gray-800 dark:text-gray-200">{swapDetails.skillLearned}</div>
            </div>
            <div className="text-gray-400 dark:text-gray-500 mx-4">↔</div>
            <div className="text-center flex-1">
              <div className="text-blue-600 dark:text-blue-400 font-medium">Taught</div>
              <div className="text-gray-800 dark:text-gray-200">{swapDetails.skillTaught}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer with additional info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-slate-600">
        <span>Verified Skill Swap</span>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          <span>Student Verified</span>
        </div>
      </div>
    </div>
  );
}

// Testimonial Grid Component
export function TestimonialGrid({
  testimonials,
  className = ''
}: {
  testimonials: TestimonialCardProps[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={`${testimonial.userName}-${index}`}
          {...testimonial}
        />
      ))}
    </div>
  );
}

// Featured Testimonial Component (larger, more prominent)
export function FeaturedTestimonial({
  testimonial,
  className = ''
}: {
  testimonial: TestimonialCardProps & {
    location?: string;
    beforeAfter?: {
      before: string;
      after: string;
    };
  };
  className?: string;
}) {
  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-purple-50 dark:from-emerald-900/20 dark:to-purple-900/20 rounded-3xl shadow-xl p-8 border border-emerald-200 dark:border-emerald-800 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Large User Avatar */}
          <div className="relative">
            {testimonial.userAvatar ? (
              <img
                src={testimonial.userAvatar}
                alt={`${testimonial.userName} avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonial.userInitials}
              </div>
            )}
            
            {/* Large Verification Badge */}
            {testimonial.verified && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{testimonial.userName}</h3>
            <p className="text-gray-600 dark:text-gray-300">{testimonial.userUniversity}</p>
            {testimonial.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
            )}
          </div>
        </div>
        
        {/* Large Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`w-6 h-6 ${
                  index < testimonial.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{testimonial.rating}.0</span>
        </div>
      </div>
      
      {/* Review Text */}
      <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
        "{testimonial.reviewText}"
      </blockquote>
      
      {/* Before/After (if provided) */}
      {testimonial.beforeAfter && (
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-red-600 dark:text-red-400 font-medium mb-1">Before</div>
              <div className="text-gray-800 dark:text-gray-200">{testimonial.beforeAfter.before}</div>
            </div>
            <div>
              <div className="text-green-600 dark:text-green-400 font-medium mb-1">After</div>
              <div className="text-gray-800 dark:text-gray-200">{testimonial.beforeAfter.after}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Swap Details (if provided) */}
      {testimonial.swapDetails && (
        <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4">
          <div className="flex items-center justify-between text-center">
            <div>
              <div className="text-green-600 dark:text-green-400 font-medium text-sm">Learned</div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold">{testimonial.swapDetails.skillLearned}</div>
            </div>
            <div className="text-2xl text-gray-400 dark:text-gray-500">⇄</div>
            <div>
              <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">Taught</div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold">{testimonial.swapDetails.skillTaught}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
