import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../..";
import Auth from "../../../src/components/Auth";
import { clickButton, clickRadio, expectFindText, typeIntoFormAuth } from "../../../src/functions/testhelpers.fn";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.setTimeout(30000);

describe("Signup - Validation", () => {
  it("input should be initially in the document", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it("input fields should be empty, enabled and required when rendered", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.queryByLabelText(/confirm/i);
    expect(emailInput.ariaValueText).toEqual(undefined);
    expect(passwordInput.ariaValueText).toEqual(undefined);
    expect(confirmPasswordInput.ariaValueText).toEqual(undefined);
    expect(emailInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(emailInput).toHaveClass("ant-input");
    expect(emailInput).toBeEnabled();
    expect(passwordInput).toBeEnabled();
    expect(confirmPasswordInput).toBeEnabled();
  });

  it("should show error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await clickRadio(/register/i);

    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { emailElement, passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test",
      password: undefined,
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toHaveValue("test");
    expect(passwordElement).toBe(undefined);
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
    expect(await screen.findByText(/please confirm your password/i)).toBeInTheDocument();
  });

  it("should show password and email missing if no fields are filled before submit", async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await clickRadio(/register/i);

    expect(screen.queryByText(/Please input your email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { emailElement, passwordElement } = await typeIntoFormAuth(user, {
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toBe(undefined);
    expect(passwordElement).toBe(undefined);
    expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
    expect(await screen.findByText(/please input your password/i)).toBeInTheDocument();
  });

  it("should show error message when email is empty", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();

    expect(screen.queryByText(/Please input your email/i)).not.toBeInTheDocument();
    const { emailElement } = await typeIntoFormAuth(user, {
      email: undefined,
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    await clickButton(/submit/i, user);
    expect(emailElement).toBe(undefined);
    expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
  });

  it("should show error message when confirm password is empty", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();

    expect(screen.queryByText(/Please input your password/i)).not.toBeInTheDocument();
    const { confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test",
      password: "FHTU*vn9H_",
      confirmPassword: undefined,
    });
    await clickButton(/submit/i, user);
    expect(confirmPasswordElement).toBe(undefined);
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("display error when password contains more than 20 characters", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();

    expect(
      screen.queryByText(
        /password should contains between 8 to 20 characters and must contains at least one special character/i,
      ),
    ).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      email: "test12@test.com",
      password: "Hf*1234567891011121314151617181920",
      confirmPassword: "Hf*1234567891011121314151617181920",
    });
    await clickButton(/submit/i, user);
    await expectFindText(
      /password should contains between 8 to 20 characters and must contains at least one special character/i,
    );
  });

  it("display error when password contains less than 8 characters", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();
    // expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      screen.queryByText(
        /password should contains between 8 to 20 characters and must contains at least one special character/i,
      ),
    ).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test1@test.com",
      password: "Hf*1h_",
      confirmPassword: "Hf*1h_",
    });
    await clickButton(/submit/i, user);
    // expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      await screen.findByText(
        /password should contains between 8 to 20 characters and must contains at least one special character/i,
      ),
    ).toBeInTheDocument();
    await user.clear(confirmPasswordElement);
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    console.log("data", passwordElement, confirmPasswordElement);
    await clickButton(/submit/i, user);
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText(
          /password should contains between 8 to 20 characters and must contains at least one special character/i,
        ),
      ).toBe(null);
    });
  });

  it("display error when email contains less than 4 characters and more than 12 characters", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(screen.queryByText(/Please input a valid email address/i)).not.toBeInTheDocument();
    await typeIntoFormAuth(user, {
      email: "teshbsfhbsbsjfbsjfbsjffssfdsfdf",
      password: "FHTU*vn9H_",
      confirmPassword: "FHTU*vn9H_",
    });
    // expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/Please input a valid email address/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
      "te@er",
    );
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/Please input a valid email address/i)).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", {
        name: /email/i,
      }),
      "test1@test.com",
    );
    await clickButton(/submit/i, user);
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Please input a valid email address/i)).toBe(null);
      expect(screen.queryByText(/please input your email/i)).toBe(null);
    });
  });

  it("display error when password don't contain  at least one lowercase letter", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();
    // expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      screen.queryByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
    ).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test12",
      password: "FHTUBV9*H_",
      confirmPassword: "FHTUBV9*H_",
    });
    await clickButton(/submit/i, user);
    await user.clear(screen.getByLabelText(/confirm/i));
    expect(
      await screen.findByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
    ).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Password"));
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    await waitFor(async () => {
      expect(screen.queryByText(/password must contain at least one digit, one lowercase and uppercase letter/i)).toBe(
        null,
      );
    });
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
  });

  it("display error when password don't contain at least one uppercase letter", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      screen.queryByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
    ).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test1",
      password: "fhtubv9*a_",
      confirmPassword: "fhtubv9*a_",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(
      await screen.findByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
    ).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(async () => {
      expect(screen.queryByText(/password must contain at least one digit, one lowercase and uppercase letter/i)).toBe(
        null,
      );
    });
  });

  it("display error when password don't contain at least one special characters", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();
    // expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      screen.queryByText(
        /password should contains between 8 to 20 characters and must contains at least one special character/i,
      ),
    ).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test1",
      password: "FHTUvn9H",
      confirmPassword: "FHTUvn9H",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(
      await screen.findByText(
        /password should contains between 8 to 20 characters and must contains at least one special character/i,
      ),
    ).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(async () => {
      expect(
        screen.queryByText(
          /password should contains between 8 to 20 characters and must contains at least one special character/i,
        ),
      ).toBe(null);
    });
  });

  it("display error when password don't contain at least one number", async () => {
    render(<Auth />);
    await clickRadio(/register/i);
    const user = userEvent.setup();

    expect(screen.queryByText(/password must contain at least one number/i)).not.toBeInTheDocument();
    const { passwordElement, confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test123@test.com",
      password: "FHTUvgjnH*",
      confirmPassword: "FHTUvgjnH*",
    });
    await clickButton(/submit/i, user);
    await user.clear(confirmPasswordElement);
    expect(screen.queryByRole("heading", { name: /Account succesfully created/i })).toBe(null);
    expect(
      await screen.findByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
    ).toBeInTheDocument();
    await user.clear(passwordElement);
    await user.type(passwordElement, "FHTU*vn9H_");
    await user.type(confirmPasswordElement, "FHTU*vn9H_");
    await clickButton(/submit/i, user);
    // expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText(/password must contain at least one digit, one lowercase and uppercase letter/i),
      ).toEqual(null);
    });
  });

  it("show error if the password and confirm password don't match", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await clickRadio(/register/i);
    expect(screen.queryByText(/Invalid credentials/i)).toEqual(null);
    expect(screen.queryByText(/password and confirm password must match/i)).toEqual(null);
    const { confirmPasswordElement } = await typeIntoFormAuth(user, {
      email: "test@test.com",
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

// describe("Signup - Integration", () => {
//   it("should have invalid credentials msg if email already exists", async () => {
//     render(<Auth />);
//     const user = userEvent.setup();
//     await clickRadio(/register/i);
//     expect(screen.queryByRole(/Invalid credentials/i)).toEqual(null);
//     await typeIntoFormAuth(user, {
//       email: "test@test.com",
//       password: passwordValid,
//       confirmPassword: passwordValid,
//     });
//     await clickButton(/submit/i, user);
//     expect(await screen.findByRole("heading", { name: /Invalid credentials/i })).toBeInTheDocument();
//   });

// it("should send success if user properly created", async () => {
//   render(<Auth />);
//   const user = userEvent.setup();
//   await clickRadio(/register/i);
//   expect(screen.queryByRole(/Account succesfully created/i)).toEqual(null);
//   await typeIntoFormAuth(user, {
//     email: "test2@test.com",
//     password: passwordNotIdentical,
//     confirmPassword: passwordNotIdentical,
//   });
//   await clickButton(/submit/i, user);
//   expect(await screen.findByRole("heading", { name: /Account succesfully created/i })).toBeInTheDocument();
// });
// });
