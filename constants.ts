import { Project, Page, LayoutType, User, FeatureFlag, ApiRegistryItem, PageSize } from './types';

export const MOCK_USER: User = {
  id: 'usr_123',
  name: 'Taylor Storyteller',
  email: 'taylor@example.com',
  avatar: 'https://picsum.photos/seed/taylor/200',
  isDev: true,
};

export const INITIAL_PAGE: Page = {
  id: 'pg_1',
  projectId: 'proj_1',
  index: 0,
  layoutType: LayoutType.SINGLE,
  blocks: [],
  background: '#ffffff',
};

export const MOCK_PROJECT: Project = {
  id: 'proj_1',
  title: 'The Lost Fox',
  description: 'A tale about a fox looking for its way home.',
  ownerId: 'usr_123',
  createdAt: new Date().toISOString(),
  pages: [INITIAL_PAGE],
};

export const PAGE_SIZES: Record<PageSize, { width: string; height: string; label: string }> = {
  [PageSize.A4]: { width: '595px', height: '842px', label: 'A4 (210x297mm)' },
  [PageSize.SQUARE]: { width: '600px', height: '600px', label: 'Square (1:1)' },
  [PageSize.LETTER]: { width: '612px', height: '792px', label: 'US Letter' },
  [PageSize.MOBILE]: { width: '375px', height: '667px', label: 'Mobile Portrait' },
};

export const AVAILABLE_FONTS = [
  { name: 'Inter', label: 'Modern Sans' },
  { name: 'Merriweather', label: 'Book Serif' },
  { name: 'Bangers', label: 'Comic Header' },
  { name: 'Creepster', label: 'Scary' },
  { name: 'Orbitron', label: 'Sci-Fi' },
  { name: 'Playfair Display', label: 'Elegant' },
];

// Phase 0: DevTools Initial Data
export const INITIAL_FLAGS: FeatureFlag[] = [
  { key: 'enable_collaboration', value: false, description: 'Enable multi-user socket connections' },
  { key: 'enable_genai', value: true, description: 'Enable Gemini/Firefly hooks' },
  { key: 'pya_node_editor', value: false, description: 'Show Pick-Your-Adventure graph editor' },
];

export const API_REGISTRY: ApiRegistryItem[] = [
  { name: 'Supabase Auth', status: 'mock', usedFor: 'Authentication', authType: 'JWT' },
  { name: 'Gemini Flash 2.5', status: 'planned', usedFor: 'Text generation', authType: 'API Key' },
  { name: 'Adobe Firefly', status: 'planned', usedFor: 'Image generation', authType: 'OAuth' },
];