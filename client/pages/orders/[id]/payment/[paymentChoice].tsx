import { faBan, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Alert, Col } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useContext, useState } from "react";
import { Else, If, Then } from "react-if";
import { RediButton, RediIconButton } from "../../../../src/components/styling/Button.style";
import { RowCenter, RowCenterSp, RowSpaceAround } from "../../../../src/components/styling/grid.styled";
import AppContext from "../../../../src/contexts/app.context";
import useCurrency from "../../../../src/hooks/useCurrency.hook";
import { EButtonType, EPaymentType, IOrder } from "../../../../src/interfaces";
import { CenteredLabel, LGCard, LRoundedInput } from "../../../../src/styles";
import { mockOneOrder } from "../../../../test/mocks/mockOrdersData";
import { buildLanguage } from "../../../api/build-language";

type TStrNum = string | number;

interface IPaymentProps {
  paymentType: EPaymentType;
  currentOrder: IOrder;
}
const PaymentSystem = ({ paymentType, currentOrder }: IPaymentProps) => {
  const { t } = useTranslation();
  const {
    state: { vat },
  } = useContext(AppContext);
  const { convertPrice, displayCurrency, convertAmount } = useCurrency();
  const { orderTotal } = currentOrder;
  console.log(orderTotal);

  const [selectAmount, setSelectAmount] = useState<TStrNum>("");
  const [selectedAmount, setSelectedAmount] = useState<TStrNum>("");

  const onAdd = (val: string) => setSelectAmount((prevValue: TStrNum) => prevValue + val);
  const onConfirm = () => {
    setSelectedAmount(() => convertAmount(selectAmount));
    setSelectAmount("");
  };

  const havePoint = (str: string) => {
    if (typeof selectAmount === "string" && selectAmount?.includes(".")) {
      return str.indexOf(".") === str.lastIndexOf(".");
    }
    return true;
  };
  const haveValueSeparated = (str: string) => {
    if (typeof selectAmount === "string" && selectAmount?.includes(".")) {
      return /(\d+).(\d+)/i.test(str);
    }
    return true;
  };

  const totalAmount = orderTotal * (1 + vat / 100);

  const diffAmount = Number(selectedAmount) - totalAmount;
  const amountToGive = diffAmount === totalAmount || diffAmount < 0 ? 0 : diffAmount;
  const isDisabled = selectedAmount && selectedAmount >= orderTotal && diffAmount > 0 ? false : true;
  const confirmDisabled =
    selectAmount === "" ||
    selectAmount === "." ||
    !havePoint(selectAmount as string) ||
    !haveValueSeparated(selectAmount as string)
      ? true
      : false;
  const clearDisabled = selectAmount === "" ? true : false;

  const renderedValue = useCallback(() => {
    return selectAmount;
  }, [selectAmount]);
  return (
    <>
      <If condition={paymentType === EPaymentType.CASH}>
        <Then>
          <RowSpaceAround>
            <Col md={11}>
              <LGCard>
                <RowCenter style={{ marginBottom: "1rem" }}>
                  <LRoundedInput readOnly={true} aria-label="select amount" value={renderedValue()} />
                </RowCenter>
                <RowCenter gutter={20}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => {
                    return (
                      <Col span={8} key={num} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                        <RediButton
                          value={`${String(num)}`}
                          buttonType={EButtonType.INFO}
                          onClick={(e) => {
                            const target = e.target as HTMLButtonElement;
                            onAdd(target.value!);
                          }}
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
                      onClick={() => setSelectAmount((prevValue: TStrNum) => prevValue + "0")}
                      value="0"
                    >
                      0
                    </RediButton>
                  </Col>
                  <Col span={8} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <RediButton
                      buttonType={EButtonType.INFO}
                      aria-label="point"
                      value={"."}
                      onClick={() => setSelectAmount((prevValue: TStrNum) => prevValue + ".")}
                    >
                      .
                    </RediButton>
                  </Col>
                  <RowCenterSp>
                    <RediButton buttonType={EButtonType.SUCCESS} disabled={confirmDisabled} onClick={() => onConfirm()}>
                      {t("buttons.confirm")}
                    </RediButton>
                    <RediIconButton
                      buttonType={EButtonType.ERROR}
                      iconFt={faBan}
                      aria-label="Clear"
                      disabled={clearDisabled}
                      onClick={() => setSelectAmount("")}
                    >
                      {t("buttons.clear")}
                    </RediIconButton>
                  </RowCenterSp>
                </RowCenter>
              </LGCard>
            </Col>
            <Col md={11}>
              <RowCenter>
                <CenteredLabel htmlFor="transactionAmount" aria-label="transaction amount">
                  {t("payments.transaction-amount")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput
                  readOnly={true}
                  aria-label="transactionAmount"
                  id="transactionAmount"
                  value={convertPrice(totalAmount, "backToFront", false)}
                />
              </RowCenter>
              <RowCenter>
                <CenteredLabel htmlFor="selected amount" aria-label="given amount">
                  {t("payments.given-amount")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput
                  readOnly={true}
                  aria-label="selected amount"
                  id="selected amount"
                  value={selectedAmount}
                />
              </RowCenter>
              <RowCenter>
                <CenteredLabel htmlFor="render" aria-label="amount to give">
                  {t("payments.amount-to-give")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput readOnly={true} aria-label="render" id="render" value={convertAmount(amountToGive)} />
              </RowCenter>
              <RowCenter style={{ marginTop: "2rem" }}>
                {isDisabled && selectedAmount !== "" && (
                  <Alert type="error" style={{ margin: "1rem 2rem" }} message={t("payments.funds-error")} />
                )}
                <RediIconButton
                  iconFt={faCartShopping}
                  aria-label="finalize payment"
                  buttonType={EButtonType.SUCCESS}
                  disabled={isDisabled}
                >
                  {" "}
                  {t("buttons.finalize-payment")}
                </RediIconButton>
              </RowCenter>
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
  const { locale, req } = context;
  const getLanguageValue = buildLanguage(locale, req);
  console.log("connected");
  // const id: string = context.query['id'];
  const paymentChoice: string = context.query["paymentChoice"];
  return {
    props: {
      paymentType: paymentChoice,
      currentOrder: mockOneOrder,
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
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
