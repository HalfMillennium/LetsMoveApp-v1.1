import anime from 'animejs';

// Direct animation function that can be used outside of hooks
export const animate = {
  /**
   * Fade in element from opacity 0 to 1
   */
  fadeIn: (element: HTMLElement, duration = 800, delay = 0) => {
    anime({
      targets: element,
      opacity: [0, 1],
      easing: 'easeOutSine',
      duration,
      delay
    });
  },

  /**
   * Fade in element from below (opacity 0 to 1 + translateY 20px to 0)
   */
  fadeInUp: (element: HTMLElement, duration = 800, delay = 0) => {
    anime({
      targets: element,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutSine',
      duration,
      delay
    });
  },

  /**
   * Fade in element from above (opacity 0 to 1 + translateY -20px to 0)
   */
  fadeInDown: (element: HTMLElement, duration = 800, delay = 0) => {
    anime({
      targets: element,
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutSine',
      duration,
      delay
    });
  },

  /**
   * Scale element from 0.9 to 1 with opacity 0 to 1
   */
  scaleIn: (element: HTMLElement, duration = 800, delay = 0) => {
    anime({
      targets: element,
      opacity: [0, 1],
      scale: [0.9, 1],
      easing: 'easeOutSine',
      duration,
      delay
    });
  },

  /**
   * Stagger animation for multiple items
   */
  stagger: (elements: HTMLElement[], animation: (el: HTMLElement, i: number) => void, staggerDelay = 50) => {
    elements.forEach((el, i) => {
      setTimeout(() => animation(el, i), staggerDelay * i);
    });
  },

  /**
   * Stagger cards from bottom with slight scale
   */
  staggerCards: (elements: HTMLElement[], duration = 800, baseDelay = 0) => {
    elements.forEach((el, i) => {
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [15, 0],
        scale: [0.97, 1],
        easing: 'easeOutSine',
        duration,
        delay: baseDelay + (i * 90)
      });
    });
  },

  /**
   * Pulse animation for highlighting elements
   */
  pulse: (element: HTMLElement, duration = 1500) => {
    anime({
      targets: element,
      scale: [1, 1.05, 1],
      easing: 'easeInOutSine',
      duration,
      loop: true
    });
  },

  /**
   * Bounce in with spring physics
   */
  bounceIn: (element: HTMLElement, duration = 800, delay = 0) => {
    anime({
      targets: element,
      opacity: [0, 1],
      scale: [0.3, 1.1, 1],
      easing: 'spring(1, 80, 10, 0)',
      duration,
      delay
    });
  }
};