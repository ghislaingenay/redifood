import { Col, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { toast } from "react-toastify";
import { AxiosFunction } from "../../../pages/api/axios-request";
import {
  EOrderStatus,
  IFoodApi,
  IFoodOrder,
  IFoodSectionList,
  IGetServerSideData,
  IOrderApi,
} from "../../../redifood-module/src/interfaces";
import { noErrorInTable } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { handleCreateOrder } from "../../functions/create-order.fn";
import { setOptionsSelection } from "../../functions/food.fn";
import { checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { handleUpdateOrder } from "../../functions/update-order.fn";
import { useWindowSize } from "../../hooks/useWindowSIze.hook";
import { IErrorTableInput } from "../../interfaces";
import { EFoodMode } from "../../interfaces/food.interface";
import { LGCard } from "../../styles";
import { AnimToTop } from "../../styles/animations/global.anim";
import RediRadioButton from "../styling/RediRadioButton";
import { RowCenter, RowSpaceBetween } from "../styling/grid.styled";
import FoodCard from "./FoodCard";
import FoodForm from "./FoodForm";
import OrderSection from "./OrderSection";

const { Title } = Typography;
interface IFoodLayoutProps {
  transaction?: IOrderApi;
  foods: IFoodApi[];
  mode: EFoodMode;
  updateFood?: (food: IFoodApi) => any;
  sectionList: IFoodSectionList[];
  mainTitle: string;
}

const FoodLayout = ({ foods, mode, sectionList, mainTitle, transaction }: IFoodLayoutProps) => {
  const WIDTH_BREAKPOINT = 768;

  const router = useRouter();
  const { foodOrder } = useFood();
  const [width] = useWindowSize();

  const [foodSection] = useState<IFoodSectionList[]>(sectionList);
  const [foodList] = useState(foods);
  const [loading, setLoading] = useState(false);
  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSectionId, setSelectedSectionId] = useState(0);
  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const [currentOrder, setCurrentOrder] = useState<IFoodApi[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [tableTakenList, setTableTakenList] = useState<number[]>([]);

  const isLargeScreen = width && width > WIDTH_BREAKPOINT;
  const isDisabled = foodOrder.length === 0 ? true : false;
  const isCreateMode = mode === EFoodMode.CREATE;
  const ariaLabelMainTitle =
    mode === EFoodMode.ALTER ? "FOOD SECTION" : mode === EFoodMode.CREATE ? "CREATE ORDER" : "EDIT ORDER";

  const changeActiveButton = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    if (sectionId === 0) return setSortedFoods([...foodList]);
    const filteredfoods = [...foodList]?.filter((food) => food.sectionId === sectionId);
    return setSortedFoods([...filteredfoods]);
  };

  const getTakenTableNumber = async () => {
    AxiosFunction({
      method: "get",
      url: "api/orders/table",
      body: {},
      queryParams: {},
    })
      .then((res: IGetServerSideData<number[]>) => {
        const { results } = res;
        results && setTableTakenList(results);
      })
      .catch(() => toast.error("Error getting table number"));
  };

  const handleSubmit = async (foodOrder: IFoodApi[]) => {
    setLoading(true);
    switch (mode) {
      case EFoodMode.CREATE: {
        const result = sendErrorTableInput(tableNumberValue as number, tableTakenList);
        if (result === noErrorInTable) {
          const res = await handleCreateOrder(foodOrder, tableNumberValue as number);
          if (res.success) router.replace("/");
          else setLoading(false);
        } else setErrorTable(result);
      }
      case EFoodMode.EDIT: {
        const res = await handleUpdateOrder(foodOrder, transaction as IOrderApi);
        if (res.success) router.replace("/");
        else setLoading(false);
      }
      default:
    }
  };

  const handleCancel = (link: string) => {
    if (!checkIfArrayAreTheSame(foodOrder, currentOrder)) return setCancelOrderModal(true);
    router.push(link);
    return setCancelOrderModal(false);
  };

  const loadData = async () => setCurrentOrder(foodOrder);

  useEffect(() => {
    if (isCreateMode) getTakenTableNumber();
    loadData();
  }, []);

  const renderLGCard = () => {
    return (
      <LGCard style={{ height: "100%", width: "100%" }}>
        <If condition={mode !== EFoodMode.ALTER}>
          <Then>
            <OrderSection
              tableNumber={tableNumberValue}
              setTableNumber={setTableNumberValue}
              mode={mode}
              loading={loading}
              errorTable={errorTable}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </Then>
          <Else>
            <FoodForm foodSection={foodSection} foodList={foodList} />
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
        <RowSpaceBetween gutter={[0, 20]} style={{ width: "100%" }}>
          <Col md={24} lg={15}>
            <RediRadioButton
              fontSize="1rem"
              padding="0.5rem 0.5rem"
              disabled={isDisabled}
              options={setOptionsSelection(foodSection) as any}
              radioGroupName="food"
              haveIcon="false"
              selectedButton={selectedSectionId}
              clickedFn={changeActiveButton}
            />
            <Row gutter={[5, 10]}>
              {sortedFoods?.map((food, index) => (
                <Col key={index} xs={12} sm={12} md={8} lg={8} xl={6}>
                  <FoodCard foodList={foodList} food={food} mode={mode} />
                </Col>
              ))}
            </Row>
          </Col>

          {isLargeScreen && (
            <Col md={24} lg={8}>
              {renderLGCard()}
            </Col>
          )}
        </RowSpaceBetween>
        {!isLargeScreen && <RowCenter style={{ marginTop: "1rem" }}>{renderLGCard()}</RowCenter>}
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
