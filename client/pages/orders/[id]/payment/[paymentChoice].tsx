import { faCancel, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Divider, Typography } from "antd";
import { AxiosResponse } from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useDeferredValue, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { roundTwoDecimals } from "../../../../redifood-module/src/global.functions";
import {
  EOrderStatus,
  EPaymentType,
  IGetOneOrder,
  IGetServerSideData,
  IOrderApi,
} from "../../../../redifood-module/src/interfaces";
import { RediIconButton } from "../../../../src/components/styling/Button.style";
import { RowAroundSp, RowCenter, RowCenterSp } from "../../../../src/components/styling/grid.styled";
import AppContext from "../../../../src/contexts/app.context";
import { keepDigitsInText } from "../../../../src/functions/payment.fn";
import useCurrency from "../../../../src/hooks/useCurrency.hook";
import { EButtonType } from "../../../../src/interfaces";
import { CenteredLabel, LRoundedInput } from "../../../../src/styles";
import { AnimToTop } from "../../../../src/styles/animations/global.anim";
import buildClient from "../../../api/build-client";
import { buildLanguage } from "../../../api/build-language";
import { payOrder } from "../../../api/payment-api";
const { Title } = Typography;

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
  const { orderTotal, orderStatus } = currentOrder;
  const router = useRouter();
  const orderId = useSearchParams().get("id");

  const SIZE_SPACE_ROWS = 10;
  const isCashPayment = paymentType === EPaymentType.CASH;

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [payOrderLoading, setPayOrderLoading] = useState(false);

  const selectAmount = useDeferredValue(selectedAmount);
  const totalAmount = roundTwoDecimals(orderTotal * (1 + vat / 100));
  const diffAmount = Number(selectedAmount) - totalAmount;
  const amountToGive = diffAmount === totalAmount || diffAmount < 0 ? 0 : diffAmount;
  const isDisabled = diffAmount < 0;
  const isEnoughMoney = isCashPayment ? !isDisabled : true;

  const changeGivenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const recoveredValue = keepDigitsInText(e.target.value);
    if (!recoveredValue || recoveredValue === "") setSelectedAmount(0);
    else setSelectedAmount(Number(recoveredValue));
  };

  useEffect(() => {
    const isOrderCompleted = orderStatus === EOrderStatus.COMPLETE;
    console.log(isOrderCompleted, orderStatus);
    if (isOrderCompleted) return router.replace(`/orders/${orderId}`);
  }, []);

  const handlePayOrder = async () => {
    setPayOrderLoading(true);
    const payOrderRes = await payOrder(Number(orderId), paymentType);
    if (payOrderRes.isPaid) router.replace("/");
    setPayOrderLoading(false);
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
              <RowAroundSp size={SIZE_SPACE_ROWS}>
                <CenteredLabel aria-label="transaction amount">
                  {t("payments.transaction-amount")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput
                  readOnly={true}
                  aria-label="transactionAmount"
                  id="transactionAmount"
                  value={convertPrice(totalAmount, "backToFront", false)}
                />
              </RowAroundSp>
              <Divider />
              <RowAroundSp size={SIZE_SPACE_ROWS}>
                <CenteredLabel htmlFor="selected amount" aria-label="given amount">
                  {t("payments.given-amount")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput
                  onChange={changeGivenAmount}
                  aria-label="selected amount"
                  id="selected amount"
                  value={selectAmount}
                />
              </RowAroundSp>
              <Divider />
              <RowAroundSp size={SIZE_SPACE_ROWS}>
                <CenteredLabel htmlFor="render" aria-label="amount to give">
                  {t("payments.amount-to-give")} ({displayCurrency()})
                </CenteredLabel>
                <LRoundedInput readOnly={true} aria-label="render" id="render" value={convertAmount(amountToGive)} />
              </RowAroundSp>
              <Divider />
            </Then>
            <Else>
              <RowCenter>
                <Title style={{ textAlign: "center" }}>This application doesn't contain a direct payment system.</Title>
              </RowCenter>
              <RowCenter>
                <Title>
                  Amount : {convertAmount(totalAmount)}
                  {displayCurrency()}
                </Title>
              </RowCenter>
              <Divider />
            </Else>
          </If>

          {/* cancel and confirm buttons */}
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
              disabled={!isEnoughMoney}
              onClick={() => handlePayOrder()}
            >
              {t("buttons.pay")}
            </RediIconButton>
          </RowCenterSp>
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
