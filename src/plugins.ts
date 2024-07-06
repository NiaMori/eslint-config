import assert from 'assert'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { type ESLint, type Linter } from 'eslint'
import { pluginsToRulesDTS } from 'eslint-typegen/core'
import pluginESLintJs from '@eslint/js'
import { isPackageListed } from 'local-pkg'
import { fixupPluginRules } from '@eslint/compat'

async function sugar<RuleOptions>(fn: () => Promise<{ name: string, plugin: unknown, plugins: unknown, recommended: unknown, RuleOptions: RuleOptions }>): Promise<{
  name: string
  plugin: ESLint.Plugin
  plugins: Record<string, ESLint.Plugin>
  recommended: Linter.RulesRecord
  typegen: () => Promise<void>
  flat: {
    name: string
    plugins: Record<string, ESLint.Plugin>
    rules: Linter.RulesRecord
  }
  RuleOptions: RuleOptions
}> {
  const { name, plugin, plugins, recommended } = await fn()

  assert(plugin && typeof plugin === 'object', 'plugin must be an object')

  assert(plugins && typeof plugins === 'object', 'plugins must be an object')
  const entries = Object.entries(plugins)
  assert(entries.length === 1, 'plugins must have only one entry')
  const [scope, scopedPlugin] = entries[0]
  assert(typeof scope === 'string', 'scope must be a string')
  assert(plugin === scopedPlugin, 'plugin must be the same as the scoped plugin')

  assert(recommended && typeof recommended === 'object', 'recommended must be an object')
  assert(Object.keys(recommended).every(key => typeof key === 'string' && (key.startsWith(scope) || !key.includes('/'))), 'recommended must have only scoped keys')

  return {
    name,
    plugin,
    plugins,
    recommended,
    typegen: async () => {
      const dts = await pluginsToRulesDTS({ [scope]: plugin })
      const dtsPath = `src/stubs/${name}.d.ts`
      await mkdir(path.dirname(dtsPath), { recursive: true })
      await writeFile(dtsPath, dts, 'utf-8')
    },
    flat: {
      name: `reco:${name}`,
      plugins,
      rules: recommended,
    },
  } as {
    name: string
    plugin: ESLint.Plugin
    plugins: Record<string, ESLint.Plugin>
    recommended: Linter.RulesRecord
    typegen: () => Promise<void>
    flat: {
      name: string
      plugins: Record<string, ESLint.Plugin>
      rules: Linter.RulesRecord
    }
    RuleOptions: RuleOptions
  }
}

export const pluginRegstry = {
  'eslint-plugin-n': await sugar(async () => {
    const plugin = await import('eslint-plugin-n').then(m => m.default)

    return {
      name: 'eslint-plugin-n',
      plugin,
      plugins: { n: plugin },
      recommended: plugin.configs?.recommended?.rules,
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/eslint-plugin-n').RuleOptions,
    }
  }),

  '@typescript-eslint/eslint-plugin': await sugar(async () => {
    const plugin = await import('@typescript-eslint/eslint-plugin').then(m => m.default)

    return {
      name: '@typescript-eslint/eslint-plugin',
      plugin,
      plugins: { '@typescript-eslint': plugin },
      recommended: plugin.configs?.recommended?.rules,
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/@typescript-eslint/eslint-plugin').RuleOptions,
    }
  }),

  '@next/eslint-plugin-next': await sugar(async () => {
    const plugin = await import('@next/eslint-plugin-next')
      .then(m => m.default)
      // @ts-expect-error @next/eslint-plugin-next is not compat with the new eslint
      .then(plugin => fixupPluginRules(plugin) as typeof plugin)

    const isUsingNext = await isPackageListed('next')

    return {
      name: '@next/eslint-plugin-next',
      plugin,
      plugins: { '@next/next': plugin },
      recommended: isUsingNext
        ? {
            ...plugin.configs?.recommended?.rules,
            ...plugin.configs?.['core-web-vitals']?.rules,
          }
        : {},
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/@next/eslint-plugin-next').RuleOptions,
    }
  }),

  '@eslint-react/eslint-plugin': await sugar(async () => {
    const plugin = await import('@eslint-react/eslint-plugin').then(m => m.default)

    const isUsingReact = await isPackageListed('react')

    return {
      name: '@eslint-react/eslint-plugin',
      plugin,
      plugins: { '@eslint-react': plugin },
      recommended: isUsingReact
        ? {
            ...plugin.configs?.recommended?.rules,
            ...plugin.configs?.['off-dom'].rules,
            '@eslint-react/dom/no-render-return-value': 'off',
          }
        : {},
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/@eslint-react/eslint-plugin').RuleOptions,
    }
  }),

  '@stylistic/eslint-plugin': await sugar(async () => {
    const plugin = await import('@stylistic/eslint-plugin').then(m => m.default)

    return {
      name: '@stylistic/eslint-plugin',
      plugin,
      plugins: { '@stylistic': plugin },
      recommended: plugin.configs['recommended-flat'].rules,
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/@stylistic/eslint-plugin').RuleOptions,
    }
  }),

  'eslint-plugin-react-hooks': await sugar(async () => {
    const plugin = await import('eslint-plugin-react-hooks')
      .then(m => m.default)
      // @ts-expect-error @next/eslint-plugin-react-hooks is not compat with the new eslint
      .then(plugin => fixupPluginRules(plugin) as typeof plugin)

    const isUsingReact = await isPackageListed('react')

    return {
      name: 'eslint-plugin-react-hooks',
      plugin,
      plugins: { 'react-hooks': plugin },
      recommended: isUsingReact ? plugin.configs?.recommended?.rules : {},
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/eslint-plugin-react-hooks').RuleOptions,
    }
  }),

  'eslint-plugin-unused-imports': await sugar(async () => {
    const plugin = await import('eslint-plugin-unused-imports').then(m => m.default)

    return {
      name: 'eslint-plugin-unused-imports',
      plugin,
      plugins: { 'unused-imports': plugin },
      recommended: {
        'unused-imports/no-unused-imports': 'error',
      },
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/eslint-plugin-unused-imports').RuleOptions,
    }
  }),

  'eslint-plugin-jsdoc': await sugar(async () => {
    const plugin = await import('eslint-plugin-jsdoc').then(m => m.default)

    return {
      name: 'eslint-plugin-jsdoc',
      plugin,
      plugins: { jsdoc: plugin },
      recommended: Object.fromEntries(
        Object.entries(plugin.configs['recommended-typescript'].rules ?? '')
          .filter(([key]) => !key.startsWith('jsdoc/require')),
      ),
      RuleOptions: 0 as import('@niamori/eslint-config/stubs/eslint-plugin-jsdoc').RuleOptions,
    }
  }),
}

export const reco = (name: keyof typeof pluginRegstry | '@eslint/js') => {
  if (name === '@eslint/js') {
    return {
      name: 'reco:@eslint/js',
      rules: pluginESLintJs.configs.recommended.rules,
    }
  }

  return pluginRegstry[name].flat
}

export function over(name: '@eslint/js', rules: Linter.RulesRecord): Linter.FlatConfig
export function over<Name extends keyof typeof pluginRegstry>(name: Name, rules: typeof pluginRegstry[Name]['RuleOptions']): Linter.FlatConfig
export function over(name: string, rules: Linter.RulesRecord): Linter.FlatConfig {
  if (name === '@eslint/js') {
    return {
      name: 'over:@eslint/js',
      rules,
    }
  }

  return {
    name: `over:${name}`,
    plugins: pluginRegstry[name as keyof typeof pluginRegstry].plugins,
    rules: rules as Linter.RulesRecord,
  }
}
