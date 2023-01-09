import { ITestUserAuth } from "@interfaces/test.interface";
import { screen } from "@testing-library/react";

export const typeIntoFormAuth = async (
  user,
  { username, password, confirmPassword },
): Promise<ITestUserAuth> => {
  let userKeys = [
    "usernameElement",
    "passwordElement",
    "confirmPasswordElement",
  ];
  let finalData = {};
  if (username) {
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    await user.type(usernameInput, username);
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
  return finalData;
};

export const clickButton = async (reg: RegExp, user) => {
  const clickButton: HTMLElement = screen.getByRole("button", {
    name: reg,
  });
  await user.click(clickButton);
};
