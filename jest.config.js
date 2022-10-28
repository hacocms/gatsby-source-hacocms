module.exports = {
  preset: `ts-jest/presets/default`,
  testEnvironment: `node`,
  roots: [`<rootDir>/src`],
  collectCoverage: true,
  collectCoverageFrom: [`**/*.ts`],
}
