const nextJest = require('next/jest');

const babelConfigStyledComponents = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }, '@babel/preset-typescript']],
  plugins: ['babel-plugin-twin', 'babel-plugin-macros', ['babel-plugin-styled-components', { ssr: true }]],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': 'src/**/$1',
    '^node_modules/(.*)$': '<rootDir>/node_modules/$1',
  },
  transform: {
    '^.+\\.(js|jsx|mjs|tsx|ts)$': ['babel-jest', babelConfigStyledComponents],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/node_modules/(?!(@smartive-education/design-system-component-library-yeahyeahyeah)/)',
  ],
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  paths: {
    '@/*': '<rootDir>/src/*',
    '@smartive-education/design-system-component-library-yeahyeahyeah':
      '<rootDir>/node_modules/@smartive-education/design-system-component-library-yeahyeahyeah',
  },
  modulePaths: ['<rootDir>', '<rootDir>/node_modules/@smartive-education/design-system-component-library-yeahyeahyeah'],
  moduleDirectories: ['node_modules'],
  rootDir: '.',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig(customJestConfig);
