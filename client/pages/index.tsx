import { faCartShopping, faPenToSquare, faPlusCircle, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Space, Table, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { IFoodOrder, IOrderApi } from "../redifood-module/src/interfaces";
import { RediSelect } from "../src/components/RediSelect";
import { RediIconButton } from "../src/components/styling/Button.style";
import { RowSpaceAround, RowSpaceBetween } from "../src/components/styling/grid.styled";
import { BACKGROUND_COLOR } from "../src/constants";
import { getOptions } from "../src/functions/global.fn";
import useCurrency from "../src/hooks/useCurrency.hook";
import { EButtonType } from "../src/interfaces";
import { AnimToTop } from "../src/styles/animations/global.anim";
import buildClient from "./api/build-client";
import { buildLanguage } from "./api/build-language";

interface IAllOrdersPageProps {
  allOrders: IOrderApi<IFoodOrder[]>[];
  getList: string[];
}
const AllOrdersPage = ({ allOrders, getList }: IAllOrdersPageProps) => {
  const { t } = useTranslation("common");
  const { displayCurrency } = useCurrency();

  const router = useRouter();

  const [listAllOrders] = useState(allOrders);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState<IOrderApi[]>([]);
  const [spinLoading, setSpinLoading] = useState(true);
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
    },
    {
      title: "Action",
      dataIndex: "id",
      align: "center" as AlignType,
      key: "id",
      render: (item: IOrderApi) => (
        <Space>
          <RediIconButton
            onClick={() => router.push(`/orders/${item.id}/edit`)}
            buttonType={EButtonType.EDIT}
            iconFt={faPenToSquare}
          >
            {t("buttons.edit")}
          </RediIconButton>
          <RediIconButton
            onClick={() => router.push(`/orders/${item.id}`)}
            iconFt={faCartShopping}
            buttonType={EButtonType.SUCCESS}
          >
            {t("buttons.pay")}
          </RediIconButton>
        </Space>
      ),
    },
  ];

  const showProperData = (option: string) => {
    setSelectedOption(option);
    if (option === "ALL") {
      return setFilteredOrders(listAllOrders);
    }
    const newList = listAllOrders.filter((order) => order?.orderNo === option);
    if (newList) {
      return setFilteredOrders(newList);
    }
  };

  useEffect(() => {
    const sortedData = allOrders.map((order: IOrderApi) => {
      return {
        ...order,
        key: order.id,
        orderTotal: order.orderTotal,
      };
    });
    setFilteredOrders(sortedData);
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
                onChange={(e: any) => showProperData(e)}
                options={getOptions(getList)}
              />
            </Col>
            <Col span={11} style={{ textAlign: "right" }}>
              <RediIconButton
                shape="round"
                buttonType={EButtonType.CREATE}
                aria-label="create order"
                iconFt={faPlusCircle}
                onClick={() => router.push("/orders/create")}
              >
                {t("index.orderButton")}
              </RediIconButton>
            </Col>
          </RowSpaceBetween>
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
        </AnimToTop>
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
      console.log("allorders", orders);
      console.log("listing", unPaidOrdersNo);
      const updatedListing = unPaidOrdersNo.unshift("ALL");
      return {
        props: {
          allOrders: orders,
          getList: updatedListing,
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
