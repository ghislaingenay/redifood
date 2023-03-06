import { faList } from "@fortawesome/free-solid-svg-icons";
import { Col, DatePicker, Form } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RediIconButton } from "../src/components/styling/Button.style";
import { RowCenter, RowSpaceBetween } from "../src/components/styling/grid.styled";
import { EButtonType, IOrder } from "../src/interfaces";
import { CenteredPBold, LGCard } from "../src/styles";
import { mockOneOrder } from "../test/mocks/mockOrdersData";

const History = ({ FoodOrderList }) => {
  const router = useRouter();
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
      {FoodOrderList.map((foodOrder: IOrder) => {
        return (
          <>
            <LGCard>
              <RowSpaceBetween>
                <Col span={15}>
                  <RowCenter>
                    <Col span={12}>
                      <CenteredPBold>Order number: {foodOrder?._id}</CenteredPBold>
                    </Col>
                    <Col span={12}>
                      <CenteredPBold>Date: </CenteredPBold>
                    </Col>
                    <Col span={12}>
                      <CenteredPBold>Amount: {foodOrder?.orderTotal}</CenteredPBold>
                    </Col>
                    <Col span={12}>
                      <CenteredPBold>Amount: {foodOrder?.orderCurrency}</CenteredPBold>
                    </Col>
                  </RowCenter>
                </Col>
                <Col span={7}>
                  <RediIconButton
                    iconFt={faList}
                    buttonType={EButtonType.EDIT}
                    onClick={() => router.push(`/orders/${foodOrder?._id}`)}
                  >
                    VIEW ORDER
                  </RediIconButton>
                </Col>
              </RowSpaceBetween>
            </LGCard>
          </>
        );
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
