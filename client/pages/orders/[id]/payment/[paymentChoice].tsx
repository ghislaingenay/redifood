import { Col } from "antd";
import { Else, If, Then } from "react-if";
import { RowSpaceAround } from "../../../../src/components/styling/grid.styled";
import { EPaymentType } from "../../../../src/interfaces";
import { LRoundedInput } from "../../../../src/styles";
import { mockOneOrder } from "../../../../test/mocks/mockOrdersData";

const PaymentSystem = ({ paymentType, currentOrder }) => {
  const { orderTotal } = currentOrder;
  console.log(orderTotal);
  return (
    <>
      <If condition={paymentType === EPaymentType.CASH}>
        <Then>
          <RowSpaceAround>
            <Col span={11}>
              <LRoundedInput readOnly={true} aria-label="select amount" value={1234} />
              {/*<LGCard>
<LRoundedInput aria-label='select amount' />
<RowCenter>
{[1,2,3,4,5,6,7,8,9].map((num: number) => {
return <Col span={8}><RediButton></RediButton></Col>})
<Col span={8}></Col><Col span={8}><RediButton></RediButton></Col><Col span={8}></Col>
<RowCenterSp>
</RowCenterSp>
<RediIconButton >Confirm</RediIconButton>
<RediIconButton >Clear</RediIconButton>
</RowCenter>
</LGCard>
</Col>
<Col span={11}>
<LabelFormBlack>Transaction amount</LabelFormBlack>
<LRoundedInput aria-label='' value={currentOrder.orderTotal}/>
<LabelFormBlack>Amount</LabelFormBlack>
<LRoundedInput aria-label='selected amount' />

<LabelFormBlack>Render</LabelFormBlack>
<LRoundedInput aria-label='selected amount' /> */}
            </Col>
          </RowSpaceAround>
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
