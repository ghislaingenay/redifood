import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "src/components/Auth";
import { clickButton, typeIntoFormAuth } from "../../../src/functions/testhelpers.fn";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.setTimeout(30000);

describe("Signup - Validation", () => {
  it("input should be initially in the document", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it("input fields should be empty, enabled and required when rendered", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.queryByLabelText(/confirm/i);
    expect(usernameInput.ariaValueText).toEqual(undefined);
    expect(passwordInput.ariaValueText).toEqual(undefined);
    expect(confirmPasswordInput.ariaValueText).toEqual(undefined);
    expect(usernameInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(usernameInput).toHaveClass("ant-input");
    expect(usernameInput).toBeEnabled();
    expect(passwordInput).toBeEnabled();
    expect(confirmPasswordInput).toBeEnabled();
  });

  it("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));

    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: undefined,
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toBe(undefined);
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
    expect(await screen.findByText(/please confirm your password/i)).toBeInTheDocument();
  });

  it("should show password and username missing if no fields are filled before submit", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));

    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: undefined,
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(passwordElement).toBe(undefined);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show error message when username is empty", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();

    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    const { usernameElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
  });

  it("should show error message when confirm password is empty", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();

    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTU*vn9H_",
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("should show error when username contains special characters except ._", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();

    expect(screen.queryByText(/username can only contain letters, dot and underscore/i)).not.toBeInTheDocument();
    const { usernameElement } = await typeIntoFormAuth(user, {
      username: "test*&",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test*&");
    expect(
      await screen.findByText(/username can only contain letters, numbers, dot, hyphens and underscore/i),
    ).toBeInTheDocument();
  });

  it("display error when password contains more than 20 characters", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();

    expect(screen.queryByText(/password should contains between 8 to 20 characters/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: "test",
      password: "Hf*1234567891011121314151617181920",
      confirmPassword: "Hf*1234567891011121314151617181920",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/password should contains between 8 to 20 characters/i)).toBeInTheDocument();
  });

  it("display error when password contains less than 8 characters", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/password should contains between 8 to 20 characters/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test1",
      password: "Hf*1h_",
      confirmPassword: "Hf*1h_",
    });
    await clickButton(/submit/i, user);
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(await screen.findByText(/password should contains between 8 to 20 characters/i)).toBeInTheDocument();
    await user.clear(confirmPasswordElement);
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    console.log("data", passwordElement, confirmPasswordElement);
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/password should contains between 8 to 20 characters/i)).toBe(null);
    });
  });

  it("display error when username contains less than 4 characters and more than 12 characters", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/username should contains between 4 to 12 characters/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: "teshbsfhbsbsjfbsjfbsjffssfdsfdf",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/username should contains between 4 to 12 characters/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
      "te",
    );
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/username should contains between 4 to 12 characters/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
      "test_",
    );
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/username should contains between 4 to 12 characters/i)).toBe(null);
      expect(screen.queryByText(/please input your username/i)).toBe(null);
    });
  });

  it("display error when password don't contain  at least one lowercase letter", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/password must contain at least one lowercase letter/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test12",
      password: "FHTUBV9*H_",
      confirmPassword: "FHTUBV9*H_",
    });
    await clickButton(/submit/i, user);
    await user.clear(screen.getByLabelText(/confirm/i));
    expect(await screen.findByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Password"));
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    await waitFor(async () => {
      expect(screen.queryByText(/password must contain at least one lowercase letter/i)).toBe(null);
    });
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
  });

  it("display error when password don't contain at least one uppercase letter", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test1",
      password: "fhtubv9*a_",
      confirmPassword: "fhtubv9*a_",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(await screen.findByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(async () => {
      expect(screen.queryByText(/password must contain at least one uppercase letter/i)).toBe(null);
    });
  });

  it("display error when password don't contain at least one special characters", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/password must contain at least one special character/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test1",
      password: "FHTUvn9H",
      confirmPassword: "FHTUvn9H",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(await screen.findByText(/password must contain at least one special character/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(async () => {
      expect(screen.queryByText(/password must contain at least one special character/i)).toBe(null);
    });
  });

  it("display error when password don't contain at least one number", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();

    expect(screen.queryByText(/password must contain at least one number/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test1",
      password: "FHTUvgjnH*",
      confirmPassword: "FHTUvgjnH*",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(await screen.findByText(/password must contain at least one number/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/password must contain at least one number/i)).toEqual(null);
    });
  });

  it("show error if the password and confirm password don't match", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByText(/Invalid credentials/i)).toEqual(null);
    expect(screen.queryByText(/password and confirm password must match/i)).toEqual(null);
    const { confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9Hbhb_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).toBe(null);
    });
  });
});

describe("Signup - Integration", () => {
  it("should have invalid credentials msg if username already exists", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole(/Invalid credentials/i)).toEqual(null);
    await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Invalid credentials/i })).toBeInTheDocument();
  });

  it("should send success if user properly created", async () => {
    render(<Auth />);
    await fireEvent.click(screen.getByLabelText("Register"));
    const user = userEvent.setup();
    expect(screen.queryByRole(/Account succesfully created/i)).toEqual(null);
    await typeIntoFormAuth(user, {
      username: "test12",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
  });
});
