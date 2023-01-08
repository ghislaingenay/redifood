import { Button, Form, Input, Typography } from "antd";
const { Title } = Typography;
const Login = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  return (
    <>
      <Title>Login page</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(e, all) => {
          console.log(e);
          console.log(all);
        }}
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
    </>
  );
};

export default Login;
