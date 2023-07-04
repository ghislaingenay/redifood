import { Col, Form, Radio, Typography } from "antd";
import { FormLabelAlign } from "antd/es/form/interface";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { ISettingsApi, PartialUserInfo, UserInfo } from "../redifood-module/src/interfaces";
import { RowSpaceAround } from "../src/components/styling/grid.styled";
import AppContext from "../src/contexts/app.context";
import { useFood } from "../src/contexts/food.context";
import { CenteredTitle, NoSpacingDivider, RediDivider, RoundedInput, RoundedInputNum } from "../src/styles";
import { AnimToTop } from "../src/styles/animations/global.anim";
import buildClient from "./api/build-client";
import { buildLanguage } from "./api/build-language";
import { handleUpdateUserInformation, handleUpdateUserSettings } from "./api/setting-api";
const { Title } = Typography;

interface ISettingsProps {
  settingsInformation: ISettingsApi;
  userInformation: UserInfo;
}
const Settings = ({ settingsInformation, userInformation }: ISettingsProps) => {
  const { language, haveFoodImage, vat, currency } = settingsInformation;
  const { email, firstName, lastName } = userInformation;
  const { t } = useTranslation("common");
  const {
    foodPictures: { setHaveFoodPicture },
  } = useFood();
  const { setCurrency, setLanguage, setVaT } = useContext(AppContext);
  const [userForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const [userInfo, setUserInfo] = useState<PartialUserInfo>({
    firstName: "",
    lastName: "",
  });

  const [settingInfo, setSettingInfo] = useState<Pick<ISettingsApi, "vat" | "haveFoodImage">>({
    haveFoodImage: haveFoodImage,
    vat: vat,
  });

  const debounceUser = useDebounce(userInfo, 5000);
  const debounceSettings = useDebounce(settingInfo, 5000);

  useEffect(() => {
    setHaveFoodPicture(haveFoodImage);
    settingsForm.setFieldsValue({
      haveFoodImage,
      currency,
      language,
      vat,
    });
    setCurrency(currency);
    setLanguage(language);
    setVaT(vat);
    setUserInfo({ firstName, lastName });
    setSettingInfo({ haveFoodImage, vat });
    userForm.setFieldsValue({
      email,
      firstName,
      lastName,
    });
  }, []);

  const haveEmptyFields = <T extends any>(obj: T): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((val) => val === "" || val === null || val === undefined);
  };

  const isValidData = <T extends any>(debounce: T): boolean => debounce && !haveEmptyFields<T>(debounce);

  useEffect(() => {
    if (!isValidData(debounceUser)) return;
    handleUpdateUserInformation(debounceUser);
  }, [debounceUser]);

  useEffect(() => {
    if (!isValidData(debounceSettings)) return;
    handleUpdateUserSettings(debounceSettings);
  }, [debounceSettings]);

  const colSettingsSpan = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };
  const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
    labelAlign: "left" as FormLabelAlign,
  };
  return (
    <>
      <Head>
        <title>{t("settings.head.title")}</title>
        <meta name="description" content={t("settings.head.description") as string} />
      </Head>
      <main>
        <AnimToTop>
          <Title level={2}>{t("settings.head.title")}</Title>
          <NoSpacingDivider />
          <CenteredTitle style={{ marginTop: 0 }} level={4}>
            {t("settings.user-info")}
          </CenteredTitle>
          <NoSpacingDivider />
          <Form
            labelWrap={false}
            layout="horizontal"
            style={{ margin: "2rem auto" }}
            form={userForm}
            onValuesChange={(_, all) => setUserInfo({ firstName: all.firstName, lastName: all.lastName })}
          >
            <Form.Item name="email" id="email" label="Email">
              <RoundedInput type="text" aria-label="email" style={{ width: "50%" }} disabled />
            </Form.Item>
            <Form.Item name="firstName" id="firstName" label="First name">
              <RoundedInput type="text" aria-label="firstName" style={{ width: "50%" }} />
            </Form.Item>
            <Form.Item name="lastName" id="lastName" label="Last name">
              <RoundedInput type="text" aria-label="lastName" style={{ width: "50%" }} />
            </Form.Item>
          </Form>
          <RediDivider />
          <NoSpacingDivider />
          <CenteredTitle style={{ marginTop: 0 }} level={4}>
            {t("settings.global-settings")}
          </CenteredTitle>
          <NoSpacingDivider />
          {/* {loading ? (
            <Spin />
          ) : ( */}
          <Form
            style={{ margin: "2rem 0" }}
            form={settingsForm}
            layout="horizontal"
            onValuesChange={(_, all: any) => {
              console.log("all", all);
              setSettingInfo({ haveFoodImage: all.haveFoodImage, vat: all.vat || 0 });
              // setSettingsParams(all);
            }}
          >
            <RowSpaceAround>
              {/* <Col {...colSettingsSpan}>
                <Form.Item label="Language" name="language" {...formItemLayout}>
                  <Radio.Group
                    buttonStyle="solid"
                    onChange={(e) => {
                      console.log(e);
                      setLanguage(e.target.value as ELanguage);
                      setCookieInformation(e.target.value as ELanguage);
                      router.replace(`/${e.target.value}/settings`);
                    }}
                  >
                    <Radio.Button value={ELanguage.ENGLISH}>{t("settings.form-values.english")}</Radio.Button>
                    <Radio.Button value={ELanguage.FRENCH}>{t("settings.form-values.french")}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col> */}
              {/* <Col {...colSettingsSpan}>
                <Form.Item label={t("settings.form-label.currency")} name="currency" {...formItemLayout}>
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
              </Col> */}
              <Col {...colSettingsSpan}>
                <Form.Item label={t("settings.form-label.show-image")} name="haveFoodImage" {...formItemLayout}>
                  <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodPicture(e.target.value as boolean)}>
                    <Radio.Button value={true}>{t("glossary.yes")}</Radio.Button>
                    <Radio.Button value={false}>{t("glossary.no")}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col {...colSettingsSpan}>
                <Form.Item label={t("settings.form-label.vat")} name="vat" {...formItemLayout}>
                  <RoundedInputNum type="number" minLength={1} aria-label="vat" style={{ width: "50%" }} />
                </Form.Item>
              </Col>
              <Col {...colSettingsSpan}></Col>
            </RowSpaceAround>
          </Form>
          {/* )} */}
        </AnimToTop>
      </main>
    </>
  );
};

export default Settings;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const client = buildClient(appContext);
  const getLanguageValue = buildLanguage(locale, req);
  const url = "/api/settings/user";
  const res = await client
    .get(url)
    .then(async (res) => {
      const {
        data: {
          results: { settings, user },
        },
      } = res;
      return {
        props: {
          settingsInformation: settings,
          userInformation: user,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          settingsInformation: [],
          userInformation: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });

  return res;
}
