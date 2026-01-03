import { Page, LayoutType, PageSize, User, Project } from './types';

// --- App Metadata ---
export const APP_NAME = 'MeKu Storybook Builder';
export const APP_VERSION = '0.2.0';
export const APP_CODENAME = 'Consolidation';

// --- Page Size Definitions ---
export const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  [PageSize.A4]: { width: 595, height: 842, label: 'A4 Portrait' },
  [PageSize.LETTER]: { width: 612, height: 792, label: 'US Letter' },
  [PageSize.SQUARE]: { width: 600, height: 600, label: 'Square (1:1)' },
  [PageSize.MOBILE]: { width: 375, height: 667, label: 'Mobile (iPhone)' },
};

// --- Available Fonts ---
export const AVAILABLE_FONTS = [
  { name: 'Merriweather', label: 'Story (Serif)', category: 'story' },
  { name: 'Playfair Display', label: 'Display (Title)', category: 'display' },
  { name: 'Inter', label: 'UI (Sans)', category: 'ui' },
  { name: 'Georgia', label: 'Classic Serif', category: 'story' },
  { name: 'Comic Sans MS', label: 'Playful', category: 'fun' },
];

// --- Initial Data ---
export const INITIAL_PAGE: Page = {
  id: 'pg_initial',
  projectId: 'proj_demo',
  index: 0,
  layoutType: LayoutType.SINGLE,
  blocks: [],
  background: '#ffffff'
};

// --- Mock User ---
export const MOCK_USER: User = {
  id: 'usr_demo',
  name: 'Story Creator',
  email: 'creator@meku.studio',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MekuCreator',
  isDev: true // Enable DevTools for demo
};

// --- Mock Project ---
export const MOCK_PROJECT: Project = {
  id: 'proj_demo',
  title: 'The Great Adventure',
  description: 'A tale of courage and friendship',
  ownerId: MOCK_USER.id,
  createdAt: new Date().toISOString(),
  pages: [INITIAL_PAGE]
};

// --- Environment Detection ---
export const IS_GITHUB_PAGES = window.location.hostname.includes('github.io');
export const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const ENVIRONMENT = IS_GITHUB_PAGES ? 'gh-pages' : IS_LOCALHOST ? 'localhost' : 'production';

// --- Feature Flags ---
export const DEFAULT_FEATURE_FLAGS = {
  enableCollaboration: false,
  enablePYOA: false,
  enableAIGeneration: false,
  enableMCPLogging: false,
  showAIStubs: true,
};

// --- API Registry (For DevTools) ---
export const API_REGISTRY = [
  { name: 'Supabase Auth', status: 'planned', usedFor: 'User authentication', authType: 'JWT' },
  { name: 'Supabase Storage', status: 'planned', usedFor: 'Asset storage', authType: 'JWT' },
  { name: 'Google Gemini', status: 'mock', usedFor: 'Story generation', authType: 'API Key' },
  { name: 'Adobe Firefly', status: 'planned', usedFor: 'Image generation', authType: 'OAuth' },
  { name: 'ElevenLabs', status: 'planned', usedFor: 'Text-to-speech', authType: 'API Key' },
];
