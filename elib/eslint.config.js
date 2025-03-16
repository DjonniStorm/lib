import perfectionistPlugin from 'eslint-plugin-perfectionist';
import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import jsPlugin from '@eslint/js';
import globals from 'globals';

export default [
  jsPlugin.configs.recommended,
  perfectionistPlugin.configs['recommended-line-length'],
  {
    rules: {
      'stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', next: 'block-like', prev: '*' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'always', next: 'export', prev: '*' },
        { prev: 'singleline-const', blankLine: 'always', next: '*' },
        { prev: 'singleline-let', blankLine: 'always', next: '*' },
        { next: 'singleline-const', blankLine: 'always', prev: '*' },
        { next: 'singleline-let', blankLine: 'always', prev: '*' },
        { prev: 'singleline-let', next: 'singleline-let', blankLine: 'any' },
        {
          prev: 'singleline-const',
          next: 'singleline-const',
          blankLine: 'any',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          jsxSingleQuote: false,
          endOfLine: 'auto',
          singleQuote: true,
        },
      ],
      'no-promise-executor-return': 'error',
      'array-callback-return': 'error',
      'no-unused-expressions': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': 'error',
      'consistent-return': 'error',
      'arrow-body-style': 'error',
      'object-shorthand': 'error',
      'no-return-assign': 'error',
      'no-await-in-loop': 'error',
      'no-throw-literal': 'error',
      'no-extend-native': 'error',
      'no-return-await': 'error',
      'prefer-template': 'error',
      'no-else-return': 'error',
      'accessor-pairs': 'error',
      'no-lone-blocks': 'error',
      'require-await': 'error',
      'prefer-const': 'error',
      'dot-notation': 'error',
      'no-multi-str': 'error',
      'camelcase': 'error',
      'no-proto': 'error',
      'curly': 'error',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
        ...globals.jest,
      },
    },
    plugins: {
      stylistic: stylisticJsPlugin,
      prettier: prettierPlugin,
    },
    files: ['**/*.{js,ts}'],
  },
  {
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    files: ['**/*.ts'],
  },
  {
    ignores: ['node_modules', 'vite.config.js', 'dist'],
  },
];
