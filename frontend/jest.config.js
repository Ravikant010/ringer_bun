export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: [
        '<rootDir>/src/**/test/**/*.ts?(x)',
        '<rootDir>/src/**/?(*.)+(spec|test).ts?(x)',
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },

  };