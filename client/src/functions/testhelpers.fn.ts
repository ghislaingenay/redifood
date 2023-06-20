import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IFormAuthFields, ITestUserAuth } from "../../src/interfaces/test.interface";

type NSReg = number | string | RegExp;
type SReg = RegExp | string;

const user = userEvent.setup();

export const typeIntoFormAuth = async (
  user: any,
  { email, password, confirmPassword }: IFormAuthFields,
): Promise<ITestUserAuth> => {
  let userKeys = ["emailElement", "passwordElement", "confirmPasswordElement"];
  let finalData: Record<"emailElement" | "passwordElement" | "confirmPasswordElement", string> | any = {};
  if (email) {
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    await user.type(emailInput, email);
    Object.assign(finalData, { emailElement: emailInput });
  }
  if (password) {
    const passwordInput: HTMLElement = screen.getByLabelText("Password");
    await user.type(passwordInput, password);
    Object.assign(finalData, { passwordElement: passwordInput });
  }
  if (confirmPassword) {
    const confirmPasswordInput: HTMLElement = screen.getByLabelText(/confirm/i);
    await user.type(confirmPasswordInput, confirmPassword);
    Object.assign(finalData, { confirmPasswordElement: confirmPasswordInput });
  }
  await user.type(screen.getByRole("textbox", { name: /first/i }), "test");
  await user.type(screen.getByRole("textbox", { name: /last/i }), "hallo");
  userKeys.forEach((key) => {
    if (!finalData.hasOwnProperty(key)) {
      finalData[key] = undefined;
    }
  });
  return finalData;
};

export const clickButton = async (reg: RegExp, user?: any) => {
  user = userEvent.setup();
  const clickButton: HTMLElement = screen.getByRole("button", {
    name: reg,
  });
  await user.click(clickButton);
};

export const clickRadio = async (reg: RegExp) => {
  const clickButton: HTMLElement = screen.getByRole("radio", {
    name: reg,
  });
  await user.click(clickButton);
  await user.click(clickButton);
};

export const findRadio = async (reg: RegExp) => screen.findByRole("radio", { name: reg });
export const expectCardLength = async (lgt: number) => expect(await screen.findAllByRole("card")).toHaveLength(lgt);
export const getButton = (btnName: SReg) => screen.getByRole("button", { name: btnName });
export const findButton = async (btnName: SReg) => await screen.findByRole("button", { name: btnName });
export const findText = async (txt: NSReg) => screen.findByText(txt);

export const queryText = (text: SReg) => screen.queryByText(text);
export const expectNotFoundText = (text: SReg) => expect(queryText(text)).toBe(null);
export const expectFindText = async (text: SReg) => expect(await findText(text)).toBeInTheDocument();

export const clickFindAltText = async (text: SReg) => await user.click(await screen.findByAltText(text));
export const clickFindButton = async (text: SReg) => await user.click(await findButton(text));

export const expectCheckedRadio = async (reg: RegExp) => expect(await findRadio(reg)).toBeChecked();
export const expectNotCheckedRadio = async (reg: RegExp) => expect(await findRadio(reg)).not.toBeChecked();

export const expectAlertLength = async (lgt: number) => expect(await screen.findAllByRole("alert")).toHaveLength(lgt);
