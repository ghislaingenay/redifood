import { Col, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { noErrorInTable } from "../../constants";
import AppContext from "../../contexts/app.context";
import { useFood } from "../../contexts/food.context";
import { getOptions } from "../../functions/global.fn";
import { checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { IErrorTableInput } from "../../interfaces";
import { EFoodMode, IFood } from "../../interfaces/food.interface";
import { LGCard } from "../../styles";
import RediRadioButton from "../styling/RediRadioButton";
import FoodCard from "./FoodCard";
import FoodForm from "./FoodForm";
import OrderSection from "./OrderSection";

const { Title } = Typography;
interface IFoodLayoutProps {
  status: string;
  foodList: IFood[];
  mode: EFoodMode;
  handleOrderCreate?: (foodOrder: IFood[]) => any;
  editOrder?: (foodOrder: IFood[]) => any;
  updateFood?: (food: IFood) => any;
  foodSection: string[];
  mainTitle: string;
}

const FoodLayout = ({ foodList, mode, foodSection, mainTitle, handleOrderCreate, status }: IFoodLayoutProps) => {
  const router = useRouter();
  const tableTaken = [1, 4, 5];

  const { setStatus } = useContext(AppContext);
  const { foodOrder } = useFood();

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const [currentOrder, setCurrentOrder] = useState<IFood[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const changeActiveButton = (sectionName: string) => {
    console.log("section", sectionName);
    if (sectionName === "all") {
      return setSortedFoods(foodList);
    }
    let filteredfoods = foodList?.filter((food) => food.itemSection === sectionName);
    setSortedFoods(filteredfoods);
  };

  const handleSubmit = (foodOrder: IFood[]) => {
    switch (mode) {
      case EFoodMode.CREATE: {
        const result = sendErrorTableInput(tableNumberValue, tableTaken);
        if (result === noErrorInTable) {
          handleOrderCreate(foodOrder);
        } else {
          setErrorTable(result);
        }
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
    setStatus(status);
    setCurrentOrder(foodOrder);
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title level={2}>{mainTitle}</Title>
      <Row gutter={[0, 40]} justify="space-between">
        <Col lg={15}>
          <RediRadioButton
            fontSize="1rem"
            padding="0.5rem 0.5rem"
            disabled={isDisabled}
            options={getOptions(foodSection)}
            radioGroupName="food"
            haveIcon="false"
            selectedButton={selectedSection}
            setSelectedButton={setSelectedSection}
            clickedFn={() => changeActiveButton(selectedSection)}
          />
          <Row gutter={[5, 10]}>
            {sortedFoods.map((food, index) => (
              <Col key={index} lg={6}>
                <FoodCard foodList={foodList} food={food} mode={mode} />
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={8}>
          <LGCard style={{ height: "100vh" }}>
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
          <Modal
            title="Are u sure you want to cancel?"
            open={cancelOrderModal}
            onOk={() => router.push("/")}
            onCancel={() => setCancelOrderModal(!cancelOrderModal)}
          />
        </Col>
      </Row>
    </>
  );
};

export default FoodLayout;
