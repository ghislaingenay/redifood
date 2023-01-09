import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();
  const [statusCode, setStatusCode] = useState(0);
  const [message, setMessage] = useState("");
  const passwordValue = Form.useWatch("password", form);

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
      <Title>Sign up page</Title>
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
            () => ({
              validator(_, value) {
                // regex only . _ - are allowed
                if (typeof value === "undefined" || value === null) {
                  return Promise.reject(new Error("Please input your username!"));
                }
                return Promise.resolve();
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
            { min: 8, message: "password should contains between 8 to 20 characters" },
            { max: 20, message: "password should contains between 8 to 20 characters" },
            () => ({
              validator(_, value) {
                if (/\d/.test(value)) {
                  // regex at least one lowercase
                  // regex at least one uppercase
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error("password must contain at least one number"));
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
        {passwordValue && (
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
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
        )}
        <Button onClick={() => form.submit()}>Submit</Button>
      </Form>
      {statusCode !== 0 && <p>Status: {statusCode}</p>}
      {message !== "" && <p>{message}</p>}
    </>
  );
};

export default SignUp;
