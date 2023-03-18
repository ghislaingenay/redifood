import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import FoodLayout from "../../../src/components/food-order/FoodLayout";
import { useFood } from "../../../src/contexts/food.context";
import { NotificationRes } from "../../../src/definitions/notification.class";
import { EFoodMode, IFood, ServerInfo } from "../../../src/interfaces";
import { foodSectionArray, mockedFoodData, mockOrderEdit } from "../../../test/mocks/mockFoodData";
import { buildLanguage } from "../../api/build-language";

interface IEditOrderProps {
  foodList: IFood[];
  currentFoodOrder: IFood[];
  foodSection: string[];
  status: string;
}

const EditOrder = ({ foodList, currentFoodOrder, foodSection, status }: IEditOrderProps) => {
  const { setFoodOrder } = useFood();
  const { t } = useTranslation("");
  const editOrder = (foodOrder: IFood[]) => {
    console.log("order edites", foodOrder);
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
    setFoodOrder(currentFoodOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{t("orders.head-edit.title")}</title>
        <meta name="description" content={t("orders.head-edit.description") as string} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <FoodLayout
          status={status}
          sectionList={foodSection}
          foods={foodList}
          mode={EFoodMode.EDIT}
          mainTitle={t("orders.edit-order")}
          editOrder={editOrder}
        />
      </body>
    </>
  );
};

export default EditOrder;

export async function getServerSideProps({ locale, req }: ServerInfo) {
  const getLanguageValue = buildLanguage(locale, req);
  return {
    props: {
      foodList: mockedFoodData,
      currentFoodOrder: mockOrderEdit,
      foodSection: foodSectionArray,
      status: "success",
      ...(await serverSideTranslations(getLanguageValue, ["common"])),
    },
  };
  // const url = "/api/orders/:id/foods";
  // await axios
  //   .get(url })
  //   .then(async (res) => {
  //     const {
  //       data: { results: {foodList, foodSectionList, currentOrder} },
  //     } = res;
  //     return {
  //       props: { foodList: foodList, foodSectionList: foodSectionList, currentOrder: currentOrder,  status: "success", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  //     };
  //   })
  //   .catch((err) => {
  //     console.log("erre", err);
  //   });
  // return {
  //   props: { foodList: [], foodSectionList: [],  currentOrder: [],status: "error", ...(await serverSideTranslations(getLanguageValue, ["common"])) },
  // };
}
