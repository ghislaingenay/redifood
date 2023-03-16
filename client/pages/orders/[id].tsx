import { faCartShopping, faCashRegister, faCreditCard, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Space } from "antd";
import { useState } from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import SummaryTable from "../../src/components/food-order/SummaryTable";
import { RediIconButton } from "../../src/components/styling/Button.style";
import { CenteredCol, RowSpaceBetween } from "../../src/components/styling/grid.styled";
import RediRadioButton from "../../src/components/styling/RediRadioButton";
import { RED } from "../../src/constants";
import { hexToRgba } from "../../src/functions/global.fn";
import { EButtonType, EPaymentType, ServerInfo } from "../../src/interfaces";
import { LGCard } from "../../src/styles";
import { SpacingDiv5X } from "../../src/styles/styledComponents/div.styled";
import { mockOneOrder } from "../../test/mocks/mockOrdersData";
import { buildLanguage } from "../api/build-language";

const CurrentOrder = ({ currentOrder, status }: any) => {
  const { t } = useTranslation("");
  const router = useRouter();
  console.log(status);
  const { orderDate, orderId, tableNumber, orderStatus } = currentOrder;
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

  const alertMessage = orderStatus === "COMPLETE" ? t("orders.paid") : t("orders.not-paid");
  const messageType = orderStatus === "COMPLETE" ? "success" : "error";
  const colorAlert = orderStatus !== "COMPLETE" && hexToRgba(RED, 0.7);

  const colIdSpan = { xs: 12, sm: 12, md: 8, lg: 8 };
  return (
    <>
      <Head>
        <title>{t("orders.head-view.title")}</title>
        <meta name="description" content={t("orders.head-view.description") as string} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <SpacingDiv5X>
          <LGCard style={{ padding: "0 1rem" }}>
            <RowSpaceBetween>
              <CenteredCol {...colIdSpan}>
                <b>{t("glossary.order")} #</b>
                {orderId}
              </CenteredCol>
              <CenteredCol {...colIdSpan}>
                <b aria-label="Table number">{t("glossary.table")}</b> {tableNumber}
              </CenteredCol>
              <CenteredCol {...colIdSpan}>
                <b>{t("glossary.date")}</b> {orderDate}
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
          {orderStatus !== "COMPLETE" && (
            <>
              <RediRadioButton
                radioGroupName="payment"
                padding="1rem 1rem"
                fontSize="1rem"
                options={radioPaymentOptions}
                haveIcon="true"
                setSelectedButton={setPaymentChoice}
                selectedButton={paymentChoice}
              />
              <Space>
                <RediIconButton
                  onClick={() => router.push(`/orders/${orderId}/payment/${paymentChoice}`)}
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
          {orderStatus === "COMPLETE" && (
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
      </body>
    </>
  );
};
export default CurrentOrder;

export async function getServerSideProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  // context: any
  // const id: string = context.query["id"];
  return {
    props: {
      currentOrder: mockOneOrder,
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
}
