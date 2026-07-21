export interface ImageSliderImage {
  src: string;
  alt: string;
  title?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  scale?: number;
  objectPosition?: string;
}

export interface SliderConfig {
  autoPlay: boolean;
  interval: number;
  showDots: boolean;
  showArrows: boolean;
  width?: string;
  height?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const heroSliderImages: ImageSliderImage[] = [
  {
    src: '/hero/church.jpg',
    alt: 'Dramatic modern cathedral interior with sunlight filtering through tall windows',
    title: 'Cathedral Main',
    objectFit: 'cover', 
    scale: 1.05,
  },
  {
    src: '/hero/hero-2.jpg',
    alt: 'Sacred spiritual space with warm ambient lighting',
    title: 'Sacred Space',
    objectFit: 'cover',
    scale: 1.1,
    objectPosition: 'center 40%',
  },
  {
    src: '/hero/hero-3.jpg',
    alt: 'Sacred spiritual space with warm ambient lighting',
    title: 'Sacred Space',
    objectFit: 'cover',
    scale: 1.1,
    objectPosition: '20px -20px',
  },
  {
    src: '/hero/hero-5.jpg',
    alt: 'Sacred spiritual space with warm ambient lighting',
    title: 'Sacred Space',
    objectPosition: '5px 0.2px'
  },  
  {
    src: '/hero/church.jpg',
    alt: 'Sacred spiritual space with warm ambient lighting',
    title: 'Sacred Space',
    objectPosition: '5px 0.2px'
  },  
];

export const sliderConfig = {
  autoPlay: true,
  interval: 6000,
  showDots: true,
  showArrows: true,
  width: '100%',
  height: '100%',
  aspectRatio: '16.9',
  objectFit: 'cover',
};
