import { faCartShopping, faCashRegister, faCreditCard, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Space } from "antd";
import moment from "moment";
import { useState } from "react";

import { AxiosResponse } from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { EOrderStatus, EPaymentType, IGetOneOrder, IGetServerSideData } from "../../redifood-module/src/interfaces";
import SummaryTable from "../../src/components/food-order/SummaryTable";
import { RediIconButton } from "../../src/components/styling/Button.style";
import RediRadioButton from "../../src/components/styling/RediRadioButton";
import { CenteredCol, RowSpaceBetween } from "../../src/components/styling/grid.styled";
import { RED } from "../../src/constants";
import { hexToRgba } from "../../src/functions/global.fn";
import { recoverQuantityFromOrderItems } from "../../src/functions/order.fn";
import { EButtonType } from "../../src/interfaces";
import { LGCard } from "../../src/styles";
import { AnimToTop } from "../../src/styles/animations/global.anim";
import { SpacingDiv5X } from "../../src/styles/styledComponents/div.styled";
import buildClient from "../api/build-client";
import { buildLanguage } from "../api/build-language";

interface ICurrentOrderProps {
  currentOrder: IGetOneOrder["currentOrder"];
  foodList: IGetOneOrder["foodList"];
}

const CurrentOrder = ({ currentOrder, foodList }: ICurrentOrderProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { orderCreatedDate, orderNo, orderTableNumber, orderStatus, id, orderFinished, orderTotal } = currentOrder;
  console.log({ orderFinished, orderCreatedDate, orderStatus });
  const COL_ID_SPAN = { xs: 12, sm: 12, md: 8, lg: 8 };

  console.log({ foodList });

  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);

  const isOrderCompleted = orderStatus === EOrderStatus.COMPLETE;
  const appliedDate = moment(orderFinished || orderCreatedDate).format("DD/MM/YYYY HH:mm");

  const isDisabled = paymentChoice === null ? true : false;
  const alertMessage = isOrderCompleted ? t("orders.paid") : t("orders.not-paid");
  const messageType = isOrderCompleted ? "success" : "error";
  const colorAlert = !isOrderCompleted && hexToRgba(RED, 0.7);

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
                <CenteredCol {...COL_ID_SPAN}>
                  <b>{t("glossary.order")} #</b>
                  {orderNo}
                </CenteredCol>
                <CenteredCol {...COL_ID_SPAN}>
                  <b aria-label="Table number">{t("glossary.table")}</b> {orderTableNumber}
                </CenteredCol>
                <CenteredCol {...COL_ID_SPAN}>
                  <b>{t("glossary.date")}</b> {appliedDate}
                </CenteredCol>
                <CenteredCol {...COL_ID_SPAN}>
                  <Alert
                    type={messageType}
                    message={alertMessage}
                    style={{ fontWeight: 700, color: colorAlert as string }}
                  />
                </CenteredCol>
              </RowSpaceBetween>
            </LGCard>
            <SummaryTable orderTotal={orderTotal} foodList={foodList} />
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
  const url = `/api/orders/${id}`;
  const response = await client
    .get(url)
    .then(async (res: AxiosResponse<IGetServerSideData<IGetOneOrder>>) => {
      const {
        data: { results },
      } = res;
      const { currentOrder, foodList: allFoods } = results as IGetOneOrder;
      const orderItems = currentOrder.orderItems;
      const updatedFoods = recoverQuantityFromOrderItems(orderItems, [...allFoods]);
      return {
        props: {
          currentOrder,
          foodList: updatedFoods,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          currentOrder: [],
          foodList: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });

  return response;
}
