import { esmLib } from '@niamori/rollup-config/presets'
import { import as importing } from 'importx'

/** @type typeof import('./src/plugins') */
const plugins = await importing('./src/plugins.ts', import.meta.url)
await Promise.all(Object.entries(plugins.pluginRegstry).map(([_, { typegen }]) => typegen()))

export default await esmLib()
