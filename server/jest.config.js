module.exports = {
  verbose: true,
  roots: ['<rootDir>'],
  collectCoverageFrom: ['<rootDir>src/**/*.js'],
  setupFiles: ['<rootDir>config/setupTests.js'],
  testMatch: ['<rootDir>src/**/?(*.)spec.js'],
  testEnvironment: 'node',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.js$'],
  moduleFileExtensions: ['js', 'json', 'node']
};

