declare module 'eslint-plugin-eslint-comments' {
  import { ESLint } from 'eslint'

  declare const plugin: ESLint.Plugin
  export default plugin
}

declare module '@next/eslint-plugin-next' {
  import { ESLint } from 'eslint'

  declare const plugin: ESLint.Plugin & { configs: Record<string, ESLint.ConfigData> }
  export default plugin
}

declare module 'eslint-plugin-unused-imports' {
  import { ESLint } from 'eslint'

  declare const plugin: ESLint.Plugin
  export default plugin
}

declare module '@eslint/js' {
  import { ESLint } from 'eslint'

  declare const plugin: ESLint.Plugin & { configs: Record<string, ESLint.ConfigData> }
  export default plugin
}

declare module 'eslint-plugin-react-hooks' {
  import { ESLint } from 'eslint'

  declare const plugin: ESLint.Plugin & { configs: Record<string, ESLint.ConfigData> }
  export default plugin
}
