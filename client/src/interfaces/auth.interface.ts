export enum EAuthChoice {
  SIGNIN = "signin",
  REGISTER = "register",
}

export interface IPropsAuth {
  setButtonWasClicked: (value: boolean) => void;
}

export interface IAuthContext {
  authorization: any;
}
