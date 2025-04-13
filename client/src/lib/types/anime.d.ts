declare module 'animejs' {
  interface AnimeInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    seek: (time: number) => void;
    reverse: () => void;
  }

  interface AnimeParams {
    targets?: string | Element | HTMLElement | NodeList | Element[] | HTMLElement[] | null;
    duration?: number;
    delay?: number | Function;
    endDelay?: number;
    easing?: string;
    round?: number;
    direction?: string;
    loop?: boolean | number;
    autoplay?: boolean;
    [key: string]: any;
  }

  function stagger(value: number, options?: { start?: number; from?: number | string | Element; direction?: string; easing?: string }): Function;
  function timeline(params?: AnimeParams): AnimeInstance;
  function random(min: number, max: number): number;

  export default function anime(params: AnimeParams): AnimeInstance;
  export { stagger, timeline, random };
}