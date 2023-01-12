import { AuthRadioButton } from "@styles";
import { Radio } from "antd";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import Login from "../../src/components/auth/Login";
import SignUp from "../../src/components/auth/SignUp";
import { EAuthChoice } from "../../src/interfaces/auth.interface";
const Auth = () => {
  const [authChoice, setAuthChoice] = useState<EAuthChoice>(EAuthChoice.SIGNIN);

  const [buttonWasClicked, setButtonWasClicked] = useState<boolean>(false);
  const isDisabled = buttonWasClicked ? true : false;
  const handleAuthChoice = (e: any) => {
    setAuthChoice(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={handleAuthChoice} value={authChoice} disabled={isDisabled}>
        <AuthRadioButton type="primary" value={EAuthChoice.SIGNIN}>
          Sign In
        </AuthRadioButton>
        <AuthRadioButton type="primary" value={EAuthChoice.REGISTER}>
          Register
        </AuthRadioButton>
      </Radio.Group>
      <If condition={authChoice === EAuthChoice.SIGNIN}>
        <Then>
          <Login setButtonWasClicked={setButtonWasClicked} />
        </Then>
        <Else>
          <SignUp setButtonWasClicked={setButtonWasClicked} />
        </Else>
      </If>
    </div>
  );
};
export default Auth;
