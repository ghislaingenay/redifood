import { Col, DatePicker, Form } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderHistoryCard from "../src/components/food-order/OrderHistoryCard";
import { RowCenter } from "../src/components/styling/grid.styled";
import { IOrder, ServerInfo } from "../src/interfaces";
import { AnimToTop } from "../src/styles/animations/global.anim";
import { mockOneOrder } from "../test/mocks/mockOrdersData";
import { buildLanguage } from "./api/build-language";
// import useRequest from "./api/useRequest";

interface IHistoryProps {
  FoodOrderList: IOrder[];
}
const History = ({ FoodOrderList }: IHistoryProps) => {
  const { t } = useTranslation("");
  const [form] = Form.useForm();
  const [params, setParams] = useState({ startDate: undefined, endDate: undefined });

  const [
    paidOrdersList,
    // , setPaidOrdersList
  ] = useState(FoodOrderList);

  // const { res, doRequest, loading } = useRequest<IOrder[]>({
  //   url: "/api/orders/paid",
  //   method: "get",
  //   queryParams: params,
  //   body: {},
  // });

  // const loadData = async () => {
  //   await doRequest();
  //   if (res) {
  //     setPaidOrdersList(res);
  //   }
  // };

  // useEffect(() => {
  //   loadData();
  // }, [params]);

  return (
    <>
      <Head>
        <title>{t("history.head.title")}</title>
        <meta name="description" content={t("history.head.description") as any} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AnimToTop>
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
          {/* <Switch>
            <Case condition={loading}>
              <p>{t("glossary.loading")}</p>
            </Case>
            <Case condition={!loading && paidOrdersList.length === 0}>
              <Alert message={t("history.alert-no-orders")} type="info" />
            </Case>
            <Case condition={!loading && paidOrdersList.length > 0}> */}
          {paidOrdersList.map((foodOrder: IOrder, index: number) => {
            return <OrderHistoryCard key={index} foodOrder={foodOrder} />;
          })}
          {/* </Case>
          </Switch>  */}
        </AnimToTop>
      </main>
    </>
  );
};

export default History;

export async function getStaticProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      FoodOrderList: [mockOneOrder],
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
  // const url = "/api/orders/paid";
  // await axios
  //   .get(url, params: { startDate: undefined, endDate: undefined }})
  //   .then(async (res) => {
  //     const {
  //       data: { results: {paidOrders} },
  //     } = res;
  //     return {
  //       props: { paidOrders: paidOrders, status: "success", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
  // return {
  //   props: { paidOrders: [], status: "error", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  // };
}
