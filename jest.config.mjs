export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      isolatedModule: true,
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    '<rootDir>/ts/**/*.[jt]s'
  ],
  roots: [
    '<rootDir>/ts',
  ],
  transform: {
    // '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    // '^.+\\.(ts|tsx|mts|cts)$': ['ts-jest', {
    //   isolatedModules: true,
    //   useESM: true,
    // }]
  },
  // transformIgnorePatterns: [
  //   // Need to MANUALLY identify each ESM package, one by one
  //   'node_modules/(?!(chalk)/)'
  // ],
  testMatch: ['**/?(*.)+(spec|test|integrate|accept|system|unit).[jt]s?(x)'],
  watchPlugins: [
    'jest-watch-suspend',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' },
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' },
    ],
  ],
}
