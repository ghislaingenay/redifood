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
import { EButtonType, ECurrency, IOrder } from "../src/interfaces";
import { allDataOrders, getListUnpaidOrders } from "../test/mocks/mockOrdersData";

const AllOrdersPage = ({ allOrders, getList, status }) => {
  const { t } = useTranslation("");
  const { convertPrice } = useCurrency({ currency: ECurrency.USD });
  const appValue = useContext(AppContext);
  appValue.setStatus(status);
  const router = useRouter();
  const [listAllOrders] = useState(allOrders);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [spinLoading, setSpinLoading] = useState(true);
  const { Title } = Typography;
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
      title: "Amount",
      dataIndex: "orderTotal",
      key: "orderTotal",
      align: "center" as AlignType,
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
            EDIT
          </RediIconButton>
          <RediIconButton
            onClick={() => router.push(`/orders/${item._id}`)}
            iconFt={faCartShopping}
            buttonType={EButtonType.SUCCESS}
          >
            PAY
          </RediIconButton>
        </Space>
      ),
    },
  ];

  const showProperData = (option) => {
    // replace later by axios get
    setSelectedOption(option);
    if (option === "ALL") {
      return setFilteredOrders(listAllOrders);
    }
    const newList = listAllOrders.filter((order) => order.orderId === option);
    if (newList) {
      return setFilteredOrders(newList);
    }
  };

  useEffect(() => {
    console.log("val", appValue.state.currency);
    // data coming from backend
    const sortedData = allOrders.map((order: IOrder) => {
      return {
        ...order,
        key: order._id,
        orderTotal: `${convertPrice(order.orderTotal, "backToFront")}`,
      };
    });
    setFilteredOrders(sortedData);
    // i18next.changeLanguage(appValue.state.language, (err, t) => {
    //   if (err) return console.log("something went wrong loading", err);
    //   t("key"); // -> same as i18next.t
    // });
    setSpinLoading(false);
    appValue.setStatus(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedOption]);

  return (
    <>
      <Head>
        <title>List of all unpaid orders</title>
        <meta name="description" content="List of all unpaid orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title level={2}>{t("index.title")}</Title>
      <RowSpaceBetween gutter={10} style={{ marginBottom: "1rem" }}>
        <Col span={10}>
          <RediSelect
            style={{ width: "8rem" }}
            value={selectedOption}
            onChange={(e: string) => showProperData(e)}
            options={getOptions(getList)}
          />
        </Col>
        <Col span={10}>
          <RediIconButton
            shape="round"
            buttonType={EButtonType.CREATE}
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      allOrders: allDataOrders,
      getList: getListUnpaidOrders,
      status: "success",
      ...(await serverSideTranslations(locale, ["common"])),
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
