import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../src/components/auth/Login";
import { clickButton, typeIntoFormAuth } from "./helpers.fn";

describe("Login", () => {
  it("should render without crash", () => {
    render(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("input should be initially in the document", () => {
    render(<Login />);
    expect(
      screen.getByRole("textbox", { name: /username/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("input fields should be empty when rendered", () => {
    render(<Login />);
    expect(
      screen.getByRole("textbox", {
        name: /username/i,
      }).ariaValueText,
    ).toBe(undefined);
    expect(screen.getByLabelText(/password/i).ariaValueText).toBe(undefined);
  });

  it("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(
      screen.queryByText(/Please input your password/i),
    ).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: undefined,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(
      await screen.findByText(/please input your password/i),
    ).toBeInTheDocument();
  });

  it("should show error message when username is empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(
      screen.queryByText(/Please input your username/i),
    ).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(passwordElement).toHaveValue("pit");
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(
      await screen.findByText(/please input your username/i),
    ).toBeInTheDocument();
  });

  it("should show error message when username and password are empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(
      screen.queryByText(/Please input your username/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Please input your password/i),
    ).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: undefined,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(passwordElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(
      await screen.findByText(/please input your username/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please input your password/i),
    ).toBeInTheDocument();
  });

  it("user clicked several times on username", async () => {
    render(<Login />);
    const user = userEvent.setup();

    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    await user.click(usernameInput);
    expect(usernameInput).toHaveFocus();
    expect(
      screen.queryByText(/Please input your username/i),
    ).not.toBeInTheDocument();
    const { usernameElement } = await typeIntoFormAuth(user, {
      username: undefined,
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(
      await screen.findByText(/please input your username/i),
    ).toBeInTheDocument();
    await user.clear(usernameInput);
    const { usernameElement: usernameElement2 } = await typeIntoFormAuth(user, {
      username: "test",
      password: "",
      confirmPassword: "",
    });

    await clickButton(/submit/i, user);
    expect(usernameElement2).toHaveValue("test");
    await waitFor(async () => {
      expect(
        await screen.queryByText(/please input your username/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should indicate success when username and password match", async () => {
    const user = userEvent.setup();
    render(<Login />);
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);

    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toHaveValue("pit");
    expect(await screen.findByText(/status: 201/i)).toBeInTheDocument();
    expect(await screen.findByText(/Success/i)).toBeInTheDocument();
  });

  it("should show invalid password when password doesn't match", async () => {
    const user = userEvent.setup();
    render(<Login />);
    await typeIntoFormAuth(user, {
      username: "test",
      password: "pith",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/error password/i)).toBeInTheDocument();
  });
  it("should show invalid password when username doesn't match", async () => {
    const user = userEvent.setup();
    render(<Login />);
    await typeIntoFormAuth(user, {
      username: "testa",
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/error username/i)).toBeInTheDocument();
  });
});

describe("Signup", () => {
  // it("should render without crash", () => {
  //   render(<SignUp />);
  //   expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  // });
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
  it.todo(
    "should show invalid credentials error message if username already exists",
  );
});

describe("Auth", () => {
  it.todo("show display signup section when signup page is clicked");
  it.todo("Should show login if user click on SignUp and then click on Login");
  it.todo(
    "Should not able to switch between login and signup if user submit the form",
  );
  it.todo("show already user message if user login with existing credentials");
  it.todo("show not invalid credentials if signup with user already in db");
});
