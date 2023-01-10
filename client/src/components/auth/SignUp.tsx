import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();
  const [statusCode, setStatusCode] = useState(0);
  const [message, setMessage] = useState("");

  const onFinish = async (values: any) => {
    setStatusCode(0);
    setMessage("");
    await axios
      .post("http://localhost:3030/api/auth/signup", values)
      .then(({ data: { message }, status }) => {
        setStatusCode(status);
        setMessage(message);
      })
      .catch(
        ({
          response: {
            data: { message },
            status,
          },
        }) => {
          setStatusCode(status);
          setMessage(message);
        },
      );
  };
  return (
    <>
      <Title>SIGN UP</Title>
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

        <Button onClick={() => form.submit()}>Submit</Button>
      </Form>
      {statusCode !== 0 && <p>Status: {statusCode}</p>}
      {message !== "" && <p>{message}</p>}
    </>
  );
};

export default SignUp;
