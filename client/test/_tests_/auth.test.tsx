import { ITestUserAuth } from "@interfaces/test.interface";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../src/components/auth/Login";

window!.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

let userKeys = ["usernameElement", "passwordElement", "confirmPasswordElement"];
const typeIntoForm = async (
  user,
  { username, password, confirmPassword },
): Promise<ITestUserAuth> => {
  let finalData = {};
  if (username) {
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    await user.type(usernameInput, username);
    console.log("value", usernameInput);
    Object.assign(finalData, { usernameElement: usernameInput });
  }
  if (password) {
    const passwordInput: HTMLElement = screen.getByLabelText(/password/i);
    await user.type(passwordInput, password);
    Object.assign(finalData, { passwordElement: passwordInput });
  }
  if (confirmPassword) {
    const confirmPasswordInput: HTMLElement = screen.getByLabelText(/confirm/i);
    await user.type(confirmPasswordInput, confirmPassword);
    Object.assign(finalData, { confirmPasswordElement: confirmPasswordInput });
  }
  userKeys.forEach((key) => {
    if (!finalData.hasOwnProperty(key)) {
      finalData[key] = undefined;
    }
  });
  console.log("finalData", finalData);
  return finalData;
};

const clickButton = async (reg: RegExp, user) => {
  const clickButton: HTMLElement = screen.getByRole("button", {
    name: reg,
  });
  return await user.click(clickButton);
};

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

  it.only("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Login />);
    expect(
      screen.queryByText(/Please input your password/i),
    ).not.toBeInTheDocument();
    const { usernameElement, passwordElement } = await typeIntoForm(user, {
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

  // it("should show error message when username is empty", async () => {
  //   render(<Login />);
  //   expect(
  //     screen.queryByText(/Please input your username/i),
  //   ).not.toBeInTheDocument();
  //   const { usernameInput, passwordInput, confirmPasswordInput } =
  //     await typeIntoForm({
  //       username: undefined,
  //       password: "pit",
  //       confirmPassword: "pit",
  //     });
  //   await clickButton(/submit/i);
  //   expect(usernameInput).toBe(undefined);
  //   expect(passwordInput).toBe("pit");
  //   expect(confirmPasswordInput).toBe("pit");
  // expect(
  //   screen.getByText(
  //     /username is required/i,
  //   ),
  // ).toBeInTheDocument();
  // });

  // it.todo(
  //   "should show invalid credentials when username doesn't match",
  //   // mocking the api call
  // );
  // it.todo(
  //   "should show invalid credentials when password doesn't match",
  //   // mocking the api call
  // );
  // it.todo(
  //   "should indicate sucess when password doesn't match",
  //   // mocking the api call
  // );
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
