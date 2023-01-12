import { AuthRadioButton } from "@styles";
import { Button, Form, Input, Radio, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { EAuthChoice } from "../../src/interfaces/auth.interface";
const { Title } = Typography;
const Auth = () => {
  // ------------ CONSTANTS ---------
  const [formLogin] = Form.useForm();
  const [formSignUp] = Form.useForm();

  // ------------ STATE ---------
  const [authChoice, setAuthChoice] = useState<EAuthChoice>(EAuthChoice.SIGNIN);
  const [buttonWasClicked, setButtonWasClicked] = useState<boolean>(false);

  const isDisabled = buttonWasClicked ? true : false;

  // ------------ HANDLERS ---------
  const handleAuthChoice = (e: any) => {
    setAuthChoice(e.target.value);
  };

  const handleLogin = async (values: any) => {
    setButtonWasClicked(true);
    console.log("Success:", values);
    await axios
      .post("/api/auth/login", values)
      .then((res) => {
        console.log("res login", res);
        setButtonWasClicked(false);
      })
      .catch((err) => {
        console.log("error", err);

        setButtonWasClicked(false);
      });
  };

  const handleSignUp = async (values: any) => {
    setButtonWasClicked(true);
    await axios
      .post("/api/auth/signup", values)
      .then((res) => {
        console.log("res signup", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // ------------ RENDER ---------

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
          <Title>LOGIN</Title>
          <Form
            form={formLogin}
            layout="vertical"
            onFinish={handleLogin}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // onValuesChange={(e, all) => {
            //   console.log(e);
            //   console.log(all);
            // }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <Button onClick={() => formLogin.submit()}>Submit</Button>
          </Form>
        </Then>
        <Else>
          <Title>SIGN UP</Title>
          <Form
            form={formSignUp}
            layout="vertical"
            onFinish={handleSignUp}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // onValuesChange={(e, all) => {
            //   console.log(e);
            //   console.log(all);
            // }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 4, message: "username should contains between 4 to 12 characters" },
                { max: 12, message: "username should contains between 4 to 12 characters" },
                () => ({
                  validator(_, value) {
                    // regex only . _ - are allowed
                    if (/^[a-zA-Z0-9._-]*$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("username can only contain letters, numbers, dot, hyphens and underscore"),
                    );
                  },
                }),
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                () => ({
                  validator(_, value) {
                    if (/\d/.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error("password must contain at least one number"));
                    }
                  },
                }),
                () => ({
                  validator(_, value) {
                    if (value.length >= 8 && value.length <= 20) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error("password should contains between 8 to 20 characters"));
                    }
                  },
                }),
                () => ({
                  validator(_, value) {
                    if (/[a-z]/.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error("password must contain at least one lowercase letter"));
                    }
                  },
                }),
                () => ({
                  validator(_, value) {
                    if (/[A-Z]/.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error("password must contain at least one uppercase letter"));
                    }
                  },
                }),
                () => ({
                  validator(_, value) {
                    // regex special character
                    if (/[!@#$%^()&*_]/.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error("password must contain at least one special character (!@#$%^&()*_)"),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input type="password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                () => ({
                  validator(_, value) {
                    if (value === form.getFieldValue("password")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("passwords do not match"));
                  },
                }),
              ]}
            >
              <Input type="password" />
            </Form.Item>

            <Button onClick={() => formSignUp.submit()}>Submit</Button>
          </Form>
        </Else>
      </If>
    </div>
  );
};
export default Auth;
