module.exports =  {
  testRegex: "\\.spec\\.ts$",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.ispec.ts"
  ],
  coverageReporters: [
    "json",
    "lcov",
    "text-summary"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
