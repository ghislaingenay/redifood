import { Col, DatePicker, Form } from "antd";
import { useState } from "react";
import OrderHistoryCard from "../src/components/food-order/OrderHistoryCard";
import { RowCenter } from "../src/components/styling/grid.styled";
import { IOrder } from "../src/interfaces";
import { mockOneOrder } from "../test/mocks/mockOrdersData";

const History = ({ FoodOrderList }) => {
  const [form] = Form.useForm();
  const [params, setParams] = useState({ startDate: undefined, endDate: undefined });

  return (
    <>
      <Form
        form={form}
        labelWrap={false}
        layout="horizontal"
        onValuesChange={(e, all) => {
          console.log("all", all);
          const { startDate, endDate } = all;
          console.log(startDate, endDate);
          let startingDate = undefined;
          let endingDate = undefined;
          if (startDate) {
            startingDate = startDate["$d"];
          }
          if (endDate) {
            endingDate = endDate["$d"];
          }
          setParams(() => Object.assign({ params }, { startDate: startingDate, endDate: endingDate }));
        }}
      >
        <RowCenter style={{ margin: 0, height: "100%", padding: 0 }}>
          <Col span={8} style={{ margin: 0, height: "100%", padding: 0 }}>
            <Form.Item name="startDate" label="From">
              <DatePicker picker="date" />
            </Form.Item>
          </Col>
          <Col span={8} style={{ margin: 0, height: "100%", padding: 0 }}>
            <Form.Item name="endDate" label="To">
              <DatePicker picker="date" />
            </Form.Item>
          </Col>
        </RowCenter>
      </Form>
      {FoodOrderList.map((foodOrder: IOrder, index: number) => {
        return <OrderHistoryCard key={index} foodOrder={foodOrder} />;
      })}
    </>
  );
};

export default History;

export async function getServerSideProps() {
  return {
    props: { FoodOrderList: [mockOneOrder], status: "success" },
  };
}
