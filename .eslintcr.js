module.exports = {
      root: true,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'prettier/prettier': ['error', {
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
        }],
      },
    };
    