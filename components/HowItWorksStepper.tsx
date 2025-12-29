'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  MessageCircle, 
  GraduationCap,
  ArrowRight,
  Check,
  Users,
  Star,
  Shield
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  color: string;
  bgColor: string;
}

interface HowItWorksStepperProps {
  className?: string;
}

export default function HowItWorksStepper({ className = '' }: HowItWorksStepperProps) {
  const [activeStep, setActiveStep] = useState(1);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Create Your Profile',
      description: 'Set up your profile and showcase your skills',
      icon: <UserPlus className="w-8 h-8" />,
      details: [
        'Add your university and location',
        'List skills you can teach',
        'Specify what you want to learn',
        'Upload a profile photo'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 2,
      title: 'Find Perfect Matches',
      description: 'Discover students who want to learn what you teach',
      icon: <Search className="w-8 h-8" />,
      details: [
        'Browse trending skills in your area',
        'Use smart filtering by university',
        'Check compatibility scores',
        'Read reviews and ratings'
      ],
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      id: 3,
      title: 'Connect & Chat',
      description: 'Start conversations and propose skill swaps',
      icon: <MessageCircle className="w-8 h-8" />,
      details: [
        'Send swap requests',
        'Chat in real-time',
        'Discuss session details',
        'Set learning goals'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 4,
      title: 'Learn & Teach',
      description: 'Start swapping skills and grow together',
      icon: <GraduationCap className="w-8 h-8" />,
      details: [
        'Schedule learning sessions',
        'Track your progress',
        'Earn achievements',
        'Build lasting connections'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          How SkillBarterNG Works 🚀
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Swap skills with fellow Nigerian students in 4 simple steps. 
          Learn what you want, teach what you know!
        </p>
      </div>

      {/* Steps Navigation */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-4 md:space-y-0 md:space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <button
              onClick={() => setActiveStep(step.id)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeStep === step.id
                  ? `${step.bgColor} ${step.color} scale-110 shadow-lg`
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500'
              }`}
            >
              {activeStep > step.id ? (
                <Check className="w-8 h-8" />
              ) : (
                step.icon
              )}
            </button>

            {/* Step Info */}
            <div className="ml-4 hidden md:block">
              <div className={`text-sm font-medium ${
                activeStep === step.id ? step.color : 'text-gray-500 dark:text-gray-400'
              }`}>
                Step {step.id}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </div>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-4 hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* Active Step Content */}
      <div className="max-w-4xl mx-auto">
        {steps.map((step) => (
          activeStep === step.id && (
            <div
              key={step.id}
              className={`${step.bgColor} rounded-2xl p-8 border-2 border-transparent transition-all duration-500`}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${step.color}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${step.color.replace('text-', 'bg-')}`} />
                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveStep(step.id < steps.length ? step.id + 1 : 1)}
                      className={`px-6 py-3 ${step.color.replace('text-', 'bg-')} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      {step.id < steps.length ? 'Next Step' : 'Get Started'}
                    </button>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative">
                  <div className="aspect-square bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-24 h-24 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                        {step.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Step {step.id}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-300">
                        {step.title}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-20" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-emerald-400 rounded-full opacity-20" />
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-6 h-6 text-emerald-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2,500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Students</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Skills Swapped</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ready to start your skill-swapping journey?
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          Join SkillBarterNG Free
        </button>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function HowItWorksCompact({ className = '' }: { className?: string }) {
  const steps = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: 'Create Profile',
      description: 'List your skills'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Find Matches',
      description: 'Discover students'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Connect',
      description: 'Chat & propose'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Learn & Teach',
      description: 'Start swapping'
    }
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
        How It Works
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
              {step.icon}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {step.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-slate-700 transform translate-x-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
