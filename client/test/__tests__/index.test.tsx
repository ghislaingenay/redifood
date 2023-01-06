import "@testing-library/jest-dom";
import {
  render,
  screen,
} from "@testing-library/react";
import Home from "../../pages/index";

describe("index", () => {
  it("should render without crash", () => {
    render(<Home />);
    expect(
      screen.getByText("Welcome to"),
    ).toBeInTheDocument();
  });
});
