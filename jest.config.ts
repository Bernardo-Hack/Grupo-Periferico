import type { Config } from 'jest';
import { defaults } from 'ts-jest/presets';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',  // ou 'jsdom' se frontend
  transform: {
    ...defaults.transform,
  },
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],  // para ts e tsx
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
