import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerDMG } from '@electron-forge/maker-dmg'

const config: ForgeConfig = {
  packagerConfig: {
    name: 'LATCH',
    executableName: 'latch',
    asar: true,
    icon: './public/icon',
    appBundleId: 'com.lumencanvas.latch',
    appCategoryType: 'public.app-category.developer-tools',
    // Only include built files, exclude source and dev files
    ignore: [
      /^\/src$/,
      /^\/src\//,
      /^\/\.git/,
      /^\/\.github/,
      /^\/\.vscode/,
      /^\/node_modules\/\.cache/,
      /^\/custom-nodes$/,
      /^\/tests$/,
      /^\/coverage$/,
      /^\/out$/,
      /^\/dist$/,
      /\.map$/,
      /\.ts$/,
      /\.vue$/,
      /tsconfig/,
      /vite\.config/,
      /electron\.vite\.config/,
      /forge\.config/,
      /eslint/,
      /prettier/,
      /vitest/,
      /playwright/,
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'LATCH',
    }),
    new MakerZIP({}, ['darwin', 'linux', 'win32']),
    new MakerDMG({
      format: 'ULFO',
      name: 'LATCH',
    }),
    new MakerDeb({
      options: {
        name: 'latch',
        productName: 'LATCH',
        maintainer: 'LumenCanvas',
        homepage: 'https://github.com/lumencanvas/latch',
      },
    }),
    new MakerRpm({
      options: {
        name: 'latch',
        productName: 'LATCH',
        homepage: 'https://github.com/lumencanvas/latch',
      },
    }),
  ],
}

export default config
