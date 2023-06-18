import { faCartShopping, faCashRegister, faCreditCard, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Space } from "antd";
import { useState } from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { EOrderStatus, EPaymentType, IFoodOrder, IOrderApi } from "../../redifood-module/src/interfaces";
import SummaryTable from "../../src/components/food-order/SummaryTable";
import { RediIconButton } from "../../src/components/styling/Button.style";
import RediRadioButton from "../../src/components/styling/RediRadioButton";
import { CenteredCol, RowSpaceBetween } from "../../src/components/styling/grid.styled";
import { RED } from "../../src/constants";
import { hexToRgba } from "../../src/functions/global.fn";
import { EButtonType } from "../../src/interfaces";
import { LGCard } from "../../src/styles";
import { AnimToTop } from "../../src/styles/animations/global.anim";
import { SpacingDiv5X } from "../../src/styles/styledComponents/div.styled";
import buildClient from "../api/build-client";
import { buildLanguage } from "../api/build-language";

interface ICurrentOrderProps {
  currentOrder: IOrderApi<IFoodOrder[]>
  status: string;
}


const CurrentOrder = ({ currentOrder, status }: ICurrentOrderProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  console.log(status);
  const { orderCreatedDate, id, orderTableNumber, orderStatus } = currentOrder;
  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);

  const isDisabled = paymentChoice === null ? true : false;
  const radioPaymentOptions = [
    {
      label: EPaymentType.CASH,
      value: EPaymentType.CASH,
      icon: <FontAwesomeIcon icon={faCashRegister} />,
      ariaLabel: EPaymentType.CASH,
    },
    {
      label: EPaymentType.CARD,
      value: EPaymentType.CARD,
      icon: <FontAwesomeIcon icon={faCreditCard} />,
      ariaLabel: EPaymentType.CARD,
    },
  ];

  const changePaymentChoice = (e: EPaymentType) => setPaymentChoice(e);

  const alertMessage = orderStatus === EOrderStatus.COMPLETE ? t("orders.paid") : t("orders.not-paid");
  const messageType = orderStatus === EOrderStatus.COMPLETE ? "success" : "error";
  const colorAlert = orderStatus !== EOrderStatus.COMPLETE && hexToRgba(RED, 0.7);

  const colIdSpan = { xs: 12, sm: 12, md: 8, lg: 8 };
  return (
    <>
      <Head>
        <title>{t("orders.head-view.title")}</title>
        <meta name="description" content={t("orders.head-view.description") as string} />
      </Head>
      <body>
        <AnimToTop>
          <SpacingDiv5X>
            <LGCard style={{ padding: "0 1rem" }}>
              <RowSpaceBetween>
                <CenteredCol {...colIdSpan}>
                  <b>{t("glossary.order")} #</b>
                  {id}
                </CenteredCol>
                <CenteredCol {...colIdSpan}>
                  <b aria-label="Table number">{t("glossary.table")}</b> {orderTableNumber}
                </CenteredCol>
                <CenteredCol {...colIdSpan}>
                  <b>{t("glossary.date")}</b> {orderCreatedDate}
                </CenteredCol>
                <CenteredCol {...colIdSpan}>
                  <Alert
                    type={messageType}
                    message={alertMessage}
                    style={{ fontWeight: 700, color: colorAlert as string }}
                  />
                </CenteredCol>
              </RowSpaceBetween>
            </LGCard>
            <SummaryTable order={currentOrder} />
            {orderStatus !== EOrderStatus.COMPLETE && (
              <>
                <RediRadioButton
                  radioGroupName="payment"
                  padding="1rem 1rem"
                  fontSize="1rem"
                  options={radioPaymentOptions}
                  haveIcon="true"
                  clickedFn={changePaymentChoice}
                  selectedButton={paymentChoice}
                />
                <Space>
                  <RediIconButton
                    onClick={() => router.push(`/orders/${id}/payment/${paymentChoice}`)}
                    iconFt={faCartShopping}
                    disabled={isDisabled}
                    buttonType={EButtonType.SUCCESS}
                    aria-label="PAY"
                  >
                    {t("buttons.pay")}
                  </RediIconButton>
                </Space>
              </>
            )}
            {orderStatus === EOrderStatus.COMPLETE && (
              <RediIconButton
                // onClick={() => router.push(`/orders/${orderId}/payment/${paymentChoice}`)}
                iconFt={faReceipt}
                buttonType={EButtonType.DISPLAY}
                aria-label="RECEIPT"
              >
                {t("buttons.receipt")}
              </RediIconButton>
            )}
          </SpacingDiv5X>
        </AnimToTop>
      </body>
    </>
  );
};
export default CurrentOrder;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const getLanguageValue = buildLanguage(locale, req);
    const client = buildClient(appContext);
  const id: string = appContext.query["id"];
  const res: any = await client
      .get(`/api/orders/${id}`)
      .catch(async () => {
        return {
          props: {
            currentOrder: [],
            status: 'error',
            ...(await serverSideTranslations(getLanguageValue, ["common"])),
          },
        };
      });
    const {data: {results: {currentOrder}}} = res;
    return {
      props: {
        currentOrder, status:'success',
        ...(await serverSideTranslations(getLanguageValue, ["common"])),
      }
    }
}