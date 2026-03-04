const react = require('./react');
const nextPlugin = require('@next/eslint-plugin-next');

module.exports = [
  ...react,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Disable rules that crash with ESLint 9 flat config + App Router
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-head-element': 'off',
    },
  },
];
