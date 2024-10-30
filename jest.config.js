// jest.config.js
module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(png|jpg|jpeg|gif)$': '<rootDir>/tests/__mocks__/fileMock.js',
    },
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.js',
    ],
    coverageReporters: ['text', 'lcov'],
  };
  