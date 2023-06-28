import { Alert, Col, DatePicker, Form, Pagination, Spin } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Case, Default, Switch } from "react-if";
import { IGetHistoryOrders, IOrderApi, IPagination } from "../redifood-module/src/interfaces";
import OrderHistoryCard from "../src/components/food-order/OrderHistoryCard";
import { RowCenter } from "../src/components/styling/grid.styled";
import { NotificationRes } from "../src/definitions/notification.class";
import { AnimToTop } from "../src/styles/animations/global.anim";
import { AxiosFunction } from "./api/axios-request";
import buildClient from "./api/build-client";
import { buildLanguage } from "./api/build-language";
// import useRequest from "./api/useRequest";

type THistoryProps = IGetHistoryOrders;

const History = ({ orders, meta }: THistoryProps) => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const [params, setParams] = useState({ startDate: undefined, endDate: undefined });

  // const { res, doRequest, loading } = useRequest<IOrder[]>({
  //   url: "/api/orders/paid",
  const [pagination, setPagination] = useState<IPagination>(meta);
  const [pageSize, setPageSize] = useState(20);

  const [allOrders, setAllOrders] = useState<IOrderApi<string>[]>(orders || []);
  const [loading, setLoading] = useState(false);

  const haveOrders = allOrders.length > 0;
  const isFetchWithOrders = haveOrders && !loading;
  const isFetchWithoutOrders = !haveOrders && !loading;

  useEffect(() => {
    AxiosFunction({
      url: "/api/orders/history",
      method: "get",
      queryParams: { params },
      body: {},
    })
      .then((res: IGetHistoryOrders) => {
        const { orders, meta } = res;
        setAllOrders(orders);
        setPagination(meta);
        setLoading(false);
      })
      .catch(() => {
        NotificationRes.onFailure({
          title: "Impossible to get paid orders list",
          description: "Please try again later",
          placement: "topRight",
        });
      });
  }, [params]);

  const handlePagination = (page: number, pageResults?: number) => {
    if (pageResults !== pageSize) {
      setParams(() => Object.assign({ params }, { page: 1, results: pageResults } as any));
      setPageSize(pageResults || 20);
    } else {
      setParams(() => Object.assign({ params }, { page, results: pageSize } as any));
    }
  };

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
          <Switch>
            <Case condition={loading}>
              <Spin size="large" />
            </Case>
            <Case condition={isFetchWithoutOrders}>
              <Alert message={t("history.alert-no-orders")} type="info" />
            </Case>
            <Case condition={isFetchWithOrders}>
              {allOrders.map((order, index: number) => {
                return <OrderHistoryCard key={index} order={order} />;
              })}
            </Case>
            <Default>
              <p>Forget to catch this error</p>
            </Default>
          </Switch>
          <Pagination
            onChange={(page, pageSize) => handlePagination(page, pageSize)}
            pageSize={pageSize}
            pageSizeOptions={["10", "20"]}
            current={pagination.page}
            total={pagination.total}
          />
        </AnimToTop>
      </main>
    </>
  );
};

export default History;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const client = buildClient(appContext);
  const getLanguageValue = buildLanguage(locale, req);
  const url = "/api/orders/history";
  const res = await client
    .get(url, { params: { page: 1, results: 20 } })
    .then(async (res) => {
      const {
        data: {
          results: { orders, meta },
        },
      } = res;
      return {
        props: {
          orders,
          meta,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          allOrders: [],
          getList: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });

  return res;
}
