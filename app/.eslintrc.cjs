const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: path.join(path.dirname(__filename), 'tsconfig.json'),
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'unused-imports',
    'simple-import-sort',
    'import',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'import/extensions': 0,
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'max-len': [
      'error',
      {
        code: 80,
        comments: 160,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
