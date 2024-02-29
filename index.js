import fs from 'node:fs'
import antfu from '@antfu/eslint-config'
import { boolean, object } from 'zod'
import { isPackageExists } from 'local-pkg'

import pluginJsonc from 'eslint-plugin-jsonc'

// @ts-expect-error eslint-plugin-n doesn't have types
import pluginNode from 'eslint-plugin-n'

/**
 * @type {() => Promise<import('@antfu/eslint-config').FlatConfigItem[]>}
 */
async function reactConfigs() {
  const isAllowConstantExport = ['vite'].some(i => isPackageExists(i))

  // @ts-expect-error eslint-plugin-react doesn't have types
  const pluginReact = await import('eslint-plugin-react').then(it => it.default || it)
  // @ts-expect-error eslint-plugin-react-hooks doesn't have types
  const pluginReactHooks = await import('eslint-plugin-react-hooks').then(it => it.default || it)
  // @ts-expect-error eslint-plugin-react-refresh doesn't have types
  const pluginReactRefresh = await import('eslint-plugin-react-refresh').then(it => it.default || it)

  return [
    {
      name: 'niamori:react:setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['**/*.?([cm])jsx', '**/*.?([cm])tsx'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'niamori:react:rules',
      rules: {
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        // react refresh
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: isAllowConstantExport },
        ],

        // recommended rules react
        'react/display-name': 'error',
        'react/jsx-key': 'error',
        'react/jsx-no-comment-textnodes': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': 'off',
        'react/prop-types': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/require-render-return': 'error',

        // disable following rules for typescript
        'react/jsx-no-undef': 'off',
        'react/prop-type': 'off',
      },
    },
  ]
}

export async function pleaseConfigESLintForMe() {
  /**
   * @type {import('@antfu/eslint-config').OptionsConfig}
   */
  const antfuOptions = {
    stylistic: {
      overrides: {
        'antfu/top-level-function': 'off',

        'curly': ['error', 'all'],

        'style/brace-style': ['error', '1tbs'],

        'style/jsx-quotes': ['error', 'prefer-single'],
        'style/jsx-closing-bracket-location': ['error', 'line-aligned'],
        'style/jsx-closing-tag-location': 'error',
        'style/jsx-equals-spacing': ['error', 'always'],
        'style/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: true }],
        'style/jsx-indent-props': ['error', 2],
        'style/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true, reservedFirst: true }],
        'style/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
        'style/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      },
    },

    typescript: {
      tsconfigPath: 'tsconfig.json',
      overrides: {
        'ts/no-require-imports': 'off',
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': 'off',
      },
    },
  }

  const antfuConfigs = await antfu(antfuOptions)

  /**
   * @type {import('@antfu/eslint-config').FlatConfigItem[]}
   */
  const myConfigs = []

  const tsconfig = object({
    compilerOptions: object({
      allowJs: boolean().default(false),
    }).optional(),
  }).parse(JSON.parse(await fs.promises.readFile('tsconfig.json', 'utf8')))

  if (!tsconfig?.compilerOptions?.allowJs) {
    myConfigs.push({
      ignores: ['**/*.js', '**/*.cjs'],
    })
  }

  if (isPackageExists('react')) {
    myConfigs.push(...await reactConfigs())
  }

  myConfigs.push(
    {
      name: 'niamori:preferences:typescript:javascript-overrides',

      files: ['**/*.js', '**/*.cjs'],

      rules: {
        'ts/no-unsafe-assignment': 'off',
      },
    },

    {
      name: 'niamori:preferences:node',

      plugins: {
        node: pluginNode,
      },

      rules: {
        'node/prefer-global/buffer': ['error', 'always'],
        'node/prefer-global/process': ['error', 'always'],
      },
    },

    {
      name: 'niamori:preferences:tsconfig',

      files: ['tsconfig.json'],

      plugins: {
        jsonc: pluginJsonc,
      },

      rules: {
        'jsonc/sort-keys': 'off',
      },
    },
  )

  return [...antfuConfigs, ...myConfigs]
}
