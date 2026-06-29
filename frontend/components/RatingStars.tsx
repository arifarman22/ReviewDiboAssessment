'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number; // 0 to 5
  maxStars?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  interactive = false,
  onChange,
  size = 'md',
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  const handleStarMouseEnter = (starValue: number) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleStarMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={handleStarMouseLeave}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        
        // Determine fill state
        // For interactive, it's discrete (1, 2, 3, 4, 5)
        // For read-only, it can handle decimals. If rating is 4.5, star 5 is empty, star 1-4 are full, or star 5 is half-full.
        // Let's implement partial filling using CSS percentage clipping or simple filled/empty/half states.
        let fillType: 'none' | 'half' | 'full' = 'none';

        if (interactive) {
          fillType = starValue <= activeRating ? 'full' : 'none';
        } else {
          if (rating >= starValue) {
            fillType = 'full';
          } else if (rating > starValue - 1) {
            // e.g. rating is 4.3, starValue is 5. rating is between 4 and 5.
            fillType = rating - (starValue - 1) >= 0.5 ? 'half' : 'none';
          }
        }

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarMouseEnter(starValue)}
            className={cn(
              'transition-all duration-150 outline-none focus:scale-110',
              {
                'cursor-pointer hover:scale-115': interactive,
                'cursor-default': !interactive,
              }
            )}
            aria-label={interactive ? `Rate ${starValue} stars` : `Rating: ${rating} out of ${maxStars}`}
          >
            <div className="relative">
              {/* Underlay / Empty star */}
              <Star
                className={cn(
                  starSizes[size],
                  'text-slate-200 fill-transparent dark:text-slate-800'
                )}
              />
              
              {/* Overlay / Filled star */}
              {fillType === 'full' && (
                <Star
                  className={cn(
                    starSizes[size],
                    'absolute top-0 left-0 text-amber-400 fill-amber-400 animate-scaleIn'
                  )}
                />
              )}

              {fillType === 'half' && (
                <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                  <Star
                    className={cn(
                      starSizes[size],
                      'text-amber-400 fill-amber-400'
                    )}
                  />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
