import { AxiosResponse } from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IFoodGetApi, IFoodSectionListWithExtra } from "../../../redifood-module/src/interfaces";
import FoodLayout from "../../../src/components/food-order/FoodLayout";
import { useFood } from "../../../src/contexts/food.context";
import { EFoodMode } from "../../../src/interfaces/food.interface";
import buildClient from "../../api/build-client";
import { buildLanguage } from "../../api/build-language";

interface ICreateOrderProps {
  foodList: IFoodGetApi[];
  sectionExtraList: IFoodSectionListWithExtra[];
}
const CreateOrder = ({ foodList, sectionExtraList }: ICreateOrderProps) => {
  const { setFoodOrder } = useFood();
  const { t } = useTranslation("common");

  useEffect(() => setFoodOrder([]), []);

  return (
    <>
      <Head>
        <title>{t("orders.head-create.title")}</title>
        <meta name="description" content={t("orders.head-create.description") as string} />
      </Head>
      <main>
        <FoodLayout
          sectionList={sectionExtraList}
          foods={foodList}
          mode={EFoodMode.CREATE}
          mainTitle={t("orders.create-order")}
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
    .then(async (res) => {
      const {
        data: {
          results: { foodResults, sectionExtraList },
        },
      } = res as AxiosResponse<{
        results: { foodResults: IFoodGetApi[]; sectionExtraList: IFoodSectionListWithExtra[] };
      }>;
      return {
        props: {
          foodList: foodResults,
          sectionExtraList,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          foodList: [],
          sectionExtraList: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });
  return res;
}
