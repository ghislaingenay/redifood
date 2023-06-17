import { AxiosResponse } from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IFoodApi, IFoodSectionList } from "../../redifood-module/src/interfaces";
import FoodLayout from "../../src/components/food-order/FoodLayout";
import { useFood } from "../../src/contexts/food.context";
import { NotificationRes } from "../../src/definitions/notification.class";
import { EFoodMode } from "../../src/interfaces/food.interface";
import buildClient from "../api/build-client";
import { buildLanguage } from "../api/build-language";

interface ICreateOrderProps {
  foodList: IFoodApi[];
  foodSection: IFoodSectionList[];
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
  };

  useEffect(() => {
    setFoodOrder([]);
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
  const url = "/api/foods/all";
  const res: any = await client
    .get(url)
    .catch(async () => {
      return {
        props: {
          foodList: [],
          foodSection: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });
      const {
        data: {
          results: { foodResults, sectionList },
        },
      } = res as AxiosResponse<{ results: { foodResults: IFoodApi[], sectionList: IFoodSectionList[] } }>;
      return {
        props: {
          foodList: foodResults,
          foodSection: sectionList,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    }

