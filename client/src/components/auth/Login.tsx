import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { IPropsAuth } from "../../interfaces/auth.interface";
const { Title } = Typography;
const Login = (props: IPropsAuth) => {
  const { setButtonWasClicked } = props;
  const [form] = Form.useForm();
  const [statusCode, setStatusCode] = useState(0);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onFinish = async (values: any) => {
    setButtonWasClicked(true);
    setStatusCode(0);
    setMessage("");
    setErrorMessage("");
    console.log("Success:", values);
    await axios
      .post("http://localhost:3030/api/auth/login", values)
      .then(({ data: { message }, status }) => {
        setStatusCode(status);
        setMessage(message);
      })
      .catch(
        ({
          response: {
            data: { message, errorMessage },
            status,
          },
        }) => {
          console.log("hey", errorMessage);
          setErrorMessage(errorMessage);
          setStatusCode(status);
          setMessage(message);
          setButtonWasClicked(false);
        },
      );
  };
  return (
    <>
      <Title>LOGIN</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
        <Button onClick={() => form.submit()}>Submit</Button>
      </Form>
      {statusCode !== 0 && <p>Status: {statusCode}</p>}
      {message !== "" && <p>{message}</p>}
      {errorMessage !== "" && <p>{errorMessage}</p>}
    </>
  );
};

export default Login;
