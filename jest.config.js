const nextJest = require('next/jest');

const babelConfigStyledComponents = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: ['babel-plugin-macros', ['babel-plugin-styled-components', { ssr: true }]],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigStyledComponents],
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
  moduleDirectories: ['node_modules', 'src'],
};

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig(customJestConfig);
