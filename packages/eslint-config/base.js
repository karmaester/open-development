const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.turbo/', 'coverage/'],
  },
];
