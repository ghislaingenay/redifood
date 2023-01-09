import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SignUp from "../../../src/components/auth/SignUp";

describe("Signup - Validation", () => {
  it("should render without crash", () => {
    render(<SignUp />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
  it.todo("input fields should be empty when rendered");
  it.todo("should show error message when password is empty");
  it.todo("should show error message when confirm password is empty");
  it.todo("should show error message when username is empty");
  it.todo(
    "should show error when username contains special characters except ._",
  );
  it.todo(
    "display error when password don't contain  more than 8 characters and less than 20 characters",
  );
  it.todo(
    "display error when password don't contain  at least one lowercase letter",
  );
  it.todo(
    "display error when password don't contain at least one uppercase letter",
  );
  it.todo(
    "display error when password don't contain at least one special characters",
  );

  // it.todo("show not invalid credentials if signup with user already in db");
  it.todo(
    "should send username already taken message if username already exists",
  );
  it.todo("should send success if user properly created");
});

describe("Auth", () => {
  it.todo("show display signup section when signup page is clicked");
  it.todo("Should show login if user click on SignUp and then click on Login");
  it.todo(
    "Should not able to switch between login and signup if user submit the form",
  );
  it.todo("show already user message if user login with existing credentials");
});
