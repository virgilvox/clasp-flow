# Phase 0: Foundation - Detailed Implementation Plan

**Phase**: 0 - Foundation
**Goal**: Project setup, architecture, core infrastructure
**Status**: Not Started

---

## Overview

This phase establishes the technical foundation for CLASP Flow. By the end of this phase, we'll have:
- A working Vite + Vue 3 + TypeScript project
- Electron integration with Forge
- Basic node editor canvas with Vue Flow
- Core state management
- Testing infrastructure
- CI/CD pipeline

---

## Task Breakdown

### 1. Project Initialization

#### 1.1 Create Vite Project
```bash
# Create new project
npm create vite@latest clasp-flow-app -- --template vue-ts

# Move contents up (or create fresh in clasp-flow directory)
cd clasp-flow-app
```

**Files Created**:
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.ts`
- `src/App.vue`
- `index.html`

#### 1.2 Install Core Dependencies
```bash
# Vue ecosystem
npm install vue-router@4 pinia

# Node editor
npm install @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap

# Storage
npm install dexie

# Utilities
npm install nanoid lodash-es
npm install -D @types/lodash-es

# Icons
npm install lucide-vue-next
```

#### 1.3 Install Dev Dependencies
```bash
# Testing
npm install -D vitest @vue/test-utils happy-dom @playwright/test

# Linting & Formatting
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-plugin-vue eslint-config-prettier

# TypeScript
npm install -D @types/node
```

---

### 2. Electron Integration

#### 2.1 Add Electron Forge
```bash
# Install Electron and Forge
npm install -D electron@latest
npm install -D @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/maker-dmg @electron-forge/maker-zip
npm install -D @electron-forge/plugin-vite

# Initialize Forge
npx electron-forge import
```

#### 2.2 Configure Electron Vite
Create `forge.config.ts`:
```typescript
import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'CLASP Flow',
    executableName: 'clasp-flow',
    icon: './public/icon',
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-dmg', config: {} },
    { name: '@electron-forge/maker-deb', config: {} },
    { name: '@electron-forge/maker-rpm', config: {} },
    { name: '@electron-forge/maker-zip', platforms: ['darwin', 'linux', 'win32'] },
  ],
  plugins: [
    new VitePlugin({
      build: [
        { entry: 'src/main/index.ts', config: 'vite.main.config.ts' },
        { entry: 'src/main/preload.ts', config: 'vite.preload.config.ts' },
      ],
      renderer: [{ name: 'main_window', config: 'vite.renderer.config.ts' }],
    }),
  ],
};

export default config;
```

#### 2.3 Create Main Process Files
`src/main/index.ts`:
```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

`src/main/preload.ts`:
```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,

  // File system
  selectFile: (options: any) => ipcRenderer.invoke('select-file', options),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, data: any) => ipcRenderer.invoke('write-file', path, data),

  // Settings
  getCustomNodesPath: () => ipcRenderer.invoke('get-custom-nodes-path'),
  setCustomNodesPath: (path: string) => ipcRenderer.invoke('set-custom-nodes-path', path),

  // Native features
  getSerialPorts: () => ipcRenderer.invoke('get-serial-ports'),
  getMIDIDevices: () => ipcRenderer.invoke('get-midi-devices'),
});
```

---

### 3. Project Structure

#### 3.1 Create Directory Structure
```bash
mkdir -p src/renderer/{assets/styles,assets/icons,components/{common,editor,nodes/controls,panels,layout},composables,stores,views,router}
mkdir -p src/main/{ipc,services}
mkdir -p src/{engine/{graph,execution,types,workers},nodes/{debug,inputs,outputs,math,logic,audio,video,shaders,data,ai,code,connectivity},platform/{web,electron},storage,utils}
mkdir -p tests/{unit,integration,e2e}
mkdir -p custom-nodes/.gitkeep
mkdir -p public
```

