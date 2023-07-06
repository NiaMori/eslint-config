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
    'react/jsx-space-before-closing': ['error', 'always'],
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],

    'react/destructuring-assignment': ['error', 'always'],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
  },
}
