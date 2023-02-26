import { faCartShopping, faCashRegister, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Col, Space } from "antd";
import { useState } from "react";

import { useRouter } from "next/navigation";
import SummaryTable from "../../src/components/food-order/SummaryTable";
import { RediIconButton } from "../../src/components/styling/Button.style";
import { RowSpaceBetween } from "../../src/components/styling/grid.styled";
import RediRadioButton from "../../src/components/styling/RediRadioButton";
import { RED } from "../../src/constants";
import { hexToRgba } from "../../src/functions/global.fn";
import { EButtonType, EPaymentType } from "../../src/interfaces";
import { LGCard } from "../../src/styles";
import { SpacingDiv5X } from "../../src/styles/styledComponents/div.styled";
import { mockOneOrder } from "../../test/mocks/mockOrdersData";

const CurrentOrder = ({ currentOrder, status }: any) => {
  const router = useRouter();
  console.log(status);
  const { orderItems, orderTotal, orderDate, orderId, tableNumber, orderStatus } = currentOrder;
  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);

  const isDisabled = paymentChoice === null ? true : false;
  const radioPaymentOptions = [
    { label: EPaymentType.CASH, value: EPaymentType.CASH, icon: <FontAwesomeIcon icon={faCashRegister} /> },
    { label: EPaymentType.CARD, value: EPaymentType.CARD, icon: <FontAwesomeIcon icon={faCreditCard} /> },
  ];

  const alertMessage = orderStatus === "COMPLETE" ? "PAID" : "NOT PAID";
  const messageType = orderStatus === "COMPLETE" ? "success" : "error";
  const colorAlert = orderStatus !== "COMPLETE" && hexToRgba(RED, 0.7);

  return (
    <SpacingDiv5X>
      <LGCard style={{ padding: "0 1rem" }}>
        <RowSpaceBetween>
          <Col lg={8}>
            <b>Order #</b>
            {orderId}
          </Col>
          <Col lg={8}>
            <b>Table</b> {tableNumber}
          </Col>
          <Col lg={8}>
            <b>Date</b> {orderDate}
          </Col>
          <Col lg={8}>
            <Alert type={messageType} message={alertMessage} style={{ fontWeight: 700, color: colorAlert }} />
          </Col>
        </RowSpaceBetween>
      </LGCard>
      <SummaryTable order={currentOrder} />
      <RediRadioButton
        radioGroupName="payment"
        padding="1rem 1rem"
        fontSize="1rem"
        options={radioPaymentOptions}
        haveIcon="true"
        setSelectedButton={setPaymentChoice}
        selectedButton={paymentChoice}
      />
      <Space>
        <RediIconButton
          onClick={() => router.push(`/orders/${orderId}`)}
          iconFt={faCartShopping}
          disabled={isDisabled}
          buttonType={EButtonType.SUCCESS}
        >
          PAY
        </RediIconButton>
      </Space>
    </SpacingDiv5X>
  );
};
export default CurrentOrder;

export async function getServerSideProps() {
  // context: any
  // const id: string = context.query["id"];
  return { props: { currentOrder: mockOneOrder, status: "success" } };
}
