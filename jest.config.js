module.exports = {
  preset: `ts-jest/presets/default-esm`,
  testEnvironment: `node`,
  roots: [`<rootDir>/src`],
  collectCoverage: true,
  collectCoverageFrom: [`**/*.ts`],
}