#### 3.2 Configure Path Aliases
`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/renderer/*"],
      "@engine/*": ["./src/engine/*"],
      "@nodes/*": ["./src/nodes/*"],
      "@platform/*": ["./src/platform/*"],
      "@storage/*": ["./src/storage/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

---

### 4. Design System Implementation

#### 4.1 Design Tokens
`src/renderer/assets/styles/tokens.css`:
```css
:root {
  /* Primary (Teal) */
  --color-primary-50: #E6F7F3;
  --color-primary-100: #B3E8DA;
  --color-primary-200: #80D9C1;
  --color-primary-300: #4DCAA8;
  --color-primary-400: #2AAB8A;
  --color-primary-500: #1A9A7A;
  --color-primary-600: #168A6D;
  --color-primary-700: #127A60;
  --color-primary-800: #0E6A53;
  --color-primary-900: #0A5A46;

  /* Neutral (Grays) */
  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #F5F5F5;
  --color-neutral-100: #E8E8E8;
  --color-neutral-200: #D4D4D4;
  --color-neutral-300: #B0B0B0;
  --color-neutral-400: #8C8C8C;
  --color-neutral-500: #6B6B6B;
  --color-neutral-600: #4A4A4A;
  --color-neutral-700: #3D3D3D;
  --color-neutral-800: #2D2D2D;
  --color-neutral-900: #1A1A1A;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-selection: #FEF9E7;

  /* Data Types */
  --color-type-trigger: #F59E0B;
  --color-type-number: #2AAB8A;
  --color-type-string: #8B5CF6;
  --color-type-boolean: #EF4444;
  --color-type-audio: #22C55E;
  --color-type-video: #3B82F6;
  --color-type-texture: #EC4899;
  --color-type-data: #6B7280;
  --color-type-any: #FFFFFF;

  /* Typography */
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Borders */
  --radius-sm: 2px;
  --radius-default: 4px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-offset: 4px 4px 0 0;

  /* Transitions */
  --transition-default: 200ms ease;
}
```

#### 4.2 Base Styles
`src/renderer/assets/styles/base.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-neutral-900);
  background: var(--color-neutral-100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

### 5. Vue Flow Integration

#### 5.1 Basic Node Canvas
`src/renderer/components/editor/NodeCanvas.vue`:
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import BaseNode from '@/components/nodes/BaseNode.vue';

const { onConnect, addEdges, project } = useVueFlow();

const nodes = ref([]);
const edges = ref([]);

onConnect((connection) => {
  addEdges([connection]);
});

const nodeTypes = {
  custom: BaseNode,
};
</script>

<template>
  <div class="node-canvas">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-edge-options="{
        type: 'smoothstep',
        animated: true,
      }"
      fit-view-on-init
      @drop="onDrop"
      @dragover.prevent
    >
      <Background />
      <Controls />
      <MiniMap />

      <Panel position="top-left">
        <div class="canvas-controls">
          <button @click="() => {}">Play</button>
          <button @click="() => {}">Stop</button>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<style scoped>
.node-canvas {
  width: 100%;
  height: 100%;
}

.canvas-controls {
  display: flex;
  gap: var(--space-2);
}
</style>
```

---

### 6. State Management

#### 6.1 Flows Store
`src/renderer/stores/flows.ts`:
```typescript
import { defineStore } from 'pinia';
import type { Node, Edge } from '@vue-flow/core';
import { nanoid } from 'nanoid';

interface FlowState {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  dirty: boolean;
}

