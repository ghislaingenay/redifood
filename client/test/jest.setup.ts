import "@testing-library/jest-dom/extend-expect";
import JestMock from "jest-mock";

// Mocks
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
