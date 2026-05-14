module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/src/test/polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/test/__mocks__/fileMock.cjs',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(zustand|@testing-library)/)',
  ],
};