export const useFlowsStore = defineStore('flows', {
  state: (): {
    flows: FlowState[];
    activeFlowId: string | null;
  } => ({
    flows: [],
    activeFlowId: null,
  }),

  getters: {
    activeFlow: (state) =>
      state.flows.find((f) => f.id === state.activeFlowId) ?? null,

    activeNodes: (state) =>
      state.flows.find((f) => f.id === state.activeFlowId)?.nodes ?? [],

    activeEdges: (state) =>
      state.flows.find((f) => f.id === state.activeFlowId)?.edges ?? [],
  },

  actions: {
    createFlow(name: string = 'Untitled Flow') {
      const flow: FlowState = {
        id: nanoid(),
        name,
        nodes: [],
        edges: [],
        dirty: false,
      };
      this.flows.push(flow);
      this.activeFlowId = flow.id;
      return flow;
    },

    setActiveFlow(id: string) {
      this.activeFlowId = id;
    },

    addNode(node: Omit<Node, 'id'>) {
      if (!this.activeFlow) return;
      const newNode: Node = {
        ...node,
        id: nanoid(),
      };
      this.activeFlow.nodes.push(newNode);
      this.activeFlow.dirty = true;
      return newNode;
    },

    removeNode(nodeId: string) {
      if (!this.activeFlow) return;
      this.activeFlow.nodes = this.activeFlow.nodes.filter(
        (n) => n.id !== nodeId
      );
      this.activeFlow.edges = this.activeFlow.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      );
      this.activeFlow.dirty = true;
    },

    addEdge(edge: Omit<Edge, 'id'>) {
      if (!this.activeFlow) return;
      const newEdge: Edge = {
        ...edge,
        id: nanoid(),
      };
      this.activeFlow.edges.push(newEdge);
      this.activeFlow.dirty = true;
      return newEdge;
    },

    removeEdge(edgeId: string) {
      if (!this.activeFlow) return;
      this.activeFlow.edges = this.activeFlow.edges.filter(
        (e) => e.id !== edgeId
      );
      this.activeFlow.dirty = true;
    },

    updateNodePosition(nodeId: string, position: { x: number; y: number }) {
      if (!this.activeFlow) return;
      const node = this.activeFlow.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.position = position;
      }
    },
  },
});
```

---

### 7. Testing Setup

#### 7.1 Vitest Configuration
`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@nodes': path.resolve(__dirname, 'src/nodes'),
      '@platform': path.resolve(__dirname, 'src/platform'),
    },
  },
});
```

#### 7.2 Playwright Configuration
`playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev:web',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### 8. CI/CD Pipeline

#### 8.1 GitHub Actions CI
`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:web
      - uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: dist/web

  build-electron:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run make
      - uses: actions/upload-artifact@v4
        with:
          name: electron-${{ matrix.os }}
          path: out/make
```

---

## Checklist

### Project Setup
- [ ] Create Vite project
- [ ] Install dependencies
- [ ] Configure TypeScript paths
- [ ] Set up ESLint + Prettier

### Electron
- [ ] Install Electron Forge
- [ ] Create main process
- [ ] Create preload script
- [ ] Configure Forge makers

### Structure
- [ ] Create directory structure
- [ ] Set up path aliases
- [ ] Create base components

### Design System
- [ ] Create tokens.css
- [ ] Create base.css
- [ ] Create component styles
- [ ] Implement Button component
- [ ] Implement Badge component
- [ ] Implement Panel component

### Vue Flow
- [ ] Install Vue Flow packages
- [ ] Create NodeCanvas component
- [ ] Create BaseNode component
- [ ] Create connection line styles

### State
- [ ] Create flows store
- [ ] Create nodes store
- [ ] Create runtime store
- [ ] Create settings store

### Testing
- [ ] Configure Vitest
- [ ] Configure Playwright
- [ ] Write first unit test
- [ ] Write first E2E test

### CI/CD
- [ ] Create CI workflow
- [ ] Create build workflows
- [ ] Test matrix builds

---

## Completion Criteria

Phase 0 is complete when:
1. `npm run dev` starts both web and Electron
2. Node editor canvas renders with zoom/pan
3. Can add and connect basic nodes
4. Tests pass in CI
5. Multi-platform Electron builds succeed
6. Design system components match design-system.html

---

## Next Phase

After completing Phase 0, proceed to [Phase 1: Core Editor](./PHASE_1_CORE_EDITOR.md) (to be created).
