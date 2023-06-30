import { Alert, Col, DatePicker, Form, Pagination, Spin } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Case, Default, Else, If, Switch, Then } from "react-if";
import { toast } from "react-toastify";
import { IGetHistoryOrders, IOrderApi, IPagination, TGetHistoryParams } from "../redifood-module/src/interfaces";
import OrderHistoryCard from "../src/components/food-order/OrderHistoryCard";
import { RowCenter } from "../src/components/styling/grid.styled";
import { DATE_FORMAT_WITHOUT_TIME } from "../src/constants";
import { NotificationRes } from "../src/definitions/notification.class";
import { AnimToTop } from "../src/styles/animations/global.anim";
import { AxiosFunction } from "./api/axios-request";
import { buildLanguage } from "./api/build-language";

type TDateFormat = dayjs.Dayjs | undefined | string;

const History = ({}) => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const PAGE_SIZE_OPTIONS = ["10", "20"];

  const [params, setParams] = useState<TGetHistoryParams>({
    startDate: undefined,
    endDate: undefined,
    results: 20,
    page: 1,
  });

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    results: 20,
    total: 0,
    pages: 1,
  });
  const [pageSize, setPageSize] = useState(20);
  const [allOrders, setAllOrders] = useState<IOrderApi<string>[]>([]);
  const [loading, setLoading] = useState(false);

  const haveOrders = allOrders?.length > 0;
  const isFetchWithOrders = haveOrders && !loading;
  const isFetchWithoutOrders = !haveOrders && !loading;
  const selectedPage = pagination?.page || 1;
  const totalResults = pagination?.total || 0;
  const showPagination = totalResults > pageSize;

  useEffect(() => {
    setLoading(true);
    AxiosFunction({
      url: "/api/orders/history",
      method: "get",
      queryParams: { ...params },
      body: {},
    })
      .then((res) => {
        const { results } = res;
        const { orders, meta } = results as IGetHistoryOrders;
        orders && setAllOrders(orders);
        meta && setPagination(meta);
        setLoading(false);
      })
      .catch(() => {
        NotificationRes.onFailure({
          title: "Impossible to get paid orders list",
          description: "Please try again later",
          placement: "topRight",
        });
        setLoading(false);
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

  const verifyForm = (dates: { startDate: any; endDate: any }) => {
    let startingDate: TDateFormat = dates.startDate;
    let endingDate: TDateFormat = dates.endDate;
    if (startingDate) startingDate = dayjs(startingDate).format(DATE_FORMAT_WITHOUT_TIME);
    if (endingDate) endingDate = dayjs(endingDate).format(DATE_FORMAT_WITHOUT_TIME);
    if (moment(startingDate).isAfter(endingDate)) {
      form.resetFields();
      setParams({ ...params, startDate: undefined, endDate: undefined });
      toast.error("Start date cannot be after end date");
    }
    return { startDate: startingDate, endDate: endingDate };
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
              const updatedDates = verifyForm(all);
              setParams({ ...params, ...updatedDates });
            }}
          >
            <RowCenter style={{ margin: 0, height: "100%", padding: 0 }}>
              <Col span={11} style={{ margin: 0, height: "100%", padding: 0 }}>
                <Form.Item name="startDate" label={t("history.form-label.from")}>
                  <DatePicker showToday showNow format={DATE_FORMAT_WITHOUT_TIME} />
                </Form.Item>
              </Col>
              <Col span={11} style={{ margin: 0, height: "100%", padding: 0 }}>
                <Form.Item name="endDate" label={t("history.form-label.to")}>
                  <DatePicker showToday showNow format={DATE_FORMAT_WITHOUT_TIME} />
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
              {allOrders?.map((order, index: number) => {
                return <OrderHistoryCard key={index} order={order} />;
              })}
            </Case>
            <Default>
              <p>Forget to catch this error</p>
            </Default>
          </Switch>
          <If condition={showPagination}>
            <Then>
              <Pagination
                style={{ marginTop: "1rem" }}
                onChange={(page, pageSize) => handlePagination(page, pageSize)}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                current={selectedPage}
                total={totalResults}
              />
            </Then>
            <Else></Else>
          </If>
        </AnimToTop>
      </main>
    </>
  );
};

export default History;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
}
