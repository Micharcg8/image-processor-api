module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: './src',
      moduleFileExtensions: ['js', 'json', 'ts'],
      testRegex: '.*\\.spec\\.ts$',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      collectCoverageFrom: ['**/*.(t|j)s'],
      coverageDirectory: '../coverage',
      testTimeout: 10000,
    };