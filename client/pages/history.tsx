import { Col, DatePicker, Form } from "antd";
import { useState } from "react";
import { RowCenter } from "../src/components/styling/grid.styled";
import { mockedFoodData } from "../test/mocks/mockFoodData";

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
          if (endingDate) {
            endingDate = endDate["$d"];
          }
          console.log(startingDate, endingDate);
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
    </>
  );
};

export default History;

export async function getServerSideProps() {
  return {
    props: { FoodOrderList: [mockedFoodData], status: "success" },
  };
}
