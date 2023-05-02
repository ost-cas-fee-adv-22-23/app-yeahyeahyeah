const nextJest = require('next/jest');

const babelConfigStyledComponents = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }, '@babel/preset-typescript']],
  plugins: ['babel-plugin-macros', ['babel-plugin-styled-components', { ssr: true }]],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    'node_modules/(.*)$': '<rootDir>/node_modules/$1',
  },
  transform: {
    '^.+\\.(js|jsx|mjs|tsx|ts)$': ['babel-jest', babelConfigStyledComponents],
  },
  transformIgnorePatterns: ['/node_modules'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],

  moduleDirectories: ['node_modules', 'src'],

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig(customJestConfig);
