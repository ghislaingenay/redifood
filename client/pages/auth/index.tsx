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
        <Radio.Button value={EAuthChoice.SIGNIN}>Sign In</Radio.Button>
        <Radio.Button value={EAuthChoice.REGISTER}>Register</Radio.Button>
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
