'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  showIcon?: boolean;
  analytics?: {
    eventName: string;
    eventParams?: Record<string, unknown>;
  };
}

export default function CTAButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  showIcon = true,
  analytics
}: CTAButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95';

  // Size variants
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3'
  };

  // Color variants
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500',
    secondary: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500',
    outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white focus:ring-emerald-500 bg-transparent'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;

    // Track analytics if provided (optional)
    if (analytics && typeof window !== 'undefined') {
      try {
        // @ts-ignore - gtag may not be available
        if (window.gtag) {
          // @ts-ignore
          window.gtag('event', analytics.eventName, {
            event_category: 'CTA',
            ...analytics.eventParams
          });
        }
      } catch (error) {
        // Analytics failed silently
        console.debug('Analytics tracking failed:', error);
      }
    }

    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  // Combine all classes
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${isPressed ? 'scale-95' : ''}`;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  // Arrow icon component
  const ArrowIcon = () => (
    <ArrowRight className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} transition-transform group-hover:translate-x-1`} />
  );

  // Content component
  const ButtonContent = () => (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {children}
          {showIcon && !loading && <ArrowIcon />}
        </>
      )}
    </>
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={`CTA Button: ${children}`}
      >
        <ButtonContent />
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      aria-label={`CTA Button: ${children}`}
    >
      <ButtonContent />
    </button>
  );
}

// Specialized "Propose Swap" CTA Button
export function ProposeSwapButton({ 
  userName, 
  skillOffered, 
  skillRequested, 
  onClick,
  className = '',
  ...props 
}: {
  userName: string;
  skillOffered: string;
  skillRequested: string;
  onClick: () => void;
  className?: string;
} & Omit<CTAButtonProps, 'children' | 'onClick'>) {
  return (
    <CTAButton
      onClick={onClick}
      variant="primary"
      size="md"
      className={`group relative overflow-hidden ${className}`}
      analytics={{
        eventName: 'propose_swap_click',
        eventParams: {
          user_name: userName,
          skill_offered: skillOffered,
          skill_requested: skillRequested
        }
      }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <span>Propose Swap</span>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </CTAButton>
  );
}

// Multiple CTA buttons layout
export function CTAButtonGroup({
  buttons,
  orientation = 'horizontal',
  className = ''
}: {
  buttons: Array<{
    component: React.ReactNode;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div className={`flex ${orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-3'} ${className}`}>
      {buttons.map((button, index) => (
        <div key={index}>
          {button.component}
        </div>
      ))}
    </div>
  );
}
