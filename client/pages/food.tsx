/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosResponse } from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IFoodApi, IFoodSectionList } from "../redifood-module/src/interfaces";
import FoodLayout from "../src/components/food-order/FoodLayout";
import { useFood } from "../src/contexts/food.context";
import { EFoodMode } from "../src/interfaces";
import buildClient from "./api/build-client";
import { buildLanguage } from "./api/build-language";

interface IFoodProps {
  foodList: IFoodApi[];
  foodSection: IFoodSectionList[];
}
const FoodPage = ({ foodList, foodSection }: IFoodProps) => {
  const { t } = useTranslation("common");
  const { setFoodOrder } = useFood();

  useEffect(() => {
    setFoodOrder([]);
  }, []);

  return (
    <>
      <Head>
        <title>{t("foods.head.title")}</title>
        <meta name="description" content={t("foods.head.description") as string} />
      </Head>
      <FoodLayout sectionList={foodSection} foods={foodList} mode={EFoodMode.ALTER} mainTitle={t("foods.title")} />
    </>
  );
};

export default FoodPage;

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
          results: { foodResults, sectionList },
        },
      } = res as AxiosResponse<{ results: { foodResults: IFoodApi[]; sectionList: IFoodSectionList[] } }>;
      return {
        props: {
          foodList: foodResults,
          foodSection: sectionList,
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    })
    .catch(async () => {
      return {
        props: {
          foodList: [],
          foodSection: [],
          ...(await serverSideTranslations(getLanguageValue, ["common"])),
        },
      };
    });
  return res;
}
