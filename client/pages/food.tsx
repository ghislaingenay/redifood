/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import FoodLayout from "../src/components/food-order/FoodLayout";
import { useFood } from "../src/contexts/food.context";
import { EFoodMode, IFood, ServerInfo } from "../src/interfaces";
import { foodSectionArray, mockedFoodData } from "../test/mocks/mockFoodData";
import { buildLanguage } from "./api/build-language";

interface IFoodProps {
  foodList: IFood[];
  foodSection: string[];
  status: string;
}
const FoodPage = ({ foodList, foodSection, status }: IFoodProps) => {
  const { t } = useTranslation("");
  const { setFoodOrder } = useFood();

  useEffect(() => {
    setFoodOrder([]);
  }, []);

  return (
    <>
      <Head>
        <title>{t("foods.head.title")}</title>
        <meta name="description" content={t("foods.head.description") as string} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FoodLayout
        status={status}
        sectionList={foodSection}
        foods={foodList}
        mode={EFoodMode.ALTER}
        mainTitle={t("foods.title")}
      />
    </>
  );
};

export default FoodPage;

export async function getServerSideProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      foodList: mockedFoodData,
      foodSection: foodSectionArray,
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };

  // const url = "/api/foods/all";
  // await axios
  //   .get(url })
  //   .then(async (res) => {
  //     const {
  //       data: { results: {foodList, foodSectionList} },
  //     } = res;
  //     return {
  //       props: { foodList: foodList, foodSectionList: foodSectionList, status: "success", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log("erre", err);
  //   });
  // return {
  //   props: { foodList: [], foodSectionList: [], status: "error", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  // };
}
