import { afterAll, jest } from "@jest/globals";
import dotenv from "dotenv";
import "isomorphic-unfetch";
import JestMock from "jest-mock";
import nock from "nock";

dotenv.config({ path: ".env.test" });

afterAll(() => {
    nock.cleanAll();
    nock.restore();
});

window.matchMedia = jest.fn().mockImplementation((query) => {
    return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
}) as JestMock.Mock<MediaQueryList, [string]>;

window.scroll = jest.fn() as JestMock.Mock<any>;
window.alert = jest.fn();
