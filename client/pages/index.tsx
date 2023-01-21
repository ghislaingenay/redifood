import { Button, Card, Table, Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RediSelect } from "src/components/RediSelect";
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
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);
  const { Title } = Typography;

  // const [completeOrders, setCompleteOrders] = useState(allOrders);

  // if (status === "error") {
  //
  // }
  const columns = [
    {
      title: "Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Section",
      dataIndex: "itemSection",
      key: "itemSection",
    },
    {
      title: "Quantity",
      dataIndex: "itemQuantity",
      key: "itemQuantity",
    },
    {
      title: "Price",
      dataIndex: "itemPrice",
      key: "itemPrice",
    },
  ];

  // const loadData = async () => {
  //   await axios
  //     .get("/api/orders", { params: { selectedOption } })
  //     .then((res) => {
  //       setFilteredOrders(res.data);
  //     })
  //     .catch(() => {
  //       console.log("filled");
  //     });
  // };

  // useEffect(() => {
  //   if (status === "error") {
  //     NotificationRes.onFailure({
  //       title: "Error",
  //       placement: "topRight",
  //       description: "The page will refresh automatically in 5 seconds",
  //     });
  // setTimeout(() => {
  //   window.location.reload();
  // }, 5000);
  // }
  // loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedOption]);
  return (
    <>
      <Head>
        <title>List of all unpaid orders</title>
        <meta name="description" content="List of all unpaid orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title level={2}>List of all orders</Title>
      <Button onClick={() => router.push("/orders/create")}>Create Order</Button>
      <RediSelect value={selectedOption} onChange={(e: string) => setSelectedOption(e)} options={getOptions(getList)} />
      {filteredOrders.map((order) => {
        return (
          <Card key={order.orderId} role="card">
            <p>Order ID: {order.orderId}</p>
            <p>Order Total: {order.orderTotal}</p>
            <p>Order Status: {order.orderStatus}</p>
            <p>Table Number: {order.tableNumber}</p>
            <Button>Edit</Button>
            <Button>Pay</Button>
            <Title>Menu</Title>
            <Table dataSource={order.orderItems} rowKey="itemId" columns={columns} />
          </Card>
        );
      })}
    </>
  );
};

export default AllOrdersPage;

export async function getServerSideProps() {
  return { props: { allOrders: allDataOrders, getList: getListUnpaidOrders, status: "error" } };
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
