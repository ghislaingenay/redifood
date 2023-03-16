import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import FoodLayout from "../../src/components/food-order/FoodLayout";
import { useFood } from "../../src/contexts/food.context";
import { NotificationRes } from "../../src/definitions/notification.class";
import { ServerInfo } from "../../src/interfaces";
import { EFoodMode, IFood } from "../../src/interfaces/food.interface";
import { foodSectionArray, mockedFoodData } from "../../test/mocks/mockFoodData";
import { buildLanguage } from "../api/build-language";

interface ICreateOrderProps {
  foodList: IFood[];
  foodSection: string[];
  status: string;
}
const CreateOrder = ({ foodList, foodSection, status }: ICreateOrderProps) => {
  const { setFoodOrder } = useFood();
  const { t } = useTranslation("");
  const handleOrderCreate = (foodOrder: IFood[]) => {
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
          foodSection={foodSection}
          foodList={foodList}
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
