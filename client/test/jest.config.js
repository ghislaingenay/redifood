// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  verbose: true,
  rootDir: "../",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  roots: ["<rootDir>/test"],
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["../.next/", "<rootDir>/node_modules/", "<rootDir>/test/jest.setup.ts"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/", "src"],
  testEnvironment: "jest-environment-jsdom",

  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
