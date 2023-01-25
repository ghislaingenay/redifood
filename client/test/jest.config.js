// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
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
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/auth/$1",
    "^@components": "<rootDir>/src/components/index",
    "^@public/(.*)$": "<rootDir>/public/$1",
    "^@public": "<rootDir>/public",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@constants": "<rootDir>src/constants/index",
    "^@interfaces": "<rootDir>src/interfaces/index",
    "^@styles/(.*)$": "<rootDir>src/styles/$1",
    "^@styles": "<rootDir>src/styles/index",
    "^@functions/(.*)$": "<rootDir>/src/functions/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@test": "<rootDir>/test/index",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
