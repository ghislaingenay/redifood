import { Col, DatePicker, Form } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderHistoryCard from "../src/components/food-order/OrderHistoryCard";
import { RowCenter } from "../src/components/styling/grid.styled";
import { IOrder, ServerInfo } from "../src/interfaces";
import { mockOneOrder } from "../test/mocks/mockOrdersData";
import { buildLanguage } from "./api/build-language";

interface IHistoryProps {
  FoodOrderList: IOrder[];
}
const History = ({ FoodOrderList }: IHistoryProps) => {
  const { t } = useTranslation("");
  const [form] = Form.useForm();
  const [params, setParams] = useState({ startDate: undefined, endDate: undefined });

  return (
    <>
      <Head>
        <title>{t("history.head.title")}</title>
        <meta name="description" content={t("history.head.description") as any} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form
        form={form}
        labelWrap={false}
        layout="horizontal"
        onValuesChange={(_, all) => {
          console.log("all", all);
          const { startDate, endDate } = all;
          console.log(startDate, endDate);
          let startingDate: Date | undefined = undefined;
          let endingDate: Date | undefined = undefined;
          if (startDate) {
            startingDate = startDate["$d"];
          }
          if (endDate) {
            endingDate = endDate["$d"];
          }
          setParams(() => Object.assign({ params }, { startDate: startingDate, endDate: endingDate } as any));
        }}
      >
        <RowCenter style={{ margin: 0, height: "100%", padding: 0 }}>
          <Col span={11} style={{ margin: 0, height: "100%", padding: 0 }}>
            <Form.Item name="startDate" label={t("history.form-label.from")}>
              <DatePicker picker="date" />
            </Form.Item>
          </Col>
          <Col span={11} style={{ margin: 0, height: "100%", padding: 0 }}>
            <Form.Item name="endDate" label={t("history.form-label.to")}>
              <DatePicker picker="date" />
            </Form.Item>
          </Col>
        </RowCenter>
      </Form>
      {FoodOrderList.map((foodOrder: IOrder, index: number) => {
        return <OrderHistoryCard key={index} foodOrder={foodOrder} />;
      })}
    </>
  );
};

export default History;

export async function getServerSideProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      FoodOrderList: [mockOneOrder],
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
}
