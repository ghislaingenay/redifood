import { screen } from "@testing-library/react";
import { IFormAuthFields, ITestUserAuth } from "../../src/interfaces/test.interface";

export const typeIntoFormAuth = async (
  user,
  { email, password, confirmPassword }: IFormAuthFields,
): Promise<ITestUserAuth> => {
  let userKeys = ["emailElement", "passwordElement", "confirmPasswordElement"];
  let finalData = {};
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
  userKeys.forEach((key) => {
    if (!finalData.hasOwnProperty(key)) {
      finalData[key] = undefined;
    }
  });
  return finalData;
};

export const clickButton = async (reg: RegExp, user) => {
  const clickButton: HTMLElement = screen.getByRole("button", {
    name: reg,
  });
  await user.click(clickButton);
};
