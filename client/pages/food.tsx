/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import FoodLayout from "../src/components/food-order/FoodLayout";
import { useFood } from "../src/contexts/food.context";
import { EFoodMode } from "../src/interfaces";
import { foodSectionArray, mockedFoodData } from "../test/mocks/mockFoodData";
import { buildLanguage } from "./api/build-language";

const FoodPage = ({ foodList, foodSection, status }) => {
  const { t } = useTranslation("");
  const { setFoodOrder } = useFood();

  useEffect(() => {
    setFoodOrder([]);
  }, []);

  return (
    <>
      <Head>
        <title>{t("foods.head.title")}</title>
        <meta name="description" content={t("foods.head.description")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FoodLayout
        status={status}
        foodSection={foodSection}
        foodList={foodList}
        mode={EFoodMode.ALTER}
        mainTitle={t("foods.title")}
      />
    </>
  );
};

export default FoodPage;

export async function getServerSideProps({ locale, req }) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      foodList: mockedFoodData,
      foodSection: foodSectionArray,
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
  // await axios
  //   .get("/api/foods", { params: { selectedSection: "all" } })
  //   .then((res: any) => {
  //     const {
  //       data: { foodList, foodSection },
  //     } = res;
  //     return {
  //       props: { foodList, foodSection, status: "success" },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // return {
  //   props: { foodList: [], foodSection: [], status: "error" },
  // };
}
