import { Col, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useRouter as Router } from "next/router";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { IFoodApi, IFoodGetApi, IFoodSectionListWithExtra, IOrderApi } from "../../../redifood-module/src/interfaces";
import { useFood } from "../../contexts/food.context";
import { handleCreateOrder } from "../../functions/create-order.fn";
import { setOptionsSelection } from "../../functions/food.fn";
import { checkIfArrayAreTheSame } from "../../functions/order.fn";
import { handleUpdateOrder } from "../../functions/update-order.fn";
import { useWindowSize } from "../../hooks/useWindowSIze.hook";
import { EFoodMode } from "../../interfaces/food.interface";
import { LGCard } from "../../styles";
import { AnimToTop } from "../../styles/animations/global.anim";
import RediRadioButton from "../styling/RediRadioButton";
import { RowCenter } from "../styling/grid.styled";
import FoodCard from "./FoodCard";
import FoodForm from "./FoodForm";
import OrderSection from "./OrderSection";

const { Title } = Typography;
interface IFoodLayoutProps {
  transaction?: IOrderApi;
  foods: IFoodGetApi[];
  mode: EFoodMode;
  updateFood?: (food: IFoodApi) => any;
  sectionList: IFoodSectionListWithExtra[];
  mainTitle: string;
}

const FoodLayout = ({ foods, mode, sectionList, mainTitle, transaction }: IFoodLayoutProps) => {
  const WIDTH_BREAKPOINT = 768;

  const router = useRouter();
  const routerClient = Router();
  const tableNo = Number(routerClient.query.tableNumber) || 0;

  const { foodOrder } = useFood();
  const [width] = useWindowSize();
  const [foodSection] = useState<IFoodSectionListWithExtra[]>(sectionList);
  const [foodList] = useState(foods);
  const [loading, setLoading] = useState(false);
  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSectionId, setSelectedSectionId] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<IFoodGetApi[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const isLargeScreen = width && width > WIDTH_BREAKPOINT;
  const isDisabled = foodOrder.length === 0 ? true : false;
  const isCreateMode = mode === EFoodMode.CREATE;
  const isAlterMode = mode === EFoodMode.ALTER;
  const ariaLabelMainTitle = isAlterMode ? "FOOD SECTION" : isCreateMode ? "CREATE ORDER" : "EDIT ORDER";

  const changeActiveButton = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    if (sectionId === 0) return setSortedFoods([...foodList]);
    const filteredfoods = [...foodList]?.filter((food) => food.itemSection.id === sectionId);
    return setSortedFoods([...filteredfoods]);
  };

  const handleSubmit = async (foodOrder: IFoodGetApi[]) => {
    setLoading(true);
    if (isCreateMode) {
      const res = await handleCreateOrder(foodOrder, Number(tableNo));
      if (res.success) return router.replace("/");
    } else {
      const res = await handleUpdateOrder(foodOrder, transaction as IOrderApi);
      if (res.success) return router.replace("/");
    }
    setLoading(false);
  };

  const handleCancel = (link: string) => {
    if (!checkIfArrayAreTheSame(foodOrder, currentOrder)) return setCancelOrderModal(true);
    router.push(link);
    return setCancelOrderModal(false);
  };

  useEffect(() => setCurrentOrder(foodOrder), []);

  const RenderLGCard = () => {
    return (
      <LGCard style={{ height: "100%", width: "100%" }}>
        <If condition={isAlterMode}>
          <Then>
            <FoodForm allFoods={foods} listSectionExtra={sectionList} />
          </Then>
          <Else>
            <OrderSection
              tableNumber={tableNo}
              mode={mode}
              transaction={transaction}
              loading={loading}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </Else>
        </If>
      </LGCard>
    );
  };

  return (
    <>
      <AnimToTop>
        <Title level={2} aria-label={ariaLabelMainTitle}>
          {mainTitle}
        </Title>
        <Row justify="space-around" gutter={[0, 20]} style={{ width: "100%" }}>
          <Col md={24} lg={15}>
            <RediRadioButton
              fontSize="1rem"
              padding="0.5rem 0.5rem"
              disabled={isDisabled}
              options={setOptionsSelection(foodSection) as any}
              radioGroupName="food"
              haveIcon="false"
              selectedButton={selectedSectionId}
              clickedFn={(id: number) => changeActiveButton(id)}
            />
            <Row gutter={[5, 10]}>
              {sortedFoods?.map((food, index) => (
                <Col key={index} xs={12} sm={12} md={8} lg={8} xl={6}>
                  <FoodCard foodList={foodList} food={food} mode={mode} />
                </Col>
              ))}
            </Row>
          </Col>

          <If condition={isLargeScreen}>
            <Then>
              <Col md={24} lg={8}>
                <RenderLGCard />
              </Col>
            </Then>
            <Else>
              <RowCenter style={{ marginTop: "1rem" }}>
                <RenderLGCard />
              </RowCenter>
            </Else>
          </If>
        </Row>
        <Modal
          title="Are u sure you want to cancel?"
          open={cancelOrderModal}
          onOk={() => router.push("/")}
          onCancel={() => setCancelOrderModal(!cancelOrderModal)}
        />
      </AnimToTop>
    </>
  );
};

export default FoodLayout;
