'use client';

import React from 'react';
import { Mouse, Keyboard, Headphones, Speaker, BatteryCharging, Layout, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  productId: string;
  title: string;
  className?: string;
  isLarge?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  productId,
  title,
  className,
  isLarge = false,
}) => {
  // Common container classes
  const containerClasses = cn(
    'relative w-full h-full flex items-center justify-center bg-linear-to-br transition-all duration-500 overflow-hidden select-none',
    className
  );

  // Return custom SVG illustrations for each product ID
  switch (productId) {
    case 'prod-1': // Vertical Mouse
      return (
        <div className={cn(containerClasses, 'from-indigo-50 via-indigo-100 to-indigo-200 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-950')}>
          <svg className="w-1/2 h-1/2 text-indigo-650 dark:text-indigo-400 drop-shadow-lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 15 C30 15 20 35 20 60 C20 80 32 85 50 85 C68 85 80 80 80 60 C80 35 70 15 50 15 Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 15 L50 48" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="47" y="24" width="6" height="12" rx="3" fill="currentColor" opacity="0.8" />
            <path d="M50 48 C38 48 26 52 22 62" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="72" r="2" fill="currentColor" className="animate-pulse" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-indigo-750 dark:text-indigo-305">
            <Mouse className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    case 'prod-2': // Mechanical Keyboard
      return (
        <div className={cn(containerClasses, 'from-purple-50 via-purple-100 to-purple-200 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-950')}>
          <svg className="w-2/3 h-1/2 text-purple-650 dark:text-purple-405 drop-shadow-md" viewBox="0 0 140 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="10" y="25" width="120" height="50" rx="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Keycap grid representation */}
            <rect x="18" y="33" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.8" />
            <rect x="32" y="33" width="10" height="8" rx="1.5" />
            <rect x="46" y="33" width="10" height="8" rx="1.5" />
            <rect x="60" y="33" width="10" height="8" rx="1.5" />
            <rect x="74" y="33" width="10" height="8" rx="1.5" />
            <rect x="88" y="33" width="10" height="8" rx="1.5" />
            <rect x="102" y="33" width="10" height="8" rx="1.5" />
            <rect x="116" y="33" width="6" height="8" rx="1.5" fill="currentColor" opacity="0.9" />

            <rect x="16" y="45" width="14" height="8" rx="1.5" />
            <rect x="34" y="45" width="10" height="8" rx="1.5" />
            <rect x="48" y="45" width="10" height="8" rx="1.5" />
            <rect x="62" y="45" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
            <rect x="76" y="45" width="10" height="8" rx="1.5" />
            <rect x="90" y="45" width="10" height="8" rx="1.5" />
            <rect x="104" y="45" width="20" height="8" rx="1.5" fill="currentColor" opacity="0.9" />

            <rect x="16" y="57" width="20" height="8" rx="1.5" />
            <rect x="40" y="57" width="60" height="8" rx="3" fill="currentColor" opacity="0.8" />
            <rect x="104" y="57" width="20" height="8" rx="1.5" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-purple-750 dark:text-purple-305">
            <Keyboard className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    case 'prod-3': // ANC Headphones
      return (
        <div className={cn(containerClasses, 'from-pink-50 via-pink-100 to-pink-200 dark:from-slate-900 dark:via-pink-950/30 dark:to-slate-950')}>
          <svg className="w-1/2 h-1/2 text-pink-650 dark:text-pink-400 drop-shadow-lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Headband */}
            <path d="M20 50 C20 20 80 20 80 50" strokeLinecap="round" strokeLinejoin="round" />
            {/* Earcups */}
            <rect x="12" y="45" width="12" height="24" rx="6" fill="currentColor" strokeLinejoin="round" />
            <rect x="76" y="45" width="12" height="24" rx="6" fill="currentColor" strokeLinejoin="round" />
            {/* Inner details */}
            <path d="M24 57 L30 57" strokeLinecap="round" />
            <path d="M76 57 L70 57" strokeLinecap="round" />
            {/* Soundwaves */}
            <path d="M5 57 C8 52 8 62 5 57" strokeLinecap="round" strokeWidth="1.5" opacity="0.6" />
            <path d="M95 57 C92 52 92 62 95 57" strokeLinecap="round" strokeWidth="1.5" opacity="0.6" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-pink-750 dark:text-pink-305">
            <Headphones className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    case 'prod-4': // Smart Speaker
      return (
        <div className={cn(containerClasses, 'from-emerald-50 via-emerald-100 to-emerald-200 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-950')}>
          <svg className="w-1/2 h-1/2 text-emerald-650 dark:text-emerald-400 drop-shadow-lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="30" y="20" width="40" height="60" rx="8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Mesh grid pattern overlay */}
            <line x1="38" y1="32" x2="62" y2="32" strokeDasharray="1 3" />
            <line x1="36" y1="40" x2="64" y2="40" strokeDasharray="1 3" />
            <line x1="36" y1="48" x2="64" y2="48" strokeDasharray="1 3" />
            <line x1="36" y1="56" x2="64" y2="56" strokeDasharray="1 3" />
            <line x1="38" y1="64" x2="62" y2="64" strokeDasharray="1 3" />
            
            {/* Volume indicator / LED strip */}
            <circle cx="50" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="animate-spin" style={{ transformOrigin: '50px 20px', animationDuration: '6s' }} />
            <circle cx="50" cy="72" r="3" fill="currentColor" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-emerald-750 dark:text-emerald-305">
            <Speaker className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    case 'prod-5': // 3-in-1 Power Charger
      return (
        <div className={cn(containerClasses, 'from-amber-50 via-amber-100 to-amber-200 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-950')}>
          <svg className="w-1/2 h-1/2 text-amber-600 dark:text-amber-400 drop-shadow-lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Stand Base */}
            <path d="M20 80 L80 80 M30 80 L50 35 L58 35" strokeLinecap="round" strokeLinejoin="round" />
            {/* Phone outline on stand */}
            <rect x="52" y="20" width="24" height="42" rx="4" transform="rotate(-15, 64, 41)" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
            <line x1="62" y1="28" x2="68" y2="26" transform="rotate(-15, 64, 41)" />
            {/* Lightning charging arrow */}
            <path d="M44 48 L48 53 L45 53 L49 59" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" className="animate-bounce" />
            {/* Watch charger pad */}
            <circle cx="34" cy="55" r="8" fill="currentColor" fillOpacity="0.1" />
            <circle cx="34" cy="55" r="4" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-amber-750 dark:text-amber-305">
            <BatteryCharging className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    case 'prod-6': // Desk Mat
      return (
        <div className={cn(containerClasses, 'from-slate-100 via-slate-200 to-slate-350 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950')}>
          <svg className="w-2/3 h-1/2 text-slate-700 dark:text-slate-300 drop-shadow-md" viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Flat desk pad representation */}
            <polygon points="10,65 110,65 95,25 25,25" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08" />
            {/* Desk Mat border stitch lines */}
            <polygon points="12,63 108,63 93,27 27,27" strokeDasharray="3 3" strokeWidth="1" />
            {/* Tiny keyboard outline placement */}
            <polygon points="35,53 85,53 79,35 41,35" strokeWidth="1.5" opacity="0.6" />
            {/* Mouse placeholder circle */}
            <ellipse cx="88" cy="44" rx="4" ry="6" strokeWidth="1.5" opacity="0.6" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-slate-750 dark:text-slate-305">
            <Layout className="h-3.5 w-3.5" />
          </div>
        </div>
      );

    default: // Fallback generic gear
      return (
        <div className={cn(containerClasses, 'from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950')}>
          <svg className="w-1/2 h-1/2 text-slate-500 dark:text-slate-400 drop-shadow-xs" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="50" cy="50" r="25" />
            <path d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50 M22 22 L32 32 M68 68 L78 78 M22 78 L32 68 M68 22 L78 32" strokeLinecap="round" />
            <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.25" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/40 dark:bg-slate-900/60 backdrop-blur-xs text-xs font-semibold text-slate-650 dark:text-slate-405">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>
      );
  }
};
