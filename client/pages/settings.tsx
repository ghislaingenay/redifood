import { Col, Form, Radio, Typography } from "antd";
import { useEffect } from "react";
import { RowSpaceAround } from "../src/components/styling/grid.styled";
import { useFood } from "../src/contexts/food.context";
import { ECurrency } from "../src/interfaces";
import { CenteredTitle, NoSpacingDivider, RediDivider, RoundedInput } from "../src/styles";
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
      <NoSpacingDivider />
      <CenteredTitle style={{ marginTop: 0 }} level={4}>
        User Information
      </CenteredTitle>
      <NoSpacingDivider />
      <Form
        style={{ margin: "2rem auto" }}
        form={userForm}
        onValuesChange={(e, all) => {
          console.log(e);
          handleUserInfo(all);
        }}
      >
        <Form.Item name="email" id="email" label="Email">
          <RoundedInput type="text" aria-label="email" style={{ width: "50%" }} />
        </Form.Item>
      </Form>
      <RediDivider />
      <NoSpacingDivider />
      <CenteredTitle style={{ marginTop: 0 }} level={4}>
        Global settings
      </CenteredTitle>
      <NoSpacingDivider />
      <Form
        style={{ margin: "2rem 0" }}
        form={settingsForm}
        layout="horizontal"
        onValuesChange={(e, all) => {
          console.log("all", all);
          handleSettingsInfo(all);
        }}
      >
        <RowSpaceAround>
          <Col span={11}>
            <Form.Item label="Show image" name="haveFoodPicture">
              <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodPicture(e.target.value as boolean)}>
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label="Show description" name="haveFoodDescription">
              <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodDescription(e.target.value as boolean)}>
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </RowSpaceAround>
      </Form>
    </>
  );
};

export default Settings;
