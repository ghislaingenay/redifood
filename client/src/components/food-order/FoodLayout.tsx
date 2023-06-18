import { Col, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { toast } from "react-toastify";
import { AxiosFunction } from "../../../pages/api/axios-request";
import { IFoodApi, IFoodSectionList, IGetServerSideData } from "../../../redifood-module/src/interfaces";
import { noErrorInTable } from "../../constants";
import AppContext from "../../contexts/app.context";
import { useFood } from "../../contexts/food.context";
import { checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { useWindowSize } from "../../hooks/useWindowSIze.hook";
import { IErrorTableInput } from "../../interfaces";
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
  status?: string;
  foods: IFoodApi[];
  mode: EFoodMode;
  handleOrderCreate?: (foodOrder: IFoodApi[], tableNumber: number) => any;
  editOrder?: (foodOrder: IFoodApi[]) => any;
  updateFood?: (food: IFoodApi) => any;
  sectionList: IFoodSectionList[];
  mainTitle: string;
}

const FoodLayout = ({
  foods,
  mode,
  sectionList,
  mainTitle,
  handleOrderCreate,
  status,
  editOrder,
}: IFoodLayoutProps) => {
  const router = useRouter();

  const { setStatus } = useContext(AppContext);
  const { foodOrder } = useFood();

  const [foodSection] = useState<IFoodSectionList[]>(sectionList);
  const [foodList] = useState(foods);

  const [width] = useWindowSize();
  const widthBreakPoint = 768;
  const isLargeScreen = width && width > widthBreakPoint;

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSectionId, setSelectedSectionId] = useState(0);

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const [currentOrder, setCurrentOrder] = useState<IFoodApi[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const [tableTakenList, setTableTakenList] = useState<number[]>([]);

  const changeActiveButton =(sectionId: number) => {
    setSelectedSectionId(sectionId)
    if (sectionId === 0) return setSortedFoods([...foodList]);
    const filteredfoods = [...foodList]?.filter((food) => food.sectionId === sectionId);
    return setSortedFoods([...filteredfoods]);
  }

  // api/orders/table
  const getTakenTableNumber = async () => {
    AxiosFunction({
      method: "get",
      url: "api/orders/table",
      body: {},
      queryParams: {}
    }).then((res: IGetServerSideData<number[]>) => {
      const { results} = res
      results && setTableTakenList(results)
    }).catch(() => toast.error("Error getting table number"))
  }


  const handleSubmit = (foodOrder: IFoodApi[]) => {
    switch (mode) {
      case EFoodMode.CREATE: {
        const result = sendErrorTableInput(tableNumberValue as number, tableTakenList);
        console.log('food order', foodOrder)
        if (result === noErrorInTable && handleOrderCreate) tableNumberValue && handleOrderCreate(foodOrder, tableNumberValue);
        else setErrorTable(result)
      }
      case EFoodMode.EDIT: {
        if (editOrder) editOrder(foodOrder);
      }
      default: {
      }
    }
  };
  // function that check if two array are the same

  const handleCancel = (link: string) => {
    if (!checkIfArrayAreTheSame(foodOrder, currentOrder)) {
      return setCancelOrderModal(true);
    }
    router.push(link);
    return setCancelOrderModal(false);
  };

  const loadData = async () => {
    setStatus(status as string);
    setCurrentOrder(foodOrder);
  };

  useEffect(() => {
    if (mode === EFoodMode.CREATE) getTakenTableNumber()
    loadData();
  }, []);

  const setOptionsSelection = (foodSection: IFoodSectionList[]) => {
    const newFoodSection = [{label: 'ALL', value: 0, ariaLabel: 'ALL'}]
    const  options = [...foodSection].map((section) => {
      return {
        label: section.sectionName,
        value: section.id,
        ariaLabel: section.sectionName
      };
    });
    return [...newFoodSection, ...options];
  }

  const renderLGCard = () => {
    return (
      <LGCard style={{ height: "100%", width: "100%" }}>
        <If condition={mode !== EFoodMode.ALTER}>
          <Then>
            <OrderSection
              tableNumber={tableNumberValue}
              setTableNumber={setTableNumberValue}
              mode={mode}
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

  const ariaLabelMainTitle =
    mode === EFoodMode.ALTER ? "FOOD SECTION" : mode === EFoodMode.CREATE ? "CREATE ORDER" : "EDIT ORDER";

  return (
    <>
      <AnimToTop>
        <Title level={2} aria-label={ariaLabelMainTitle}>
          {mainTitle}
        </Title>
        <Row gutter={[0, 20]} justify="space-between" style={{ width: "100%" }}>
          <Col md={24} lg={15}>
            <RediRadioButton
              fontSize="1rem"
              padding="0.5rem 0.5rem"
              disabled={isDisabled}
              options={setOptionsSelection(foodSection) as any}
              radioGroupName="food"
              haveIcon="false"
              selectedButton={selectedSectionId}
              // setSelectedButton={setSelectedSectionId}
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
        </Row>
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
