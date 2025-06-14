import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  
  // Configura caminhos base
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  
  // Mapeamento de módulos
  moduleNameMapper: {
    '^@frontend/(.*)$': '<rootDir>/src/frontend/$1',
    '^@backend/(.*)$': '<rootDir>/src/backend/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/backend/server.ts', // Exclui ponto de entrada
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  
  // Ambiente padrão (pode ser sobrescrito por arquivo)
  testEnvironment: 'node',
};

export default config;