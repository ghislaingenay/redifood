import { render } from "@testing-library/react";
import Auth from "../../../src/components/Auth";
import { clickRadio, expectFindText, expectNotFoundText, findRadio } from "../../../src/functions/testhelpers.fn";

jest.mock("next/navigation", () => require("next-router-mock"));
describe("Auth", () => {
  it("register and signin button are in the page", async () => {
    render(<Auth />);
    expect(await findRadio(/sign in/i)).toBeInTheDocument();
    expect(await findRadio(/register/i)).toBeInTheDocument();
  });

  it("show display signup section when signup page is clicked", async () => {
    render(<Auth />);
    [/email/i, "Password"].forEach(async (item: any) => {
      await expectFindText(item);
    });
    expectNotFoundText(/confirm/i);
    await clickRadio(/register/i);
    await expectFindText(/confirm/i);
  });

  it("Should show login if user click on SignUp and then click on Login", async () => {
    render(<Auth />);

    // const signInRadio: HTMLInputElement = screen.getByRole("radio", { name: "Sign In" });
    // const registerRadio: HTMLInputElement = screen.getByRole("radio", { name: "Register" });
    await clickRadio(/register/i);
    expect(await findRadio(/sign in/i)).not.toBeChecked();
    expect(await findRadio(/register/i)).toBeChecked();
    await clickRadio(/sign in/i);
    expect(await findRadio(/sign in/i)).toBeChecked();
    expect(await findRadio(/register/i)).not.toBeChecked();
  });
});
