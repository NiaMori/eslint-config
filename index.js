const { antfu, pluginAntfu, pluginJsonc, pluginNode, pluginStylistic, pluginTs } = require('@antfu/eslint-config')

module.exports.pleaseConfigESLintForMe = () => {
  /**
   * @type {import('@antfu/eslint-config').OptionsConfig}
   */
  const antfuOptions = {
    stylistic: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
  }

  const antfuConfigs = antfu(antfuOptions)

  /**
   * @type {import('@antfu/eslint-config').ConfigItem[]}
   */
  const myConfigs = [
    {
      ignores: ['eslint.config.js'],
    },

    {
      name: 'niamori:preferences:stylistic',

      plugins: {
        antfu: pluginAntfu,
        stylistic: pluginStylistic,
      },

      rules: {
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

    {
      name: 'niamori:preferences:typescript',

      files: ['**/*.?([cm])[jt]s?(x)'],

      plugins: {
        ts: pluginTs,
      },

      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': 'off',
      },
    },

    {
      name: 'niamori:preferences:typescript:javascript-overrides',

      files: ['**/*.js', '**/*.cjs'],

      plugins: {
        ts: pluginTs,
      },

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
      name: 'niamori:preferences:tsconfgi',

      files: ['tsconfig.json'],

      plugins: {
        jsonc: pluginJsonc,
      },

      rules: {
        'jsonc/sort-keys': 'off',
      },
    },
  ]

  return [...antfuConfigs, ...myConfigs]
}
