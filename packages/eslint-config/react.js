const base = require('./base');

module.exports = [
  ...base,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
