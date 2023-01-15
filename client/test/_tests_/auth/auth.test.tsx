import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Auth from "src/components/Auth";
// import { render } from "../../index";
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
});
