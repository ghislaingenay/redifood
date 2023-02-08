import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { faRegistered, faSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Divider, Form, Input, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { toast } from "react-toastify";
import whiteLogo from "../../public/redifood-logo-white.png";
import { EAuthChoice } from "../../src/interfaces/auth.interface";
import { SpacingDiv25X } from "../styles/styledComponents/div.styled";
import { RedSpan } from "../styles/styledComponents/span.styled";
import { LabelFormWhite, RoundedInput } from "../styles/styledComponents/typography.styled";
import { RowCenter, RowSpaceBetween } from "./styling/grid.styled";
import RediRadioButton from "./styling/RediRadioButton";
const { Title } = Typography;
const Auth = () => {
  // ------------ CONSTANTS ---------
  const [formLogin] = Form.useForm();
  const [formSignUp] = Form.useForm();
  const router = useRouter();
  // ------------ STATE ---------

  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);

  const textColor = isError ? "red" : "green";

  const options = [
    { value: EAuthChoice.SIGNIN, label: "SIGN IN", icon: <FontAwesomeIcon icon={faSign} /> },
    { value: EAuthChoice.REGISTER, label: "REGISTER", icon: <FontAwesomeIcon icon={faRegistered} /> },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const [clicked, setClicked] = useState(false);
  const isDisabled = clicked ? true : false;

  const handleButtonClicked = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
  };

  const formStyle = { marginTop: "0.25rem" };
  // ------------ HANDLERS ---------

  const handleLogin = async (values: any) => {
    console.log("clicked login", values);
    toast.success("Succesfully logged in !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    toast.error("Invalid  credentials !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    // setResponse(null);
    // setIsError(false);
    // await AxiosFunction({
    //   queryParams: {},
    //   url: "/api/auth/login",
    //   method: "post",
    //   body: values,
    // })
    //   .then(() => {
    //     setResponse("Successfully logged in");
    //     setTimeout(() => {
    //       router.push("/");
    //     }, 2000);
    //   })
    //   .catch(() => {
    //     setIsError(true);
    //     return setResponse("Invalid credentials");
    //     // console.log(err);
    //   });
  };

  const handleSignUp = async (values: any) => {
    console.log("clicked signup", values);
    toast.success("Succesfully signed up !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    toast.error("Invalid  credentials !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    // setButtonWasClicked(true);
    // setResponse(null);
    // setIsError(false);
    // await AxiosFunction({
    //   queryParams: {},
    //   url: "/api/auth/signup",
    //   method: "post",
    //   body: values,
    // })
    //   .then(() => {
    //     setResponse("Account succesfully created");
    //     setTimeout(() => {
    //       router.push("/");
    //     }, 2000);
    //   })
    //   .catch(() => {
    //     setIsError(true);
    //     return setResponse("Invalid credentials");
    //   });
  };

  const passwordRules = [
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
          return Promise.reject(new Error("password must contain at least one special character (!@#$%^&()*_)"));
        }
      },
    }),
  ];

  const emailRules = [
    {
      required: true,
      message: "Please input your email!",
    },
    {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: "Please input a valid email address",
    },
  ];

  // 1 - add toast
  // 2 - add loading
  // 3 - user context (later)
  // 4 - reddo jest testing for this component
  // ------------ RENDER ---------

  return (
    <div className="background-auth">
      <RowCenter style={{ paddingTop: "3rem" }}>
        <Image src={whiteLogo} alt="Redifood logo white" width={200} height={200} />
      </RowCenter>
      <SpacingDiv25X>
        <RowCenter style={{ paddingTop: "2rem" }}>
          <RediRadioButton
            disabled={isDisabled}
            options={options}
            radioGroupName="auth"
            haveIcon="yes"
            selectedButton={selectedOption}
            setSelectedButton={setSelectedOption}
          />
        </RowCenter>
        <Divider style={{ border: "1px solid white" }} />
        <If condition={selectedOption === EAuthChoice.SIGNIN}>
          <Then>
            <Form form={formLogin} layout="vertical" onFinish={handleLogin} style={{ backgroundColor: "transparent" }}>
              <LabelFormWhite>
                Email <RedSpan>*</RedSpan>
              </LabelFormWhite>
              <Form.Item name="email" rules={emailRules} style={formStyle}>
                <RoundedInput type="text" />
              </Form.Item>
              <LabelFormWhite>
                Password <RedSpan>*</RedSpan>
              </LabelFormWhite>
              <Form.Item name="password" rules={passwordRules} style={formStyle}>
                <Input.Password
                  style={{ borderRadius: "2rem" }}
                  placeholder="input password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <RowSpaceBetween>
                <Col span={6}>
                  <Button onClick={() => formLogin.submit()} loading={clicked}>
                    Submit
                  </Button>
                </Col>
                <Col span={6}>
                  <Button type="link">Forgot password</Button>
                </Col>
              </RowSpaceBetween>
            </Form>
          </Then>
          <Else>
            <Form
              form={formSignUp}
              layout="vertical"
              onFinish={handleSignUp}
              style={{ backgroundColor: "transparent" }}
            >
              <LabelFormWhite>
                Email <RedSpan>*</RedSpan>
              </LabelFormWhite>
              <Form.Item name="email" rules={emailRules} style={formStyle}>
                <RoundedInput type="text" />
              </Form.Item>
              <RowSpaceBetween>
                <Col md={11}>
                  <LabelFormWhite>
                    Password <RedSpan>*</RedSpan>
                  </LabelFormWhite>
                  <Form.Item name="password" rules={passwordRules} style={formStyle}>
                    <Input.Password
                      style={{ borderRadius: "2rem" }}
                      placeholder="input password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
                <Col md={11}>
                  <LabelFormWhite>
                    Confirm password <RedSpan>*</RedSpan>
                  </LabelFormWhite>
                  <Form.Item
                    style={formStyle}
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
                    <Input.Password
                      style={{ borderRadius: "2rem" }}
                      placeholder="input password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
              </RowSpaceBetween>
              <Button onClick={() => formSignUp.submit()} loading={clicked}>
                Submit
              </Button>
            </Form>
          </Else>
        </If>
        <Button type="primary">Test</Button>

        {response && (
          <Title level={5} className="text-center" style={{ color: textColor }}>
            {response}
          </Title>
        )}
      </SpacingDiv25X>
    </div>
  );
};
export default Auth;
