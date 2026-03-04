const base = require('./base');

module.exports = [
  ...base,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
