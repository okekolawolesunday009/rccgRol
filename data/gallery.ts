import type { GalleryItem } from '../types';

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    imageUrls: [
      '/church/worship/worship.jpg',
      '/church/worship/worship-2.jpg'
    ],
    category: 'Worship',
    caption: 'An Evening of Hymns',
    description: 'A joyful worship night filled with music, community, and heartfelt praise.',
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: 'gallery-2',
    imageUrls: [
      '/hero/hero-5.jpg',
      '/hero/hero-4.jpg',
      '/hero/hero-3.jpg'
    ],
    category: 'Community',
    caption: 'Annual Family Picnic',
    description: 'Family, food, and fellowship under the open sky.',
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: 'gallery-3',
    imageUrls: [
      '/church/youth/youth-1.jpg',
      '/church/youth/youth-2.jpg',
      '/church/youth/youth-3.jpg',
      '/church/youth/youth-4.jpg',
      '/church/youth/youth-5.jpg'
    ],
    category: 'Youth',
    caption: 'Youth Summit',
    description: 'Dynamic worship and connection at our youth leadership gathering.',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: 'gallery-4',
    imageUrls: [
      '/church/birthday/birthday.jpg'
    ],
    category: 'Birthday',
    caption: 'Birthday Bash',
    description: 'Celebrating milestones and shared joy in a warm, welcoming space.',
    colSpan: 1,
    rowSpan: 1,
  },
];
