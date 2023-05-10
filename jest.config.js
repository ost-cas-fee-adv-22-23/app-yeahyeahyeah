const nextJest = require('next/jest');

const babelConfigStyledComponents = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: ['babel-plugin-macros', ['babel-plugin-styled-components', { ssr: true }]],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@smartive-education/design-system-component-library-yeahyeahyeah':
      '<rootDir>/node_modules/@smartive-education/design-system-component-library-yeahyeahyeah/dist/index.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigStyledComponents],
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

const createJestConfig = nextJest({ dir: './' });

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: [
    'node_modules/(?!(@smartive-education/design-system-component-library-yeahyeahyeah)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
});
