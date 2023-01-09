import { clickButton, typeIntoFormAuth } from "@functions/testhelpers.fn";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "../../../src/components/auth/SignUp";

describe("Signup - Validation", () => {
  it("should render without crash", () => {
    render(<SignUp />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("input should be initially in the document", () => {
    render(<SignUp />);
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("input fields should be empty when rendered", () => {
    render(<SignUp />);
    expect(
      screen.getByRole("textbox", {
        name: /username/i,
      }).ariaValueText,
    ).toBe(undefined);
    expect(screen.getByLabelText("Password").ariaValueText).toBe(undefined);
    expect(screen.getByLabelText(/confirm password/i).ariaValueText).toBe(undefined);
  });
  it("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: undefined,
      confirmPassword: "pit",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toBe(undefined);
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show password and username missing if no fields are filled before submit", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
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
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show error message when username is empty", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: "pit",
      confirmPassword: "pit",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(passwordElement).toHaveValue("pit");
    expect(confirmPasswordElement).toHaveValue("pit");
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
  });

  it.todo("should show error message when confirm password is empty", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "pit",
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toBe("pit");
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/Password don't match/i)).toBeInTheDocument();
  });

  it("should show error when username contains special characters except ._", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/username can only contain letters, dot and underscore/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test*&",
      password: "pit",
      confirmPassword: "pit",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test*&");
    expect(passwordElement).toHaveValue("pit");
    expect(confirmPasswordElement).toHaveValue("pit");
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/username can only contain letters, dot and underscore/i)).toBeInTheDocument();
    await user.clear(usernameElement);
    await user.type(usernameElement, "test_");
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test_");
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
    expect(await screen.findByText(/username can only contain letters, dot and underscore/i)).not.toBeInTheDocument();
  });

  it("display error when password contains less than 8 characters and more than 20 characters", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password too long/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password too short/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "1234567891011121314151617181920",
      confirmPassword: "1234567891011121314151617181920",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password too long/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "12345");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "12345");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/password too long/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/password too short/i)).toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    await user.clear(passwordElement);
    await user.type(passwordElement, "123456789");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "123456789");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/password too short/i)).not.toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
  });
  it("display error when username contains less than 4 characters and more than 12 characters", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/username too long/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/username too short/i)).not.toBeInTheDocument();
    const { usernameElement } = await typeIntoFormAuth(user, {
      username: "teshbsfhbsbsjfbsjfbsjffssfdsfdf",
      password: "H-àbhbhbBJNJ*",
      confirmPassword: "H-àbhbhbBJNJ*",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/username too long/i)).toBeInTheDocument();
    await user.clear(usernameElement);
    await user.type(usernameElement, "te");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/username too long/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/username too short/i)).toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    await user.clear(usernameElement);
    await user.type(usernameElement, "test_");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/username too short/i)).not.toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
  });

  it("display error when password don't contain  at least one lowercase letter", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password must contain at least one lowercase letter/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTUBV9*H_",
      confirmPassword: "FHTUBV9*H_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
    await user.clear(passwordElement);

    await user.type(passwordElement, "fhtubv9*H_");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "fhtubv9*H_");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/password must contain at least one lowercase letter/i)).not.toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
  });

  it("display error when password don't contain at least one uppercase letter", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "fhtubv9*a_",
      confirmPassword: "fhtubv9*a_",
    });
    await clickButton(/submit/i, user);
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHtuBV9*h_");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "FHtuBV9*h_");
    await clickButton(/submit/i, user);
    expect(await screen.queryByText(/password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
  });

  it("display error when password don't contain at least one special characters", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password must contain at least one special character/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTUvn9H",
      confirmPassword: "FHTUvn9H",
    });
    await clickButton(/submit/i, user);
    expect(await screen.getAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password must contain at least one special character/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.queryByText(/password must contain at least one special character/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(0);
  });
  it("display error when password don't contain at least one number", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password must contain at least one number/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTUvgjnH*",
      confirmPassword: "FHTUvgjnH*",
    });
    await clickButton(/submit/i, user);
    expect(await screen.getAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password must contain at least one number/i)).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.queryByText(/password must contain at least one number/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(0);
  });
  it("show error if the password and confirm password don't match", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(screen.queryByText(/password and confirm password must match/i)).not.toBeInTheDocument();
    const { confirmPasswordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9Hbhb_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/password and confirm password must match/i)).toBeInTheDocument();
    await user.clear(confirmPasswordElement);
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    expect(await screen.queryByText(/password and confirm password must match/i)).not.toBeInTheDocument();
    expect(await screen.findAllByRole("alert")).toHaveLength(0);
  });

  // it.todo("show not invalid credentials if signup with user already in db");
  it("should have invalid credentials msg if username already exists", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: "test",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.queryByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it("should send success if user properly created", async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    expect(await screen.findByText(/Account succesfully created/i)).toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: "test",
      password: "FHtuBV9*h_",
      confirmPassword: "FHtuBV9*h_",
    });
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.queryByText(/Account succesfully created/i)).toBeInTheDocument();
  });
});
