import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "../../../src/components/Auth";
import { clickButton, typeIntoFormAuth } from "../../../src/functions/testhelpers.fn";
jest.mock("next/navigation", () => require("next-router-mock"));
jest.setTimeout(40000);

export const emailValid = "test@test.com";
export const emailNotIdentical = "testaaa@test.com";
export const passwordValid = "FHTU*vn9H_";
export const passwordNotIdentical = "FU*vn9dvdq_";
export const emailIncorrect = "testte@a.com";

describe("Login - Validation", () => {
  it("input should be initially in the document", () => {
    render(<Auth />);
    expect(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("input fields should be empty, required, not disabled when rendered", () => {
    render(<Auth />);
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const passwordInput = screen.getByLabelText("Password");
    expect(emailInput.ariaValueText).toBe(undefined);
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveClass("ant-input");
    expect(emailInput).toBeEnabled();
    expect(screen.getByRole("button", { name: /forgot password/i })).toBeEnabled();
    expect(passwordInput.ariaValueText).toBe(undefined);
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toBeEnabled();
  });

  it("should show error message when password is empty", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { emailElement, passwordElement } = await typeIntoFormAuth(user, {
      email: emailValid,
      password: undefined,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toHaveValue(emailValid);
    expect(passwordElement).toBe(undefined);
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show error message when email is empty", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    expect(screen.queryByText(/Please input your email/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      email: undefined,
      password: passwordValid,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
  });

  it("should show error message when email and password are empty", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    expect(screen.queryByText(/Please input your email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      email: undefined,
      password: undefined,
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("user clicked several times on email", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    );
    expect(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    ).toHaveFocus();
    expect(screen.queryByText(/Please input your email/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      email: undefined,
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    );
    const { emailElement } = await typeIntoFormAuth(user, {
      email: "test",
      password: "",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toHaveValue("test");
    await waitFor(() => {
      expect(screen.queryByText(/please input your email/i)).toBe(null);
    });
  });
});

describe("Login - Integration", () => {
  it.skip("should indicate success when email and password match", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    const { emailElement, passwordElement } = await typeIntoFormAuth(user, {
      email: emailValid,
      password: passwordValid,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toHaveValue(emailValid);
    expect(passwordElement).toHaveValue(passwordValid);
    expect(await screen.findByRole("button", { name: /Submit/i })).toBeDisabled();
    // expect(await screen.findByText(/Succesfully logged in !/i)).toBeInTheDocument();
  });

  it.skip("should show invalid credentials when password doesn't match", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await typeIntoFormAuth(user, {
      email: emailValid,
      password: passwordNotIdentical,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    // expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it.skip("should show invalid credentials when email doesn't match", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await typeIntoFormAuth(user, {
      email: emailNotIdentical,
      password: passwordValid,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    // expect(await screen.findByText(/Invalid Credentials/i)).toBeInTheDocument();
  });

  it.skip("should show invalid credentials when password and email doesn't match", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await typeIntoFormAuth(user, {
      email: emailNotIdentical,
      password: passwordNotIdentical,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    await waitFor(() => {
      // expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    });
    await user.clear(screen.getByLabelText("Password"));
    await typeIntoFormAuth(user, {
      password: passwordValid,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    // expect(await screen.findByText(/Succesfully logged in !/i)).toBeInTheDocument();
  });
});
