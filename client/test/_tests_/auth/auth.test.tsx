// import { logRoles } from "@testing-library/dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { clickButton, typeIntoFormAuth } from "src/functions/testhelpers.fn";
import Auth from "../../../pages/auth/index";

describe("Auth", () => {
  it("show display signup section when signup page is clicked", async () => {
    render(<Auth />);
    // const radioRole = screen.getByRole("radiogroup");
    expect(screen.getByRole("heading", { name: "LOGIN" })).toBeInTheDocument();
    const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    expect(signInRadio).toBeChecked();
    expect(registerRadio).not.toBeChecked();
    await fireEvent.click(screen.getByLabelText("Register"));
    await waitFor(() => {
      expect(signInRadio).not.toBeChecked();
      expect(registerRadio).toBeChecked();
    });
  });

  it("Should show login if user click on SignUp and then click on Login", async () => {
    render(<Auth />);
    const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    await fireEvent.click(screen.getByLabelText("Register"));
    await waitFor(() => {
      expect(signInRadio).not.toBeChecked();
      expect(registerRadio).toBeChecked();
    });
    await fireEvent.click(screen.getByLabelText("Sign In"));
    await waitFor(() => {
      expect(signInRadio).toBeChecked();
      expect(registerRadio).not.toBeChecked();
    });
  });

  it("Should not able to switch between login and signup if user submit the form if correct credentials", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    expect(signInRadio).toBeEnabled();
    expect(registerRadio).toBeEnabled();
    await userEvent.type(screen.getByLabelText("Username"), "test");
    await userEvent.type(screen.getByLabelText("Password"), "pit");
    await clickButton(/submit/i, user);
    expect(screen.getByRole("radio", { name: "Register" })).toBeDisabled();
    expect(await screen.findByText(/status: 201/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Sign In" })).toBeDisabled();
  });

  it("Should not able to switch between login and signup if user submit the form if correct credentials", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    expect(signInRadio).toBeEnabled();
    expect(registerRadio).toBeEnabled();
    await userEvent.type(screen.getByLabelText("Username"), "test");
    await userEvent.type(screen.getByLabelText("Password"), "pt");
    await clickButton(/submit/i, user);
    expect(screen.getByRole("radio", { name: "Register" })).toBeEnabled();
    expect(await screen.findByText(/status: 401/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Sign In" })).toBeEnabled();
  });

  it("should be able to login if user enter valid credentials", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    await userEvent.type(screen.getByLabelText("Username"), "test");
    await userEvent.type(screen.getByLabelText("Password"), "pit");
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/status: 201/i)).toBeInTheDocument();
    expect(await screen.findByText(/Success/i)).toBeInTheDocument();
  });

  it("should be able to signup if user enter username not in db", async () => {
    render(<Auth />);
    const user = userEvent.setup();
    const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    expect(signInRadio).toBeChecked();
    await fireEvent.click(registerRadio);
    expect(registerRadio).toBeChecked();
    await typeIntoFormAuth(user, {
      username: "test12",
      password: "FHtuBV9*h_",
      confirmPassword: "FHtuBV9*h_",
    });
    await clickButton(/submit/i, user);
    expect(await screen.findByText(/Account succesfully created/i)).toBeInTheDocument();
  });
});
