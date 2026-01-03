# MeKu Storybook Builder v0.2.0 "Consolidation"

A collaborative story creation platform for illustrated storybooks, comics, and interactive pick-your-own-adventure tales.

## 🎯 What's Fixed in This Version

This consolidation release fixes the file structure issues from GAIS where code was being created in both root and `src/` directories with different implementations.

### ✅ Features Now Working

| Feature | Status | Description |
|---------|--------|-------------|
| **360° Image Rotation** | ✅ | Drag the green rotation handle to freely rotate images |
| **Free-Form Positioning** | ✅ | Drag images anywhere on the canvas |
| **Asset Library with Tags** | ✅ | Full tagging system (add/edit/remove) with categories |
| **Expandable Timeline** | ✅ | Click to expand (10% → 60%), X to minimize |
| **Clip Renaming** | ✅ | Double-click any clip to rename it |
| **Grouped Tracks** | ✅ | Visuals group contains Background/Characters/Props |
| **Page Markers** | ✅ | Yellow vertical lines showing page transitions |
| **Cut/Mend Tools** | ✅ | Drag on ruler to select, use scissors for ripple delete |
| **Pin/Layer Controls** | ✅ | Pin blocks in place, bring to front |
| **DevTools Mini** | ✅ | Wrench button with AI stubs toggle and Cognitive sliders |

## 📁 File Structure (Consolidated)

```
meku-consolidated/
├── index.html              # Entry point with import maps
├── src/
│   ├── index.tsx           # React root
│   ├── App.tsx             # Main app component
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # App constants
│   ├── components/
│   │   ├── Canvas.tsx      # ✨ NEW: Rotation + positioning
│   │   ├── StoryStage.tsx  # Drop zone wrapper
│   │   ├── Sidebar.tsx     # Left panel
│   │   ├── StudioLayout.tsx
│   │   ├── ZoomControls.tsx
│   │   ├── DevTools.tsx
│   │   ├── DevToolsMini.tsx
│   │   └── ui/
│   │       └── AIStub.tsx
│   ├── features/
│   │   ├── assets/
│   │   │   └── AssetLibrary.tsx  # ✨ Renamed from CharacterStack
│   │   ├── timeline/
│   │   │   ├── TimelineRail.tsx
│   │   │   ├── Clip.tsx
│   │   │   └── MendingOverlay.tsx
│   │   └── workspace/
│   │       └── StoryWorkspace.tsx
│   ├── store/
│   │   ├── storyStore.ts   # ✨ NEW: rotation/position actions
│   │   ├── timelineStore.ts
│   │   └── devToolsStore.ts
│   └── utils/
│       ├── haptics.ts
│       └── cognitiveEngine.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Deployment

### For GitHub Pages (GIAS Compatible)

The app uses ESM import maps, so it works directly without a build step:

1. Replace your existing repo files with this structure
2. Push to GitHub
3. Enable GitHub Pages on the `main` branch

### For Local Development

```bash
# Using a simple HTTP server
npx serve .

# Or with Python
python -m http.server 3000
```

## 🔑 Key Changes from Previous Version

1. **Single Source of Truth**: All code lives in `src/` - no more duplicates
2. **Fixed Imports**: `AssetLibrary` export matches what `Sidebar` imports
3. **Canvas Rotation**: Added rotation handle with live angle calculation
4. **Block Positioning**: Blocks now use absolute positioning with drag support
5. **Tag Flow**: Tags from Asset Library transfer to canvas blocks on drop

## 🎨 Using the Features

### Rotating Images
1. Click an image block to select it
2. Look for the green circle above the block
3. Drag the green circle in a circular motion

### Adding Tags to Assets
1. Select an asset in the Library
2. Click the tag icon (top-right of asset panel)
3. Enter label, select type, click checkmark

### Timeline Cut/Mend
1. Drag on the time ruler (top bar) to select a range
2. Yellow overlay appears
3. Click scissors for "Cut Inside" (ripple delete)
4. Watch the mending animation stitch it together!

## 🛠️ DevTools

- **Ctrl+D**: Open full DevTools panel
- **Wrench button** (bottom-right): Open DevTools Mini
- Toggle AI stubs visibility
- Adjust Cognitive Engine sliders (lexical/conceptual levels)

---

*Built with React 18 + TypeScript + Tailwind CSS + Zustand + Framer Motion*
