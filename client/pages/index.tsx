import { faCartShopping, faPenToSquare, faPlusCircle, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Col, Form, InputNumber, Modal, Space, Table, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IFoodOrder, IGetServerSideData, IOrderApi } from "../redifood-module/src/interfaces";
import { RediSelect } from "../src/components/RediSelect";
import { RediIconButton } from "../src/components/styling/Button.style";
import { RowCenterSp, RowSpaceAround, RowSpaceBetween } from "../src/components/styling/grid.styled";
import { BACKGROUND_COLOR } from "../src/constants";
import { getOptions } from "../src/functions/global.fn";
import useCurrency from "../src/hooks/useCurrency.hook";
import { EButtonType } from "../src/interfaces";
import { LabelFormBlack } from "../src/styles";
import { AnimToTop } from "../src/styles/animations/global.anim";
import { AxiosFunction } from "./api/axios-request";
import buildClient from "./api/build-client";
import { buildLanguage } from "./api/build-language";

interface IAllOrdersPageProps {
  allOrders: IOrderApi<IFoodOrder[]>[];
  getList: string[];
}
const AllOrdersPage = ({ allOrders, getList }: IAllOrdersPageProps) => {
  const { t } = useTranslation("common");
  const { displayCurrency } = useCurrency();
  const haveOrders = allOrders.length > 0;
  const [tableForm] = Form.useForm();
  const tableValue = Form.useWatch("tableNumber", tableForm);

  const router = useRouter();

  const [orderNoList] = useState(getList);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState<IOrderApi[]>([]);
  const [spinLoading, setSpinLoading] = useState(true);
  const [tableTakenList, setTableTakenList] = useState<number[]>([]);
  const [viewTableNumberModal, setViewTableNumberModal] = useState(false);
  const { Title } = Typography;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "No",
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center" as AlignType,
    },
    {
      title: "Table",
      dataIndex: "orderTableNumber",
      key: "orderTableNumber",
      align: "center" as AlignType,
    },
    {
      title: ` ${t("glossary.amount")} (${displayCurrency()})`,
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center" as AlignType,
      render: (amount: IOrderApi["orderTotal"]) => <>{Number(amount).toFixed(2)}</>,
    },
    {
      title: "Action",
      dataIndex: "id",
      align: "center" as AlignType,
      key: "id",
      render: (item: IOrderApi) => (
        <Space>
          <RediIconButton
            onClick={() => router.push(`/orders/${item}/edit`)}
            buttonType={EButtonType.EDIT}
            iconFt={faPenToSquare}
          >
            {t("buttons.edit")}
          </RediIconButton>
          <RediIconButton
            onClick={() => router.push(`/orders/${item}`)}
            iconFt={faCartShopping}
            buttonType={EButtonType.SUCCESS}
          >
            {t("buttons.pay")}
          </RediIconButton>
        </Space>
      ),
    },
  ];

  const getTakenTableNumber = async () => {
    AxiosFunction({
      method: "get",
      url: "api/orders/table",
      body: {},
      queryParams: {},
    })
      .then((res: IGetServerSideData<number[]>) => {
        const { results } = res;
        results && setTableTakenList(results);
      })
      .catch(() => toast.error("Error getting table number"));
  };

  const removeTableNumberModal = () => {
    tableForm.resetFields();
    setViewTableNumberModal(false);
  };

  const option = useMemo(() => {
    return selectedOption;
  }, [selectedOption]);

  useEffect(() => {
    setSpinLoading(true);
    getTakenTableNumber();
    const sortedData = [...allOrders].map((order: IOrderApi) => {
      return {
        ...order,
        key: order.id,
        orderTotal: order.orderTotal,
      };
    });
    if (selectedOption === "ALL") {
      console.log("here");
      setFilteredOrders(() => sortedData);
    } else {
      const newList = [...sortedData].filter((order) => order?.orderNo === option);
      console.log("nl", newList);
      setFilteredOrders(() => newList);
    }
    setSpinLoading(false);
  }, [selectedOption]);

  return (
    <>
      <Head>
        <title>{t("index.head.title")}</title>
        <meta name="description" content={t("index.head.description") as string} />
      </Head>
      <main>
        <AnimToTop>
          <Title level={2} aria-label="List of all orders">
            {t("index.title")}
          </Title>
          <RowSpaceBetween gutter={10} style={{ marginBottom: "1rem" }}>
            <Col span={12}>
              <RediSelect
                initialOption={{ value: "ALL", label: t("glossary.all") }}
                style={{ width: "8rem" }}
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e as string);
                }}
                options={getOptions(orderNoList)}
              />
            </Col>
            <Col span={11} style={{ textAlign: "right" }}>
              <RediIconButton
                shape="round"
                buttonType={EButtonType.CREATE}
                aria-label="create order"
                iconFt={faPlusCircle}
                onClick={() => setViewTableNumberModal(true)}
              >
                {t("index.orderButton")}
              </RediIconButton>
            </Col>
          </RowSpaceBetween>
          {haveOrders ? (
            <>
              <Table
                loading={spinLoading}
                rowKey="id"
                columns={columns}
                dataSource={filteredOrders}
                pagination={false}
                expandable={{
                  expandedRowRender: (record: IOrderApi<IFoodOrder[]>) => {
                    return (
                      <RowSpaceAround>
                        {record.orderItems.map(({ id, itemName, itemQuantity }) => {
                          return (
                            <Col span={6} key={id} style={{ color: BACKGROUND_COLOR }}>
                              <b>
                                <Space>
                                  <FontAwesomeIcon icon={faUtensils} />
                                  {itemName}
                                </Space>
                              </b>{" "}
                              (<em>{itemQuantity}</em>)
                            </Col>
                          );
                        })}
                      </RowSpaceAround>
                    );
                  },
                }}
              />
            </>
          ) : (
            <>
              <Alert type="info" style={{ width: "100%", textAlign: "center" }} showIcon message="No orders found" />
            </>
          )}
        </AnimToTop>
        <Modal open={viewTableNumberModal} footer={false} onCancel={() => removeTableNumberModal()} centered>
          <Form form={tableForm} onFinish={() => router.push(`/orders/create/${tableValue}`)}>
            <RowSpaceBetween style={{ width: "100%" }}>
              <Col span={12}>
                <LabelFormBlack>Table no</LabelFormBlack>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name="tableNumber"
                  rules={[
                    { required: true, message: "Please input table number" },
                    {
                      pattern: /^\d+$/,
                      message: "Please input only number",
                    },
                    () => ({
                      validator(_, value) {
                        const tableNumberIsAlreadyTaken = value && tableTakenList.includes(Number(value));
                        if (tableNumberIsAlreadyTaken) return Promise.reject(new Error("Table number already taken"));
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </RowSpaceBetween>
            <RowCenterSp style={{ marginTop: "1rem" }}>
              <RediIconButton buttonType={EButtonType.CREATE} iconFt={faPlusCircle} onClick={() => tableForm.submit()}>
                {t("buttons.create")}
              </RediIconButton>
            </RowCenterSp>
          </Form>
        </Modal>
      </main>
    </>
  );
};

export default AllOrdersPage;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const client = buildClient(appContext);
  const getLanguageValue = buildLanguage(locale, req);
  const url = "/api/orders/";
  const res = await client
    .get(url, { params: { orderType: "NOT_PAID" } })
    .then(async (res) => {
      const {
        data: {
          results: { orders, unPaidOrdersNo },
        },
      } = res;
      const listingStringFormat = [];
      for (let i = 0; i < unPaidOrdersNo.length; i++) listingStringFormat.push(String(unPaidOrdersNo[i]));
      return {
        props: {
          allOrders: orders,
          getList: listingStringFormat,
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
