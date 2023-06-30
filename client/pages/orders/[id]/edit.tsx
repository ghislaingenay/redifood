import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IGetEditOrderRes } from "../../../redifood-module/src/interfaces";
import FoodLayout from "../../../src/components/food-order/FoodLayout";
import { useFood } from "../../../src/contexts/food.context";
import { EFoodMode } from "../../../src/interfaces";
import buildClient from "../../api/build-client";
import { buildLanguage } from "../../api/build-language";

type IEditOrderProps = IGetEditOrderRes;

const EditOrder = ({ foodList, orderItems, foodSection, order }: IEditOrderProps) => {
  const { setFoodOrder } = useFood();
  const { t } = useTranslation("common");

  const haveOrders = orderItems.length > 0;

  useEffect(() => {
    haveOrders && setFoodOrder(orderItems);
  }, []);

  return (
    <>
      <Head>
        <title>{t("orders.head-edit.title")}</title>
        <meta name="description" content={t("orders.head-edit.description") as string} />
      </Head>
      <body>
        <FoodLayout
          sectionList={foodSection}
          foods={foodList}
          mode={EFoodMode.EDIT}
          mainTitle={t("orders.edit-order")}
          transaction={order}
        />
      </body>
    </>
  );
};

export default EditOrder;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const getLanguageValue = buildLanguage(locale, req);
  const client = buildClient(appContext);
  const id: string = appContext.query["id"];
  const url = `/api/orders/${id}/edit`;
  const response: any = await client
    .get(url)
    .then(async (res) => {
      const {
        data: {
          results: { order, orderItems, foodList, foodSection },
        },
      } = res as any;

      return {
        props: {
          order,
          orderItems,
          foodList,
          foodSection,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          order: [],
          orderItems: [],
          status: "error",
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });
  return response;
}
