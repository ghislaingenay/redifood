import { faBan, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Col } from "antd";
import { useCallback, useState } from "react";
import { Else, If, Then } from "react-if";
import { RediButton, RediIconButton } from "../../../../src/components/styling/Button.style";
import { RowCenter, RowCenterSp, RowSpaceAround } from "../../../../src/components/styling/grid.styled";
import { EButtonType, EPaymentType } from "../../../../src/interfaces";
import { CenteredTitle, LGCard, LRoundedInput } from "../../../../src/styles";
import { mockOneOrder } from "../../../../test/mocks/mockOrdersData";

type TStrNull = string | null;

const PaymentSystem = ({ paymentType, currentOrder }) => {
  const { orderTotal } = currentOrder;
  console.log(orderTotal);

  const [selectAmount, setSelectAmount] = useState<TStrNull>("");
  const [selectedAmount, setSelectedAmount] = useState<TStrNull>("");

  const onAdd = (val: string) => setSelectAmount((prevValue: string) => prevValue + val);
  const onConfirm = () => {
    setSelectedAmount(() => selectAmount);
    setTimeout(() => {
      setSelectAmount(null);
    }, 1000);
  };

  const havePoint = (str: string) => {
    if (selectAmount?.includes(".")) {
      return str.indexOf(".") === str.lastIndexOf(".");
    }
    return true;
  };
  const haveValueSeparated = (str: string) => {
    if (selectAmount?.includes(".")) {
      return /(\d+).(\d+)/i.test(str);
    }
    return true;
  };

  const isDisabled = selectedAmount && selectedAmount >= orderTotal ? false : true;
  const confirmDisabled =
    selectAmount === "" || selectAmount === "." || !havePoint(selectAmount) || !haveValueSeparated(selectAmount)
      ? // !(selectAmount.includes(".") && selectAmount.split(".").length !== 1)
        true
      : false;
  const clearDisabled =
    selectAmount === ""
      ? // ||
        // (selectAmount.includes(".") && selectAmount.length === 1) ||
        // selectAmount.match(/./g).length === 1
        true
      : false;

  const renderedValue = useCallback(() => {
    return selectAmount;
  }, [selectAmount]);

  return (
    <>
      <If condition={paymentType === EPaymentType.CASH}>
        <Then>
          <RowSpaceAround>
            <Col span={11}>
              <LGCard>
                <RowCenter style={{ marginBottom: "1rem" }}>
                  <LRoundedInput aria-label="select amount" value={renderedValue()} />
                </RowCenter>
                <RowCenter gutter={20}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => {
                    return (
                      <Col span={8} key={num} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                        <RediButton
                          value={`${String(num)}`}
                          buttonType={EButtonType.INFO}
                          onClick={(e) => onAdd(e.target.value)}
                          style={{ width: "100%", padding: "1rem 3rem", fontSize: "2rem" }}
                          aria-label={`${String(num)}`}
                        >
                          {num}
                        </RediButton>
                      </Col>
                    );
                  })}
                  {/* <Col span={8}></Col> */}
                  <Col span={8} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <RediButton
                      buttonType={EButtonType.INFO}
                      aria-label="0"
                      onClick={() => setSelectAmount((prevValue: string) => prevValue + "0")}
                      value="0"
                    >
                      0
                    </RediButton>
                  </Col>
                  <Col span={8} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <RediButton
                      buttonType={EButtonType.INFO}
                      aria-label="point"
                      value={`.`}
                      onClick={() => setSelectAmount((prevValue: string) => prevValue + ".")}
                    >
                      .
                    </RediButton>
                  </Col>
                  <RowCenterSp>
                    <RediButton buttonType={EButtonType.SUCCESS} disabled={confirmDisabled} onClick={() => onConfirm()}>
                      Confirm
                    </RediButton>
                    <RediIconButton
                      buttonType={EButtonType.ERROR}
                      iconFt={faBan}
                      disabled={clearDisabled}
                      onClick={() => setSelectAmount("")}
                    >
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
              <LRoundedInput aria-label="selected amount" value={selectedAmount} />

              <CenteredTitle>Render</CenteredTitle>
              <LRoundedInput aria-label="selected amount" />
              <RediIconButton iconFt={faCartShopping} buttonType={EButtonType.SUCCESS} disabled={isDisabled}>
                Finalize payment
              </RediIconButton>
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
