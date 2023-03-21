import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { IFoodApi } from "../../redifood-module/src/interfaces";
import FoodLayout from "../../src/components/food-order/FoodLayout";
import { useFood } from "../../src/contexts/food.context";
import { NotificationRes } from "../../src/definitions/notification.class";
import { ServerInfo } from "../../src/interfaces";
import { EFoodMode } from "../../src/interfaces/food.interface";
import { foodSectionArray, mockedFoodData } from "../../test/mocks/mockFoodData";
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
        <link rel="icon" href="/favicon.ico" />
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
