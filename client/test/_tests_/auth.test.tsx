import Login from "@components/Login";
import SignUp from "@components/SignUp";
import "@testing-library/jest-dom";
import {
  render,
  screen
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const typeIntoForm = async ({
  username,
  password,
  confirmPassword,
}) => {
  const user = userEvent.setup();
  let usernameInput: string;
  let passwordInput: string;
  let confirmPasswordInput: string;
  if (username) {
    const usernameInput: HTMLElement =
      screen.getByRole("textbox", {
        name: /username/i,
      });
    await user.type(
      usernameInput,
      username,
    );
  }
  if (password) {
    const passwordInput: HTMLElement =
      screen.getByLabelText("Password");
    await user.type(
      passwordInput,
      password,
    );
  }
  if (confirmPassword) {
    const confirmPasswordInput: HTMLElement =
      screen.getByLabelText(/confirm/i);
    await user.type(
      confirmPasswordInput,
      confirmPassword,
    );
  }
  return {
    usernameInput,
    passwordInput,
    confirmPasswordInput,
  };
};

const clickButton = async (
  reg: RegExp,
) => {
  const user = userEvent.setup();
  const clickButton: HTMLElement =
    screen.getByRole("button", {
      name: reg,
    });
  return await user.click(clickButton);
};

describe("Login", () => {
  it("should render without crash", () => {
    render(<Login />);
    expect(
      screen.getByText(/Login/i),
    ).toBeInTheDocument();
  });

  it("input should be initially in the document", () => {
    render(<Login />);
    expect(
      screen.getByLabelText(
        /username/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /password/i,
      ),
    ).toBeInTheDocument();
  });

  it("input fields should be empty when rendered", () => {
    render(<Login />);
    expect(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
    ).toBe(undefined);
    expect(
      screen.getByLabelText("Password"),
    ).toBe(undefined);
  });
  it("should show error message when password is empty", async () => {
    render(<Login />);
    expect(
      screen.queryByText(
        /password is required/i,
      ),
    ).not.toBeInTheDocument();

    const {
      usernameInput,
      passwordInput,
    } = await typeIntoForm({
      username: "test",
      password: undefined || "",
      confirmPassword: "",
    });
    await clickButton(/submit/i);
    expect(usernameInput).toBe("test");
    expect(passwordInput).toBe(
      undefined || "",
    );
    expect(
      screen.getByText(
        /password is required/i,
      ),
    ).toBeInTheDocument();
  });

  it("should show error message when username is empty", async () => {
    render(<Login />);
    expect(
      screen.queryByText(
        /username is required/i,
      ),
    ).not.toBeInTheDocument();

    const {
      usernameInput,
      passwordInput,
      confirmPasswordInput,
    } = await typeIntoForm({
      username: undefined || "",
      password: "pit",
      confirmPassword: "pit",
    });
    await clickButton(/submit/i);
    expect(usernameInput).toBe(
      undefined || "",
    );
    expect(passwordInput).toBe("pit");
    expect(confirmPasswordInput).toBe(
      "pit",
    );
    expect(
      screen.getByText(
        /username is required/i,
      ),
    ).toBeInTheDocument();
  });

  it.todo(
    "should show invalid credentials when username doesn't match",
    // mocking the api call
  );
  it.todo(
    "should show invalid credentials when password doesn't match",
    // mocking the api call
  );
  it.todo(
    "should indicate sucess when password doesn't match",
    // mocking the api call
  );
});

describe("Signup", () => {
  it("should render without crash", () => {
    render(<SignUp />);
    expect(
      screen.getByText(/Sign Up/i),
    ).toBeInTheDocument();
  });

  it.todo(
    "input fields should be empty when rendered",
  );
  it.todo(
    "should show error message when password is empty",
  );
  it.todo(
    "should show error message when confirm password is empty",
  );

  it.todo(
    "should show error message when username is empty",
  );

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
  it.todo(
    "show display signup section when signup page is clicked",
  );
  it.todo(
    "Should show login if user click on SignUp and then click on Login",
  );
  it.todo(
    "Should not able to switch between login and signup if user submit the form",
  );
  it.todo(
    "show already user message if user login with existing credentials",
  );
  it.todo(
    "show not invalid credentials if signup with user already in db",
  );
});
