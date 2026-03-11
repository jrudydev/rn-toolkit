/**
 * Mock Link Data
 *
 * This represents the creator's links in their "link in bio" profile.
 * Similar to what you'd see in Linktree.
 */

export interface Link {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  enabled: boolean;
  clicks: number;
}

export const mockLinks: Link[] = [
  {
    id: '1',
    title: 'My Portfolio',
    url: 'https://portfolio.example.com',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: true,
    clicks: 1234,
  },
  {
    id: '2',
    title: 'YouTube Channel',
    url: 'https://youtube.com/@creator',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: true,
    clicks: 856,
  },
  {
    id: '3',
    title: 'Instagram',
    url: 'https://instagram.com/creator',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: true,
    clicks: 2341,
  },
  {
    id: '4',
    title: 'TikTok',
    url: 'https://tiktok.com/@creator',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: false,
    clicks: 567,
  },
  {
    id: '5',
    title: 'My Newsletter',
    url: 'https://newsletter.example.com',
    enabled: true,
    clicks: 432,
  },
  {
    id: '6',
    title: 'Merch Store',
    url: 'https://store.example.com',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: true,
    clicks: 198,
  },
  {
    id: '7',
    title: 'Podcast',
    url: 'https://podcast.example.com',
    enabled: false,
    clicks: 87,
  },
  {
    id: '8',
    title: 'Discord Community',
    url: 'https://discord.gg/example',
    thumbnail: 'https://via.placeholder.com/40',
    enabled: true,
    clicks: 654,
  },
];

/**
 * Helper to generate a new link ID
 */
export function generateLinkId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new link with defaults
 */
export function createLink(title: string, url: string): Link {
  return {
    id: generateLinkId(),
    title,
    url,
    enabled: true,
    clicks: 0,
  };
}
