import { Form, Radio, Typography } from "antd";
import { useEffect } from "react";
import { useFood } from "../src/contexts/food.context";
import { ECurrency } from "../src/interfaces";
import { LabelFormBlack, RoundedInput } from "../src/styles";
const { Title } = Typography;

const Settings = () => {
  const {
    foodPictures: { setHaveFoodDescription, setHaveFoodPicture, haveFoodDescription, haveFoodPicture },
  } = useFood();
  const [userForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  useEffect(() => {
    settingsForm.setFieldsValue({
      haveFoodDescription,
      haveFoodPicture,
    });
  });

  interface ISettings {
    email: string;
    displayFoodDescription: boolean;
    displayFoodImage: boolean;
    language: string;
    currency: ECurrency;
  }
  const handleUserInfo = (values: Pick<ISettings, "email">) => {
    console.log(values);
  };

  const handleSettingsInfo = (values: Omit<ISettings, "email">) => {
    console.log(values);
  };
  return (
    <>
      <Title level={2}>SETTINGS</Title>
      <Form
        form={userForm}
        onValuesChange={(e, all) => {
          console.log(e);
          handleUserInfo(all);
        }}
      >
        <LabelFormBlack htmlFor="email">Email</LabelFormBlack>
        <Form.Item name="email" id="email">
          <RoundedInput type="text" aria-label="email" />
        </Form.Item>
      </Form>
      <Form
        form={settingsForm}
        onValuesChange={(e, all) => {
          console.log("all", all);
          handleSettingsInfo(all);
        }}
      >
        <Form.Item label="Show image" name="haveFoodPicture">
          <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodPicture(e.target.value as boolean)}>
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Show description" name="haveFoodDescription">
          <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodDescription(e.target.value as boolean)}>
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
};

export default Settings;
