import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Space, Table, Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { RediSelect } from "../src/components/RediSelect";
import { RediButton } from "../src/components/styling/Button.style";
import AppContext from "../src/contexts/app.context";
import { EButtonType, IOrder } from "../src/interfaces";
import { allDataOrders, getListUnpaidOrders } from "../test/mocks/mockOrdersData";

export const getOptions = (array: string[]) => {
  const newArray = array.map((item) => {
    return {
      value: item,
      label: item,
    };
  });
  return newArray;
};

const AllOrdersPage = ({ allOrders, getList, status }) => {
  const appValue = useContext(AppContext);
  appValue.setStatus(status);
  const router = useRouter();
  const [listAllOrders] = useState(allOrders);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);
  const { Title } = Typography;
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Table",
      dataIndex: "tableNumber",
      key: "tableNumber",
    },
    {
      title: "Amount",
      dataIndex: "orderTotal",
      key: "orderTotal",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (item: IOrder) => (
        <Space>
          <RediButton buttonType={EButtonType.EDIT}>EDIT</RediButton>
          <RediButton buttonType={EButtonType.SUCCESS}>PAY</RediButton>
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
    appValue.setStatus(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, appValue]);

  return (
    <>
      <Head>
        <title>List of all unpaid orders</title>
        <meta name="description" content="List of all unpaid orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title level={2}>List of all orders</Title>
      <Row justify="space-between" align="middle" gutter={10} className="mb-5">
        <Col>
          <RediSelect
            style={{ width: "8rem" }}
            value={selectedOption}
            onChange={(e: string) => showProperData(e)}
            options={getOptions(getList)}
          />
        </Col>
        <Col className="text-right" lg={4}>
          <RediButton shape="round" buttonType={EButtonType.CREATE}>
            <Space>
              <FontAwesomeIcon icon={faPlusCircle} /> Create Order{" "}
            </Space>
          </RediButton>
        </Col>
      </Row>
      <Table columns={columns} dataSource={allOrders} />
      {/* {filteredOrders.map((order) => {
        return <OrderCard order={order} key={order.orderId} />;
      })} */}
    </>
  );
};

export default AllOrdersPage;

export async function getServerSideProps() {
  return { props: { allOrders: allDataOrders, getList: getListUnpaidOrders, status: "success" } };
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
