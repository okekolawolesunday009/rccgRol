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
    colSpan: 1,
    rowSpan: 1,
  },
];
