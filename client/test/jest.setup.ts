import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import JestMock from "jest-mock";
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

  // global.console = {
  //   warn: jest.fn(),
  // } as any;

  window.scroll = jest.fn() as JestMock.Mock<any>;
  window.alert = jest.fn();
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
