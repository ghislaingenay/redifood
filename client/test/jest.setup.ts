import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import jestFetchMock from "jest-fetch-mock";
import JestMock from "jest-mock";
import "next-router-mock";
import { server } from "./mocks/server";

beforeAll(() => {
  jest.setTimeout(60000);

  window.matchMedia = jest.fn().mockImplementation((query) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
  window.scroll = jest.fn() as JestMock.Mock<any>;
  window.alert = jest.fn();
  server.listen();
});

beforeEach(() => {
  jest.resetModules();
  jest.setTimeout(50000);
  jestFetchMock.enableMocks();
  jest.mock("next/navigation", () => require("next-router-mock"));
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
