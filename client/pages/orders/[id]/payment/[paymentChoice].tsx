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
import { NotificationRes } from "../../../../src/definitions/notification.class";
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

  const totalAmount = orderTotal * (1 + vat / 100);

  const diffAmount = Number(selectedAmount) - totalAmount;
  const amountToGive = diffAmount === totalAmount || diffAmount < 0 ? 0 : diffAmount;
  const isDisabled = selectedAmount && Number(selectedAmount) >= orderTotal && diffAmount > 0 ? false : true;

  const handlePayOrder = () => {
    setPayOrderLoading(true);
    AxiosFunction({
      url: `api/orders/${orderId}`,
      body: {},
      queryParams: { paymentType },
      method: "post",
    })
      .then(() => {
        NotificationRes.onSuccess({
          placement: "top",
          title: "Payment successful",
          description: "You will be redirected to the main page",
        });
        setTimeout(() => {
          router.replace("/");
          setPayOrderLoading(false);
        }, 1000);
      })
      .catch(() => {
        NotificationRes.onFailure({
          placement: "top",
          title: "Please try again",
          description:
            "An error occured during the process. If this issue occur multiple times, please contact Redifood team",
        });
      });
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
                <Col span={24}>
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
