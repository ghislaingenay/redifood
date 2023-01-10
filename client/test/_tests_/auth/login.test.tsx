import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../src/components/auth/Login";
import { clickButton, typeIntoFormAuth } from "../../../src/functions/testhelpers.fn";
describe("Login - Validation", () => {
  it("input should be initially in the document", () => {
    render(<Login />);
    expect(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("input fields should be empty, required, not disabled when rendered", () => {
    render(<Login />);
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const passwordInput = screen.getByLabelText("Password");
    expect(usernameInput.ariaValueText).toBe(undefined);
    expect(usernameInput).toBeRequired();
    expect(usernameInput).toHaveClass("ant-input");
    expect(usernameInput).toBeEnabled();
    expect(passwordInput.ariaValueText).toBe(undefined);
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toBeEnabled();
  });

  it("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: undefined,
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    expect(passwordElement).toBe(undefined);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show error message when username is empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: undefined,
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
  });

  it("should show error message when username and password are empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: undefined,
      password: undefined,
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("user clicked several times on username", async () => {
    render(<Login />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    expect(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    ).toHaveFocus();
    expect(screen.queryByText(/Please input your username/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      username: undefined,
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findByText(/please input your username/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    const { usernameElement } = await typeIntoFormAuth(user, {
      username: "test",
      password: "",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(usernameElement).toHaveValue("test");
    await waitFor(async () => {
      expect(screen.queryByText(/please input your username/i)).toBe(null);
      expect(await screen.queryAllByRole("alert")).toHaveLength(0);
    });
  });
});

describe("Login - Integration", () => {
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

  it("should show invalid credentials when password or username doesn't match", async () => {
    const user = userEvent.setup();
    render(<Login />);
    await typeIntoFormAuth(user, {
      username: "test",
      password: "pith",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();

    expect(await screen.findByText(/error password/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    await user.clear(screen.getByLabelText("Password"));
    await typeIntoFormAuth(user, {
      username: "testa",
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    expect(await screen.findByText(/error username/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    await user.clear(screen.getByLabelText("Password"));
    await typeIntoFormAuth(user, {
      username: "testa",
      password: "pith",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    expect(await screen.findByText(/error username, error password/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    );
    await user.clear(screen.getByLabelText("Password"));
    await typeIntoFormAuth(user, {
      username: "test",
      password: "pit",
      confirmPassword: "",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 201/i)).toBeInTheDocument();
    expect(await screen.findByText(/Success/i)).toBeInTheDocument();
  });
});
