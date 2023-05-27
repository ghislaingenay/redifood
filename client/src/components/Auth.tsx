import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { faRegistered, faSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Divider, Form, Input } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if";
import { toast } from "react-toastify";
import { AxiosFunction } from "../../pages/api/axios-request";
import whiteLogo from "../../public/redifood-logo-white.png";
import { EAuthChoice } from "../../src/interfaces/auth.interface";
import { checkDigit, checkLength, checkLower, checkSpecials, checkUpper } from "../functions/global.fn";
import { EButtonType } from "../interfaces";
import { SpacingDiv5X } from "../styles";
import { RedSpan } from "../styles/styledComponents/span.styled";
import { LabelFormWhite, RoundedInput } from "../styles/styledComponents/typography.styled";
import { RediButton } from "./styling/Button.style";
import RediRadioButton from "./styling/RediRadioButton";
import { RowCenter, RowSpaceBetween } from "./styling/grid.styled";

const Auth = () => {
  // ------------ CONSTANTS ---------
  const [formLogin] = Form.useForm();
  const [formSignUp] = Form.useForm();
  const [formSettings] = Form.useForm();
  const router = useRouter();
  // ------------ STATE ---------
  const { t } = useTranslation("common");
  const [showSettings, setShowSettings] = useState(false);
  const options = [
    {
      value: EAuthChoice.SIGNIN,
      label: t("auth.signin"),
      icon: <FontAwesomeIcon icon={faSign} />,
      ariaLabel: "sign in",
    },
    {
      value: EAuthChoice.REGISTER,
      label: t("auth.register"),
      icon: <FontAwesomeIcon icon={faRegistered} />,
      ariaLabel: "register",
    },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const [clicked, setClicked] = useState(false);
  const isDisabled = clicked ? true : false;

  const formStyle = { marginTop: "0.25rem" };
  // ------------ HANDLERS ---------

  const handleLogin = async (values: any) => {
    setClicked(true);
    await AxiosFunction({
      queryParams: {},
      url: "/api/auth/login",
      method: "post",
      body: values,
    })
      .then(() => {
        toast.success("Succesfully logged in !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch(() => {
        toast.error("Invalid  credentials !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setClicked(false);
        // console.log(err);
      });
  };

  const handleSignUp = async (values: any) => {
    setClicked(true);
    await AxiosFunction({
      queryParams: {},
      url: "/api/auth/signup",
      method: "post",
      body: values,
    })
      .then(() => {
        toast.success("Succesfully signed up !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch(() => {
        setClicked(false);
        toast.error("Invalid  credentials !", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  };

  const passwordRules = [
    {
      required: true,
      message: "Please input your password!",
    },
    () => ({
      validator(_: any, value: string) {
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
      validator(_: any, value: string) {
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

  const nameRules = (name: "first name" | "last name") => [
    {
      required: true,
      message: `Please input your ${name}!`,
    },
    {
      pattern: /^[a-zA-Z]+$/,
      message: `Please input a valid ${name}`,
    },
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
    <>
      <main>
        <div className="background-auth">
          <RowCenter style={{ paddingTop: "3rem" }}>
            <Image src={whiteLogo} alt="Redifood logo white" width={200} height={200} />
          </RowCenter>
          <SpacingDiv5X>
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
                <Form
                  form={formLogin}
                  layout="vertical"
                  onFinish={handleLogin}
                  style={{ backgroundColor: "transparent" }}
                >
                  <LabelFormWhite htmlFor="email-login">
                    {t("auth.email")} <RedSpan>*</RedSpan>
                  </LabelFormWhite>
                  <Form.Item name="email" id="email-login" rules={emailRules} style={formStyle}>
                    <RoundedInput type="text" aria-label="email" />
                  </Form.Item>
                  <LabelFormWhite htmlFor="pwd-login">
                    {t("auth.password")} <RedSpan>*</RedSpan>
                  </LabelFormWhite>
                  <Form.Item name="password" id="pwd-login" rules={passwordRules} style={formStyle}>
                    <Input.Password
                      aria-label="Password"
                      style={{ borderRadius: "2rem" }}
                      placeholder="input password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                  <RowSpaceBetween>
                    <Col span={6}>
                      <RediButton buttonType={EButtonType.SUCCESS} onClick={() => formLogin.submit()} loading={clicked}>
                        {t("auth.submit")}
                      </RediButton>
                    </Col>
                    <Col span={6}>
                      <Button loading={clicked} type="link" aria-label="Forgot password">
                        {t("auth.forget-password")}
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
                  <LabelFormWhite htmlFor="email-signup">
                    {t("auth.email")} <RedSpan>*</RedSpan>
                  </LabelFormWhite>
                  <Form.Item name="email" id="email-signup" rules={emailRules} style={formStyle}>
                    <RoundedInput type="text" aria-label="email" placeholder="Email..." />
                  </Form.Item>
                  <RowSpaceBetween>
                    <Col xs={24} md={11}>
                      <LabelFormWhite htmlFor="first-name">
                        {t("auth.first-name")} <RedSpan>*</RedSpan>
                      </LabelFormWhite>
                      <Form.Item name="firstName" id="first-name" rules={nameRules("first name")} style={formStyle}>
                        <RoundedInput type="text" aria-label="firstName" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <LabelFormWhite htmlFor="last-name">
                        {t("auth.last-name")} <RedSpan>*</RedSpan>
                      </LabelFormWhite>
                      <Form.Item name="lastName" id="last-name" rules={nameRules("last name")} style={formStyle}>
                        <RoundedInput type="text" aria-label="lastName" />
                      </Form.Item>
                    </Col>
                  </RowSpaceBetween>
                  <RowSpaceBetween>
                    <Col xs={24} md={11}>
                      <LabelFormWhite htmlFor="pwd-signup">
                        {t("auth.password")} <RedSpan>*</RedSpan>
                      </LabelFormWhite>
                      <Form.Item name="password" id="pwd-signup" rules={passwordRules} style={formStyle}>
                        <Input.Password
                          aria-label="Password"
                          style={{ borderRadius: "2rem" }}
                          placeholder="Password..."
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <LabelFormWhite htmlFor="c-pwd-signup">
                        {t("auth.confirm-password")}
                        <RedSpan>*</RedSpan>
                      </LabelFormWhite>
                      <Form.Item
                        id="c-pwd-signup"
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
                          aria-label="Confirm password"
                          style={{ borderRadius: "2rem" }}
                          placeholder="input password"
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                    </Col>
                  </RowSpaceBetween>
                  <RediButton
                    aria-label="Submit"
                    buttonType={EButtonType.SUCCESS}
                    onClick={() => formSignUp.submit()}
                    loading={clicked}
                  >
                    Submit
                  </RediButton>
                </Form>
              </Else>
            </If>
          </SpacingDiv5X>
        </div>
      </main>
    </>
  );
};
export default Auth;
