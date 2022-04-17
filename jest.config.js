module.exports = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: ['./setup-jest.ts'],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `spec`.
  testRegex: '/__tests__/.*.spec.(ts|tsx)?$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testEnvironment: 'jsdom',
};

if (process.env.REACT_VERSION === 'v17') {
  module.exports.cacheDirectory = '.cache/jest-cache-react-17';
  module.exports.moduleNameMapper = {
    ...module.exports.moduleNameMapper,
    '^react-dom((\\/.*)?)$': 'react-dom-17$1',
    '^react((\\/.*)?)$': 'react-17$1',
  };
}
