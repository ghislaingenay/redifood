import { Col, Form, Radio, Typography } from "antd";
import { FormLabelAlign } from "antd/es/form/interface";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { RowSpaceAround } from "../src/components/styling/grid.styled";
import AppContext from "../src/contexts/app.context";
import { useFood } from "../src/contexts/food.context";
import { ECurrency, ELanguage, ServerInfo } from "../src/interfaces";
import { CenteredTitle, NoSpacingDivider, RediDivider, RoundedInput, RoundedInputNum } from "../src/styles";
import { AnimToTop } from "../src/styles/animations/global.anim";
import { buildLanguage, setCookieInformation } from "./api/build-language";
const { Title } = Typography;

interface ISettingsProps {
  language: ELanguage;
}
const Settings = ({ language }: ISettingsProps) => {
  const { t } = useTranslation("");
  const router = useRouter();
  const {
    foodPictures: { setHaveFoodDescription, setHaveFoodPicture, haveFoodDescription, haveFoodPicture },
  } = useFood();
  const {
    setCurrency,
    setLanguage,
    setVaT,
    state: { currency, vat },
  } = useContext(AppContext);
  const [userForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  useEffect(() => {
    settingsForm.setFieldsValue({
      haveFoodDescription,
      haveFoodPicture,
      currency,
      language,
      vat,
    });
  }, []);

  interface ISettings {
    email: string;
    displayFoodDescription: boolean;
    displayFoodImage: boolean;
    language: string;
    currency: ECurrency;
    vat: number;
  }
  const handleUserInfo = (values: Pick<ISettings, "email">) => {
    console.log(values);
  };

  const handleSettingsInfo = (values: Omit<ISettings, "email">) => {
    console.log(values);
  };

  // const [settingsParams, setSettingsParams] = useState<Partial<Omit<ISettings, "email">>>(
  //   settingsForm.getFieldsValue(),
  // );

  // const { res, doRequest, loading } = useRequest<Omit<ISettings, "email">>({
  //   url: "/api/settings",
  //   method: "post",
  //   body: {},
  //   queryParams: {},
  // });

  // const loadData = async () => {
  //   await doRequest();
  //   settingsForm.setFieldsValue(res);
  // };

  // useEffect(() => {
  //   loadData();
  // }, [settingsParams]);

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
        <link rel="icon" href="/favicon.ico" />
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
          {/* {loading ? (
            <Spin />
          ) : ( */}
          <Form
            style={{ margin: "2rem 0" }}
            form={settingsForm}
            layout="horizontal"
            onValuesChange={(_, all: any) => {
              console.log("all", all);
              handleSettingsInfo(all);
              // setSettingsParams(all);
            }}
          >
            <RowSpaceAround>
              <Col {...colSettingsSpan}>
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
              </Col>
              <Col {...colSettingsSpan}>
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
              </Col>
              <Col {...colSettingsSpan}>
                <Form.Item label={t("settings.form-label.show-image")} name="haveFoodPicture" {...formItemLayout}>
                  <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodPicture(e.target.value as boolean)}>
                    <Radio.Button value={true}>{t("glossary.yes")}</Radio.Button>
                    <Radio.Button value={false}>{t("glossary.no")}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col {...colSettingsSpan}>
                <Form.Item
                  label={t("settings.form-label.show-image-description")}
                  name="haveFoodDescription"
                  {...formItemLayout}
                >
                  <Radio.Group buttonStyle="solid" onChange={(e) => setHaveFoodDescription(e.target.value as boolean)}>
                    <Radio.Button value={true}>{t("glossary.yes")}</Radio.Button>
                    <Radio.Button value={false}>{t("glossary.no")}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col {...colSettingsSpan}>
                <Form.Item label={t("settings.form-label.vat")} name="vat" {...formItemLayout}>
                  <RoundedInputNum
                    onChange={(e) => {
                      console.log(e);
                      if (e && typeof e !== "undefined") {
                        setVaT(Number(e));
                      } else {
                        setVaT(0);
                      }
                    }}
                    type="number"
                    minLength={1}
                    aria-label="vat"
                    style={{ width: "50%" }}
                  />
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

export async function getStaticProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: { language: getLanguageValue, ...(await serverSideTranslations(getLanguageValue, ["common"])) }, // will be passed to the page component as props
  };
  // const url = "/api/settings/:userid";
  // await axios
  //   .get(url)
  //   .then(async (res) => {
  //     const {
  //       data: { results: {settingsInfo} },
  //     } = res;
  //     return {
  //       props: {  settings: settingsInfo,  status: "success", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log("erre", err);
  //   });
  // return {
  //   props: {  settings: {},status: "error", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  // };
}

// /api/auth/currentuser
