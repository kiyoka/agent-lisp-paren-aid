/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Ignore compiled JavaScript test files under dist to avoid double-running of
  // transpiled test artifacts that may be out-of-date.
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
};
