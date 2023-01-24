import { Card, Col, Divider, Row, Space, Table, Typography } from "antd";
import { RediButton } from "./RediButton";
const { Title } = Typography;

const OrderCard = ({ order }) => {
  const currency = "$";

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

  return (
    <Card style={{ marginBottom: "1rem" }} role="card">
      <Row justify="space-between" align="middle">
        <Col md={6}>
          <Title className="mt-0" level={5}>
            Order ID: <em>{order.orderId}</em>
          </Title>
        </Col>
        <Col md={6}>
          <Title className="mt-0" level={5}>
            Order Total:{" "}
            <em>
              {order.orderTotal} {currency}
            </em>
          </Title>
        </Col>
        <Col md={6}>
          <Title className="mt-0" level={5}>
            Table Number: <em>{order.tableNumber}</em>
          </Title>
        </Col>
        <Col md={6}>
          <Space size="middle">
            <RediButton typeButton="edit" haveIcon={true} title="EDIT" />
            <RediButton typeButton="success" haveIcon={true} title="PAY" />
          </Space>
        </Col>
      </Row>
      <Divider className="mb-1" />
      <Title level={5} className="mt-0 text-center">
        MENU
      </Title>
      <Table dataSource={order.orderItems} rowKey="itemId" columns={columns} pagination={false} />
    </Card>
  );
};

export default OrderCard;