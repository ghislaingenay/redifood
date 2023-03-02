import { Else, If, Then } from "react-if";
import { EPaymentType } from "../../../../src/interfaces";
import { mockOneOrder } from "../../../../test/mocks/mockOrdersData";

const PaymentSystem = ({ paymentType, currentOrder }) => {
  const { orderTotal } = currentOrder;
  console.log(orderTotal);
  return (
    <>
      <If condition={paymentType === EPaymentType.CASH}>
        <Then>
          <p>cash</p>
        </Then>
        <Else>
          <p>credit</p>
        </Else>
      </If>
    </>
  );
};
export default PaymentSystem;
export async function getServerSideProps(context: any) {
  console.log("connected");
  // const id: string = context.query['id'];
  const paymentChoice: string = context.query["paymentChoice"];
  return {
    props: {
      paymentType: paymentChoice,
      currentOrder: mockOneOrder,
    },
  };
  // const url = String(`${process.env.BACK_END}/payment/${id}`)
  // const response = await axios.get(url, { params: { orderId : id } })
  // if (response.status === 200) {
  //   const oneOrder: Order = response.data
  //   return {
  //     props: {
  //       order: oneOrder
  //     }
  //   }
  // return response.data
  // }
}
