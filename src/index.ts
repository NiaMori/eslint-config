import { GLOB_EXCLUDE, GLOB_JS, GLOB_TS, GLOB_TSX } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import gitignore from 'eslint-config-flat-gitignore'
import parserTypeScript from '@typescript-eslint/parser'
import { reco, over, disb } from '@niamori/eslint-config/plugins'
import globals from 'globals'
import { match } from 'ts-pattern'

function igno(ignores: string[], name: string = 'mannual') {
  return {
    ignores,
    name: `igno:${name}`,
  }
}

function pars(target: 'ts' | 'tsx', languageOptions: Linter.Config['languageOptions']): Linter.Config {
  return {
    name: `pars:${target}`,
    files: match(target)
      .with('ts', () => [GLOB_TS])
      .with('tsx', () => [GLOB_TSX]).exhaustive(),
    languageOptions,
  }
}

export function configESLint(fn: (props: {
  reco: typeof reco
  over: typeof over
  igno: typeof igno
  disb: typeof disb
}) => Linter.Config[]): Linter.Config[] {
  return [
    ...pleaseConfigESLintForMe(),
    ...fn({ reco, over, igno, disb }),
  ]
}

export function pleaseConfigESLintForMe(): Linter.Config[] {
  return [
    igno(GLOB_EXCLUDE, 'exclude'),
    igno(gitignore().ignores, 'gitignore'),
    igno([GLOB_JS], 'js'),

    pars('ts', {
      parser: parserTypeScript,
      globals: {
        ...globals.es2021,
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsConfigRootDir: process.cwd(),
      },
    }),
    pars('tsx', {
      parser: parserTypeScript,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsConfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true,
        },
      },
    }),

    reco('@eslint/js'),
    over('@eslint/js', {
      'curly': ['error', 'all'],
      'no-redeclare': 'off',
    }),

    reco('@typescript-eslint/eslint-plugin'),
    over('@typescript-eslint/eslint-plugin', {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    }),

    reco('eslint-plugin-n'),
    over('eslint-plugin-n', {
      'n/prefer-global/process': ['error', 'always'],
      'n/prefer-global/buffer': ['error', 'always'],
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': ['warn', {
        allowExperimental: true,
      }],
    }),

    reco('eslint-plugin-unused-imports'),

    reco('@next/eslint-plugin-next'),

    reco('@eslint-react/eslint-plugin'),
    over('@eslint-react/eslint-plugin', {
      '@eslint-react/no-leaked-conditional-rendering': 'error',
    }),

    reco('eslint-plugin-react-hooks'),

    reco('eslint-plugin-jsdoc'),

    reco('@stylistic/eslint-plugin'),
    over('@stylistic/eslint-plugin', {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-equals-spacing': ['error', 'always'],
      '@stylistic/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: true }],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true, reservedFirst: true }],
      '@stylistic/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      '@stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
    }),
  ]
}
