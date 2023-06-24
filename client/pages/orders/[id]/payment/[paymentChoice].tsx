import { faBan, faCancel, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Alert, Col, Divider, Typography } from "antd";
import { AxiosResponse } from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { Else, If, Then } from "react-if";
import { EPaymentType, IGetOneOrder, IGetServerSideData, IOrderApi } from "../../../../redifood-module/src/interfaces";
import { RediButton, RediIconButton } from "../../../../src/components/styling/Button.style";
import { RowCenter, RowCenterSp, RowSpaceAround } from "../../../../src/components/styling/grid.styled";
import AppContext from "../../../../src/contexts/app.context";
import useCurrency from "../../../../src/hooks/useCurrency.hook";
import { EButtonType } from "../../../../src/interfaces";
import { CenteredLabel, LGCard, LRoundedInput } from "../../../../src/styles";
import { AnimToTop } from "../../../../src/styles/animations/global.anim";
import { AxiosFunction } from "../../../api/axios-request";
import buildClient from "../../../api/build-client";
import { buildLanguage } from "../../../api/build-language";
const { Title } = Typography;

type TStrNum = string | number;

interface IPaymentProps {
  paymentType: EPaymentType;
  currentOrder: IOrderApi;
}
const PaymentSystem = ({ paymentType, currentOrder }: IPaymentProps) => {
  const { t } = useTranslation();
  const {
    state: { vat },
  } = useContext(AppContext);
  const { convertPrice, displayCurrency, convertAmount } = useCurrency();
  const { orderTotal } = currentOrder;
  const router = useRouter();
  const orderId = useSearchParams().get("id");
  console.log("selected id", orderId);

  const [selectAmount, setSelectAmount] = useState<TStrNum>("");
  const [selectedAmount, setSelectedAmount] = useState<TStrNum>("");

  const [payOrderLoading, setPayOrderLoading] = useState(false);

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
  const isDisabled = selectedAmount && Number(selectedAmount) >= orderTotal && diffAmount > 0 ? false : true;
  const confirmDisabled =
    selectAmount === "" ||
    selectAmount === "." ||
    !havePoint(selectAmount as string) ||
    !haveValueSeparated(selectAmount as string);

  const clearDisabled = selectAmount === "";

  const renderedValue = useCallback(() => {
    return selectAmount;
  }, [selectAmount]);

  const handlePayOrder = () => {
    setPayOrderLoading(true);
    AxiosFunction({})
      .then(() => {})
      .catch(() => {});
  };

  return (
    <>
      <Head>
        <title>{t("payments.head-view.title")}</title>
        <meta name="description" content={t("payments.head-view.description") as string} />
      </Head>
      <main>
        <AnimToTop>
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
                        <RediButton
                          buttonType={EButtonType.SUCCESS}
                          disabled={confirmDisabled}
                          onClick={() => onConfirm()}
                        >
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
                    <LRoundedInput
                      readOnly={true}
                      aria-label="render"
                      id="render"
                      value={convertAmount(amountToGive)}
                    />
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
              <RowCenter>
                <Title style={{ textAlign: "center" }}>This application doesn't contain a direct payment system.</Title>
              </RowCenter>
              <RowCenter>
                <Title>
                  Amount : {convertAmount(orderTotal)}
                  {displayCurrency()}
                </Title>
              </RowCenter>
              <Divider />
              <RowCenterSp>
                <RediIconButton
                  iconFt={faCancel}
                  buttonType={EButtonType.ERROR}
                  onClick={() => router.replace(`/orders/${orderId}`)}
                  loading={payOrderLoading}
                >
                  {t("buttons.cancel")}
                </RediIconButton>
                <RediIconButton
                  iconFt={faCartShopping}
                  buttonType={EButtonType.CREATE}
                  loading={payOrderLoading}
                  onClick={() => handlePayOrder()}
                >
                  {t("buttons.pay")}
                </RediIconButton>
              </RowCenterSp>
            </Else>
          </If>
        </AnimToTop>
      </main>
    </>
  );
};
export default PaymentSystem;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const getLanguageValue = buildLanguage(locale, req);
  const client = buildClient(appContext);
  const id: string = appContext.query["id"];
  const paymentType: string = appContext.query["paymentChoice"];
  const url = `/api/orders/${id}`;
  const response = await client
    .get(url)
    .then(async (res: AxiosResponse<IGetServerSideData<IGetOneOrder>>) => {
      const {
        data: { results },
      } = res;
      const { currentOrder } = results as IGetOneOrder;
      return {
        props: {
          paymentType,
          currentOrder,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          currentOrder: [],
          paymentType: "",
          foodList: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });

  return response;
}
