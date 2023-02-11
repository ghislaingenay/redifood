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
import { checkDigit, checkLength, checkLower, checkSpecials, checkUpper } from "../functions/global.fn";
import { EButtonType } from "../interfaces";
import { SpacingDiv25X } from "../styles/styledComponents/div.styled";
import { RedSpan } from "../styles/styledComponents/span.styled";
import { LabelFormWhite, RoundedInput } from "../styles/styledComponents/typography.styled";
import { RediButton } from "./styling/Button.style";
import { RowCenter, RowSpaceBetween } from "./styling/grid.styled";
import RediRadioButton from "./styling/RediRadioButton";

const Auth = () => {
  // ------------ CONSTANTS ---------
  const [formLogin] = Form.useForm();
  const [formSignUp] = Form.useForm();
  const router = useRouter();
  // ------------ STATE ---------

  const options = [
    { value: EAuthChoice.SIGNIN, label: "SIGN IN", icon: <FontAwesomeIcon icon={faSign} /> },
    { value: EAuthChoice.REGISTER, label: "REGISTER", icon: <FontAwesomeIcon icon={faRegistered} /> },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const [clicked, setClicked] = useState(false);
  const isDisabled = clicked ? true : false;

  const formStyle = { marginTop: "0.25rem" };
  // ------------ HANDLERS ---------

  const handleLogin = async (values: any) => {
    console.log("clicked login", values);
    setClicked(true);
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
    setClicked(true);
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
        if (checkLength(value) && checkSpecials(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject(
            new Error(
              "password should contains between 8 to 20 characters and must contains at least one special character (!@#$%^&()*_)",
            ),
          );
        }
      },
    }),
    () => ({
      validator(_, value) {
        if (checkUpper(value) && checkLower(value) && checkDigit(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject(
            new Error("password must contain at least one digit, one lowercase and uppercase letter"),
          );
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
            haveIcon="false"
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
                  <RediButton buttonType={EButtonType.SUCCESS} onClick={() => formLogin.submit()} loading={clicked}>
                    Submit
                  </RediButton>
                </Col>
                <Col span={6}>
                  <Button loading={clicked} type="link">
                    Forgot password
                  </Button>
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
              <RediButton buttonType={EButtonType.SUCCESS} onClick={() => formSignUp.submit()} loading={clicked}>
                Submit
              </RediButton>
            </Form>
          </Else>
        </If>
      </SpacingDiv25X>
    </div>
  );
};
export default Auth;
