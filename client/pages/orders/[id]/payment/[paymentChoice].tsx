import { faBan } from "@fortawesome/free-solid-svg-icons";
import { Col } from "antd";
import { Else, If, Then } from "react-if";
import { RediButton, RediIconButton } from "../../../../src/components/styling/Button.style";
import { RowCenter, RowCenterSp, RowSpaceAround } from "../../../../src/components/styling/grid.styled";
import { EButtonType, EPaymentType } from "../../../../src/interfaces";
import { CenteredTitle, LGCard, LRoundedInput } from "../../../../src/styles";
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
              <LGCard>
                <RowCenter style={{ marginBottom: "1rem" }}>
                  <LRoundedInput aria-label="select amount" />
                </RowCenter>
                <RowCenter gutter={20}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => {
                    return (
                      <Col span={8} key={num} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                        <RediButton
                          buttonType={EButtonType.INFO}
                          style={{ width: "100%", padding: "1rem 3rem", fontSize: "2rem" }}
                          aria-label={`${String(num)}`}
                        >
                          {num}
                        </RediButton>
                      </Col>
                    );
                  })}
                  <Col span={8}></Col>
                  <Col span={8} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <RediButton buttonType={EButtonType.INFO}>0</RediButton>
                  </Col>
                  <Col span={8}></Col>
                  <RowCenterSp>
                    <RediButton buttonType={EButtonType.SUCCESS}>Confirm</RediButton>
                    <RediIconButton buttonType={EButtonType.ERROR} iconFt={faBan}>
                      Clear
                    </RediIconButton>
                  </RowCenterSp>
                </RowCenter>
              </LGCard>
            </Col>
            <Col span={11}>
              <CenteredTitle>Transaction amount</CenteredTitle>
              <LRoundedInput aria-label="" value={currentOrder.orderTotal} />
              <CenteredTitle>Amount</CenteredTitle>
              <LRoundedInput aria-label="selected amount" />

              <CenteredTitle>Render</CenteredTitle>
              <LRoundedInput aria-label="selected amount" />
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
