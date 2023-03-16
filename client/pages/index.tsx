import { faCartShopping, faPenToSquare, faPlusCircle, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Space, Table, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { AlignType } from "rc-table/lib/interface";
import { useContext, useEffect, useState } from "react";
import { RediSelect } from "../src/components/RediSelect";
import { RediIconButton } from "../src/components/styling/Button.style";
import { RowSpaceAround, RowSpaceBetween } from "../src/components/styling/grid.styled";
import { BACKGROUND_COLOR } from "../src/constants";
import AppContext from "../src/contexts/app.context";
import { getOptions } from "../src/functions/global.fn";
import useCurrency from "../src/hooks/useCurrency.hook";
import { EButtonType, IOrder, ServerInfo } from "../src/interfaces";
import { allDataOrders, getListUnpaidOrders } from "../test/mocks/mockOrdersData";
import { buildLanguage } from "./api/build-language";

interface IAllOrdersPageProps {
  allOrders: IOrder[];
  getList: string[];
  status: string;
}
const AllOrdersPage = ({ allOrders, getList, status }: IAllOrdersPageProps) => {
  const { t } = useTranslation("");
  const { displayCurrency } = useCurrency();
  const { setStatus } = useContext(AppContext);

  const router = useRouter();
  const [listAllOrders] = useState(allOrders);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [spinLoading, setSpinLoading] = useState(true);
  const { Title } = Typography;

  const renderAmount = (orderTotal: number) => (displayCurrency() === "$" ? orderTotal : 0.85 * orderTotal);
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      align: "center" as AlignType,
    },
    {
      title: "Table",
      dataIndex: "tableNumber",
      key: "tableNumber",
      align: "center" as AlignType,
    },
    {
      title: ` ${t("glossary.amount")} (${displayCurrency()})`,
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center" as AlignType,
      render: (item: number) => renderAmount(item).toFixed(2),
    },
    {
      title: "Action",
      dataIndex: "_id",
      align: "center" as AlignType,
      key: "_id",
      render: (item: IOrder) => (
        <Space>
          <RediIconButton
            onClick={() => router.push(`/orders/${item._id}/edit`)}
            buttonType={EButtonType.EDIT}
            iconFt={faPenToSquare}
          >
            {t("buttons.edit")}
          </RediIconButton>
          <RediIconButton
            onClick={() => router.push(`/orders/${item._id}`)}
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
    // replace later by axios get
    setSelectedOption(option);
    if (option === "ALL") {
      return setFilteredOrders(listAllOrders);
    }
    const newList = listAllOrders.filter((order) => order._id === option);
    if (newList) {
      return setFilteredOrders(newList);
    }
  };

  useEffect(() => {
    setStatus(status);
    // data coming from backend
    const sortedData = allOrders.map((order: IOrder) => {
      return {
        ...order,
        key: order._id,
        orderTotal: renderAmount(order.orderTotal),
      };
    });
    setFilteredOrders(sortedData);
    setSpinLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedOption]);

  return (
    <>
      <Head>
        <title>{t("index.head.title")}</title>
        <meta name="description" content={t("index.head.description") as string} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        rowKey="_id"
        columns={columns}
        dataSource={filteredOrders}
        pagination={false}
        expandable={{
          expandedRowRender: (record: IOrder) => {
            return (
              <RowSpaceAround>
                {record.orderItems.map((item) => {
                  return (
                    <Col span={6} key={item.itemId} style={{ color: BACKGROUND_COLOR }}>
                      <b>
                        <Space>
                          <FontAwesomeIcon icon={faUtensils} />
                          {item.itemName}
                        </Space>
                      </b>{" "}
                      (<em>{item.itemQuantity}</em>)
                    </Col>
                  );
                })}
              </RowSpaceAround>
            );
          },
        }}
      />
    </>
  );
};

export default AllOrdersPage;

export async function getServerSideProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      allOrders: allDataOrders,
      getList: getListUnpaidOrders,
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
  // const url = "/api/orders";
  // await axios
  //   .get(url, { params: { selectedOption: "ALL" } })
  // .then((res) => {
  //   const {
  //     data: { allDataOrders, getListUnpaidOrders },
  //   } = res;
  //   return {
  //     props: { allOrders: allDataOrders, getList: getListUnpaidOrders, status: "success" },
  //   };
  // })
  // .catch((err) => {
  //   console.log("erre", err);
  // });
  // return {
  //   props: { allOrders: [], getList: [], status: "error" },
  // };
}
