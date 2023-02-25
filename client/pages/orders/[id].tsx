import { faCartShopping, faCashRegister, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Space } from "antd";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { RediIconButton } from "../../src/components/styling/Button.style";
import { RowSpaceBetween } from "../../src/components/styling/grid.styled";
import RediRadioButton from "../../src/components/styling/RediRadioButton";
import { capitalize } from "../../src/functions/global.fn";
import { EButtonType, EPaymentType } from "../../src/interfaces";
import { SpacingDiv5X } from "../../src/styles/styledComponents/div.styled";
import { mockOneOrder } from "../../test/mocks/mockOrdersData";

const CurrentOrder = ({ currentOrder, status }: any) => {
  const router = useRouter();
  console.log(status);
  const { orderItems, orderTotal, orderId } = currentOrder;
  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);

  const isDisabled = paymentChoice === null ? true : false;
  const radioPaymentOptions = [
    { label: EPaymentType.CASH, value: EPaymentType.CASH, icon: <FontAwesomeIcon icon={faCashRegister} /> },
    { label: EPaymentType.CARD, value: EPaymentType.CARD, icon: <FontAwesomeIcon icon={faCreditCard} /> },
  ];

  return (
    <SpacingDiv5X>
      <RowSpaceBetween>
        <Col>Order #</Col>
        <Col>Table</Col>
        <Col>Date</Col>
        <Col>alert</Col>
      </RowSpaceBetween>
      <table style={{ margin: "2rem 0", width: "100%" }}>
        <thead>
          <tr>
            <th>Food</th>
            <th>Section</th>
            <th>Extra</th>
            <th>Qty</th>
            <th>Unit cost</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => {
            const { itemName, itemSection, itemExtra, itemQuantity, itemPrice, itemId } = item;
            return (
              <tr key={itemId}>
                <td>{itemName}</td>
                <td>{capitalize(itemSection)}</td>
                <td>{capitalize(itemExtra)}</td>
                <td>{itemQuantity}</td>
                <td>{itemPrice}</td>
                <td>{(itemPrice * itemQuantity).toFixed(2)}</td>
              </tr>
            );
          })}

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total before VAT</td>
            <td>{orderTotal} $</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>VAT(%)</td>
            <td>200</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total for payment</td>
            <td>{orderTotal} $</td>
          </tr>
        </tbody>
      </table>
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
