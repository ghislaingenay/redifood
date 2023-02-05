import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { faRegistered, faSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Form, Input, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { AxiosFunction } from "../../pages/api/axios-request";
import whiteLogo from "../../public/redifood-logo-white.png";
import { EAuthChoice } from "../../src/interfaces/auth.interface";
import { RoundedInput } from "../styles/styledComponents/typography.styled";
import { RowCenter } from "./styling/grid.styled";
import RediRadioButton from "./styling/RediRadioButton";
const { Title } = Typography;
const Auth = () => {
  // ------------ CONSTANTS ---------
  const [formLogin] = Form.useForm();
  const [formSignUp] = Form.useForm();
  const router = useRouter();
  // ------------ STATE ---------
  const [authChoice, setAuthChoice] = useState<EAuthChoice>(EAuthChoice.SIGNIN);
  const [buttonWasClicked, setButtonWasClicked] = useState<boolean>(false);

  const isDisabled = buttonWasClicked ? true : false;

  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const textColor = isError ? "red" : "green";

  // ------------ HANDLERS ---------
  const handleAuthChoice = (e: any) => {
    setAuthChoice(e.target.value);
  };

  const handleLogin = async (values: any) => {
    setResponse(null);
    setIsError(false);
    await AxiosFunction({
      queryParams: {},
      url: "/api/auth/login",
      method: "post",
      body: values,
    })
      .then(() => {
        setResponse("Successfully logged in");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch(() => {
        setIsError(true);
        return setResponse("Invalid credentials");
        // console.log(err);
      });
  };

  const handleSignUp = async (values: any) => {
    setButtonWasClicked(true);
    setResponse(null);
    setIsError(false);
    await AxiosFunction({
      queryParams: {},
      url: "/api/auth/signup",
      method: "post",
      body: values,
    })
      .then(() => {
        setResponse("Account succesfully created");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch(() => {
        setIsError(true);
        return setResponse("Invalid credentials");
      });
  };

  const options = [
    { value: EAuthChoice.SIGNIN, label: "SIGN IN", icon: <FontAwesomeIcon icon={faSign} /> },
    { value: EAuthChoice.REGISTER, label: "REGISTER", icon: <FontAwesomeIcon icon={faRegistered} /> },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  // ------------ RENDER ---------

  return (
    <div className="background-auth">
      <RowCenter style={{ paddingTop: "3rem" }}>
        <Image src={whiteLogo} alt="Redifood logo white" width={200} height={200} />
      </RowCenter>
      <RowCenter style={{ paddingTop: "2rem" }}>
        <RediRadioButton
          options={options}
          radioGroupName="auth"
          haveIcon="yes"
          selectedButton={selectedOption}
          setSelectedButton={setSelectedOption}
        />
      </RowCenter>
      <If condition={authChoice === EAuthChoice.SIGNIN}>
        <Then>
          <Divider />
          <Title className="text-center py-2" level={4}>
            LOGIN
          </Title>
          <Divider />
          <Form
            form={formLogin}
            layout="vertical"
            onFinish={handleLogin}
            style={{ backgroundColor: "transparent" }}
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
              <RoundedInput type="text" />
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
              <Input.Password
                style={{ borderRadius: "2rem" }}
                placeholder="input password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Button onClick={() => formLogin.submit()}>Submit</Button>
          </Form>
        </Then>
        <Else>
          <Divider />
          <Title className="text-center" level={4}>
            SIGN UP
          </Title>
          <Divider />
          <Form
            form={formSignUp}
            layout="vertical"
            onFinish={handleSignUp}
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
                    if (value === formSignUp.getFieldValue("password")) {
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
      {response && (
        <Title level={5} className="text-center" style={{ color: textColor }}>
          {response}
        </Title>
      )}
    </div>
  );
};
export default Auth;
