export enum LayoutType {
  SINGLE = '1x1',
  SPLIT_H = '1x2',
  SPLIT_V = '2x1',
  COMIC_3 = '3x1_comic',
  GRID_4 = '2x2'
}

export enum BlockType {
  TEXT = 'text',
  IMAGE = 'image',
}

export enum PageSize {
  A4 = 'A4',
  SQUARE = 'Square',
  LETTER = 'Letter',
  MOBILE = 'Mobile'
}

export interface Tag {
  label: string;
  color: string; // Hex code
  type: 'name' | 'sex' | 'prop' | 'background' | 'main_char' | 'custom';
}

export interface Block {
  id: string;
  type: BlockType;
  content: string; // Text content or Image URL
  style?: Record<string, any>; // CSS properties like fontFamily, color
  position?: { x: number; y: number }; // For free-form dragging
  rotation?: number; // 0-360 degrees
  zIndex?: number; // Layering
  isPinned?: boolean; // If true, cannot be moved
  tags?: Tag[]; // Classification
}

export interface Page {
  id: string;
  projectId: string;
  index: number;
  layoutType: LayoutType;
  blocks: Block[];
  background?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: string;
  pages: Page[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isDev: boolean; // For DevTools access
}

// DevTools specific types
export interface FeatureFlag {
  key: string;
  value: boolean;
  description: string;
}

export interface ApiRegistryItem {
  name: string;
  status: 'live' | 'mock' | 'planned';
  usedFor: string;
  authType: string;
}
