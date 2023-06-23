import { faCartShopping, faCashRegister, faCreditCard, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Space } from "antd";
import { useEffect, useState } from "react";

import { AxiosResponse } from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  EOrderStatus,
  EPaymentType,
  IFoodGetApi,
  IFoodOrder,
  IGetOneOrder,
  IGetServerSideData,
} from "../../redifood-module/src/interfaces";
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
  currentOrder: IGetOneOrder["currentOrder"];
  foodList: IGetOneOrder["foodList"];
}

const CurrentOrder = ({ currentOrder, foodList }: ICurrentOrderProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { orderCreatedDate, orderNo, orderTableNumber, orderStatus, id, orderFinished } = currentOrder;

  const COL_ID_SPAN = { xs: 12, sm: 12, md: 8, lg: 8 };

  const [paymentChoice, setPaymentChoice] = useState<EPaymentType | null>(null);
  const [displayedFoods, setDisplayedFoods] = useState<IGetOneOrder["foodList"]>(foodList);

  console.log({ orderCreatedDate, orderFinished });

  const appliedDate = orderStatus === EOrderStatus.COMPLETE ? orderFinished : orderCreatedDate;
  const humanFormattedAppliedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(appliedDate));

  const isDisabled = paymentChoice === null ? true : false;
  const isOrderCompleted = orderStatus === EOrderStatus.COMPLETE;
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
  const recoverQuantityFromOrderItems = (orderItems: IFoodOrder[], foodList: IFoodGetApi[]) => {
    return [...foodList].map((food) => {
      const foodInOrder = [...orderItems].find((orderItem) => orderItem.id === food.id);
      return {
        ...food,
        quantity: foodInOrder?.itemQuantity,
      };
    });
  };

  useEffect(() => {
    const orderItemsInOrder = currentOrder.orderItems;
    const updatedFoodList = recoverQuantityFromOrderItems(orderItemsInOrder, foodList);
    setDisplayedFoods(updatedFoodList);

    // move this logic in server side => better that way
    so client can ony focuses on what matters
  }, []);

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
                  <b>{t("glossary.date")}</b> {humanFormattedAppliedDate}
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
  const url = `/api/orders/${id}`;
  const response = await client
    .get(url)
    .then(async (res: AxiosResponse<IGetServerSideData<IGetOneOrder>>) => {
      const {
        data: { results },
      } = res;
      const { currentOrder, foodList } = results as IGetOneOrder;
      return {
        props: {
          currentOrder,
          foodList,
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
