import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerDMG } from '@electron-forge/maker-dmg'

const config: ForgeConfig = {
  packagerConfig: {
    name: 'CLASP Flow',
    executableName: 'clasp-flow',
    asar: true,
    icon: './public/icon',
    appBundleId: 'com.lumencanvas.clasp-flow',
    appCategoryType: 'public.app-category.developer-tools',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'clasp-flow',
    }),
    new MakerZIP({}, ['darwin', 'linux', 'win32']),
    new MakerDMG({
      format: 'ULFO',
    }),
    new MakerDeb({
      options: {
        maintainer: 'LumenCanvas',
        homepage: 'https://github.com/lumencanvas/clasp-flow',
      },
    }),
    new MakerRpm({
      options: {
        homepage: 'https://github.com/lumencanvas/clasp-flow',
      },
    }),
  ],
}

export default config
