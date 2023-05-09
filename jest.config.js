const nextJest = require('next/jest');

const babelConfigStyledComponents = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: ['babel-plugin-macros', ['babel-plugin-styled-components', { ssr: true }]],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigStyledComponents],
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!(@smartive-education/design-system-component-library-yeahyeahyeah)/)'],
};

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig(customJestConfig);
