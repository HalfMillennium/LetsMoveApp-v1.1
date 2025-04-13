import { useEffect, useRef } from 'react';
// @ts-ignore - Ignore TypeScript errors for anime.js
import anime from 'animejs';

type AnimationOptions = anime.AnimeParams;

export const useAnimation = (
  selector: string | Element | HTMLElement,
  options: AnimationOptions,
  dependencies: any[] = []
) => {
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    // If the animation was already running, pause it
    if (animationRef.current) {
      animationRef.current.pause();
    }

    // Create a new animation
    animationRef.current = anime({
      targets: selector,
      ...options
    });

    // Cleanup function to pause animation on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, dependencies);

  return animationRef;
};

// Predefined animations that can be used throughout the app
export const animations = {
  fadeIn: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  fadeInUp: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  fadeInDown: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateY: [-20, 0],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  fadeInLeft: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateX: [-20, 0],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  fadeInRight: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateX: [20, 0],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  scaleIn: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    scale: [0.9, 1],
    easing: 'easeOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
  
  pulse: (delay = 0, duration = 1500): AnimationOptions => ({
    scale: [1, 1.05, 1],
    easing: 'easeInOutSine',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay }),
    loop: true
  }),
  
  staggerCards: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateY: [15, 0],
    scale: [0.97, 1],
    easing: 'easeOutSine',
    duration,
    delay: anime.stagger(90, { start: delay }),
  }),
  
  staggerListItems: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    translateX: [-10, 0],
    easing: 'easeOutSine',
    duration,
    delay: anime.stagger(50, { start: delay }),
  }),
  
  bounceIn: (delay = 0, duration = 800): AnimationOptions => ({
    opacity: [0, 1],
    scale: [0.3, 1.1, 1],
    easing: 'spring(1, 80, 10, 0)',
    duration,
    delay: typeof delay === 'function' ? delay : anime.stagger(50, { start: delay })
  }),
};