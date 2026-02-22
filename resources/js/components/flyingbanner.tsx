// components/AnimatedImage.tsx
import React from 'react';
import Image, { ImageProps } from 'next/image';

type AnimationType = 
  | 'fade' 
  | 'scale' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right'
  | 'float'
  | 'pulse';

interface AnimatedImageProps extends Omit<ImageProps, 'className'> {
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  hoverAnimation?: boolean;
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  animation = 'fade',
  duration = 0.5,
  delay = 0,
  hoverAnimation = false,
  className = '',
  ...props
}) => {
  const getAnimationClass = () => {
    const base = `transition-all duration-[${duration}s] delay-[${delay}s]`;
    
    if (hoverAnimation) {
      switch (animation) {
        case 'fade': return `${base} opacity-90 hover:opacity-100`;
        case 'scale': return `${base} hover:scale-105`;
        case 'float': return `${base} hover:-translate-y-1`;
        case 'pulse': return `${base} hover:animate-pulse`;
        default: return `${base} hover:animate-${animation}`;
      }
    }
    
    switch (animation) {
      case 'fade': return `${base} animate-fade-in`;
      case 'scale': return `${base} animate-scale-in`;
      case 'float': return `${base} animate-float`;
      case 'pulse': return `${base} animate-pulse`;
      default: return `${base} animate-${animation}`;
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        {...props}
        className={`w-full h-auto object-cover ${getAnimationClass()}`}
      />
    </div>
  );
};

export default AnimatedImage;