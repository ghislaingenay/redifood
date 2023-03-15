import { Col, Form, Radio, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { RowSpaceAround } from "../src/components/styling/grid.styled";
import { LanguageOptions, YesNoOptions } from "../src/constants";
import AppContext from "../src/contexts/app.context";
import { useFood } from "../src/contexts/food.context";
import { showProperLanguage } from "../src/functions/global.fn";
import { ECurrency, ELanguage } from "../src/interfaces";
import { CenteredTitle, NoSpacingDivider, RediDivider, RoundedInput } from "../src/styles";
import { buildLanguage, setCookieInformation } from "./api/build-language";
const { Title } = Typography;

const Settings = ({ language }) => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const {
    foodPictures: { setHaveFoodDescription, setHaveFoodPicture, haveFoodDescription, haveFoodPicture },
  } = useFood();
  const {
    setCurrency,
    setLanguage,
    state: { currency },
  } = useContext(AppContext);
  const [userForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const { showLanguageFrInfo, showLanguageEnInfo } = showProperLanguage(language, LanguageOptions);
  const { yes, no } = showProperLanguage(language, YesNoOptions);

  useEffect(() => {
    settingsForm.setFieldsValue({
      haveFoodDescription,
      haveFoodPicture,
      currency,
      language,
    });
  }, []);

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
      <Head>
        <title>{t("settings.head.title")}</title>
        <meta name="description" content={t("settings.head.description")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Title level={2}>{t("settings.head.title")}</Title>
        <NoSpacingDivider />
        <CenteredTitle style={{ marginTop: 0 }} level={4}>
          {t("settings.user-info")}
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
          {t("settings.global-settings")}
        </CenteredTitle>
        <NoSpacingDivider />
        <Form
          style={{ margin: "2rem 0" }}
          form={settingsForm}
          layout="horizontal"
          onValuesChange={(e: any, all: any) => {
            console.log("all", all);
            handleSettingsInfo(all);
          }}
        >
          <RowSpaceAround>
            <Col span={11}>
              <Form.Item label="Language" name="language">
                <Radio.Group
                  buttonStyle="solid"
                  onChange={(e) => {
                    console.log(e);
                    setLanguage(e.target.value as ELanguage);
                    setCookieInformation(e.target.value as ELanguage);
                    router.replace(`/${e.target.value}/settings`);
                  }}
                >
                  <Radio.Button value={ELanguage.ENGLISH}>{showLanguageEnInfo}</Radio.Button>
                  <Radio.Button value={ELanguage.FRENCH}>{showLanguageFrInfo}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label={t("settings.form-label.currency")} name="currency">
                <Radio.Group
                  buttonStyle="solid"
                  onChange={(e) => {
                    setCurrency(e.target.value as ECurrency);
                    localStorage.setItem("currency", e.target.value);
                  }}
                >
                  <Radio.Button value={ECurrency.USD}>$</Radio.Button>
                  <Radio.Button value={ECurrency.EUR}>€</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label={t("settings.form-label.show-image")} name="haveFoodPicture">
                <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodPicture(e.target.value as boolean)}>
                  <Radio.Button value={true}>{yes}</Radio.Button>
                  <Radio.Button value={false}>{no}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label={t("settings.form-label.show-image-description")} name="haveFoodDescription">
                <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodDescription(e.target.value as boolean)}>
                  <Radio.Button value={true}>{yes}</Radio.Button>
                  <Radio.Button value={false}>{no}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </RowSpaceAround>
        </Form>
      </main>
    </>
  );
};

export default Settings;

export async function getStaticProps({ locale, req }) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: { language: getLanguageValue, ...(await serverSideTranslations(getLanguageValue, ["settings"])) }, // will be passed to the page component as props
  };
}
