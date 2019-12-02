module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom-global',
};
