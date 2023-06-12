import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IFoodApi } from "../../redifood-module/src/interfaces";
import FoodLayout from "../../src/components/food-order/FoodLayout";
import { useFood } from "../../src/contexts/food.context";
import { NotificationRes } from "../../src/definitions/notification.class";
import { EFoodMode } from "../../src/interfaces/food.interface";
import buildClient from "../api/build-client";
import { buildLanguage } from "../api/build-language";

interface ICreateOrderProps {
  foodList: IFoodApi[];
  foodSection: string[];
  status: string;
}
const CreateOrder = ({ foodList, foodSection, status }: ICreateOrderProps) => {
  const { setFoodOrder } = useFood();
  const { t } = useTranslation("common");
  const handleOrderCreate = (foodOrder: IFoodApi[]) => {
    console.log("order created", foodOrder);
    NotificationRes.onSuccess({
      title: "Order was succesfully created",
      description: "You will be redirected in 2 seconds",
      placement: "topRight",
    });
    // Recover info
    // Add missing data
    // axios
  };

  useEffect(() => {
    setFoodOrder([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{t("orders.head-create.title")}</title>
        <meta name="description" content={t("orders.head-create.description") as string} />
      </Head>
      <main>
        <FoodLayout
          status={status}
          sectionList={foodSection}
          foods={foodList}
          mode={EFoodMode.CREATE}
          mainTitle={t("orders.create-order")}
          handleOrderCreate={handleOrderCreate}
        />
      </main>
    </>
  );
};

export default CreateOrder;

export async function getServerSideProps(appContext: any) {
  const { locale, req } = appContext;
  const client = buildClient(appContext);
  const getLanguageValue = buildLanguage(locale, req);
  const url = "/api/food/all";
  await client
    .get(url)
    .then(async (res) => {
      const {
        data: {
          results: { foodList },
        },
      } = res;
      return {
        props: {
          foodList,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          foodList: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });
}
