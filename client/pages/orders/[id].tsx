import { Col } from "antd";
import { useState } from "react";
import { RowSpaceBetween } from "../../src/components/styling/grid.styled";
import { EPaymentType } from "../../src/interfaces";
import { mockOneOrder } from "../../test/mocks/mockOrdersData";

const CurrentOrder = ({ currentOrder, status }: any) => {
  console.log(status);

  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);

  return (
    <>
      <RowSpaceBetween>
        <Col>Order #</Col>
        <Col>Table</Col>
        <Col>Date</Col>
        <Col>alert</Col>
      </RowSpaceBetween>
      <table className="table text-center table-striped">
        <thead>
          <tr>
            <th scope="col ">Food</th>
            <th scope="col ">Section</th>
            <th scope="col ">Extra</th>
            <th scope="col ">Qty</th>
            <th scope="col ">Unit cost</th>
            <th scope="col ">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOrder.orderItem.map((item, index) => {
            return (
              <tr key={index}>
                <td className="">{item.food.name}</td>
                <td className="">{item.food.section[0].toUpperCase() + item.food.section.substring(1)}</td>
                <td className="">{item.food.extra[0].toUpperCase() + item.food.extra.substring(1)}</td>
                <td className="">{item.qty}</td>
                <td className="">{item.food.price}</td>
                <td className="">{(item.food.price * item.qty).toFixed(2)}</td>
              </tr>
            );
          })}

          <tr className="table-info">
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className="">Total before VAT</td>
            <td className="">{currentOrder.orderTotal} $</td>
          </tr>
          <tr className="food-card table-warning">
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className="">VAT(%)</td>
            <td className="">200</td>
          </tr>
          <tr className="food-card table-dark">
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className=""></td>
            <td className="">Total for payment</td>
            <td className="">{currentOrder.orderTotal} $</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CurrentOrder;
export async function getServerSideProps(context: any) {
  const id: string = context.query["id"];
  return { props: { currentOrder: mockOneOrder, status: "success" } };
}
