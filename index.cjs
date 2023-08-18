require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    '@antfu/eslint-config-react',
  ],

  rules: {
    'curly': ['error', 'all'],

    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', '1tbs'],

    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-equals-spacing': ['error', 'always'],
    'react/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: true }],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true, reservedFirst: true }],
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],

    'react/destructuring-assignment': ['error', 'always'],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],

    /**
     * many dual packages now has [Masquerading as CJS](https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseCJS.md) issues
     * we have to use `import foo = require('bar')` to use the cjs version as a workaround
     */
    '@typescript-eslint/no-require-imports': 'off',

    'n/prefer-global/process': 'off',
  },
}
