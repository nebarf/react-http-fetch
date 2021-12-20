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
