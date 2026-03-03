const base = require('@opendevelopment/eslint-config/base');

module.exports = [
  ...base,
  {
    ignores: ['eslint.config.js', 'commitlint.config.js'],
  },
];
