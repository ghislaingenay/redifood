import { Card, Col, Divider, InputNumber, Row, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import ButtonLayout from "../../../src/components/food/ButtonLayout";
import FoodOrderCard from "../../../src/components/food/FoodOrderCard";
import { RediButton } from "../../../src/components/RediButton";
import { ERROR_COLOR, LIGHT_GREY_COLOR, LIGHT_PRIMARY_COLOR } from "../../../src/constants/colors.const";
import { EFoodMode, IFood } from "../../../src/interfaces/food.interface";
import AppContext from "../../contexts/app.context";
import { sendErrorIfTableTaken } from "../../functions/order.fn";
import { TStatusProps } from "../../interfaces";

const { Title } = Typography;
interface IFoodLayoutProps {
  status: TStatusProps;
  foodOrder: IFood[];
  foodList: IFood[];
  mode: EFoodMode;
  handleOrderCreate?: (foodOrder: IFood[]) => any;
  editOrder?: (foodOrder: IFood[]) => any;
  updateFood?: (food: IFood) => any;
  foodSection: string[];
  mainTitle: string;
}

const FoodLayout = ({
  foodOrder: orderList,
  foodList,
  mode,
  foodSection,
  mainTitle,
  handleOrderCreate,
  status,
}: IFoodLayoutProps) => {
  const tableTaken = [1, 4, 5];

  const { setStatus } = useContext(AppContext);

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");
  const [foodOrder, setFoodOrder] = useState([]);

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState({ alredyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const changeActiveButton = (sectionName: string) => {
    console.log("section", sectionName);
    if (sectionName === "all") {
      return setSortedFoods(foodList);
    }
    let filteredfoods = foodList?.filter((food) => food.itemSection === sectionName);
    setSortedFoods(filteredfoods);
  };

  const addFoodToCart = (foodId: IFood["itemId"]) => {
    const foundFound = foodOrder.find((food) => food.itemId === foodId);
    if (foundFound) {
      let currentOrder = [...foodOrder];
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].itemId === foundFound.itemId) {
          currentOrder[i].itemQuantity += 1;
        }
      }
      setFoodOrder(currentOrder);
    } else {
      let newFood = foodList.find((food) => food.itemId === foodId);
      newFood.itemQuantity = 1;
      console.log("newFood", newFood);
      const currentOrder: any = [...foodOrder];
      currentOrder.push(newFood);
      setFoodOrder(currentOrder);
    }
  };

  const handleDeleteFood = (foodId) => {
    const updatedOrder = [...foodOrder].filter((food) => food.itemId !== foodId);
    setFoodOrder(updatedOrder);
  };

  const handleQty = (foodId, type: "add" | "remove") => {
    const currentOrder = [...foodOrder];
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i].itemId === foodId) {
        let currentFood = currentOrder[i];
        type === "remove" ? (currentFood.itemQuantity -= 1) : (currentFood.itemQuantity += 1);
      }
    }
    setFoodOrder(currentOrder);
  };

  const calculateTotal = (foodOrder) => {
    if (foodOrder.length === 0) {
      return 0;
    }
    return [...foodOrder].map((food) => food.itemQuantity * food.itemPrice).reduce((t, e) => t + e);
  };
  const handleSubmit = (foodOrder: IFood[]) => {
    switch (mode) {
      case EFoodMode.CREATE: {
        if (!errorTable.alredyInDb && (tableNumberValue !== null || tableNumberValue !== 0)) {
          setErrorTable((prevValue) => {
            return { ...prevValue, missingValue: false };
          });
          handleOrderCreate(foodOrder);
        } else {
          setErrorTable((prevValue) => {
            return { ...prevValue, missingValue: true };
          });
        }
      }
      default: {
      }
    }
  };

  const handleOnBlur = () => {
    if (sendErrorIfTableTaken(tableNumberValue, tableTaken)) {
      setErrorTable((prevValue) => {
        return { ...prevValue, alreadyInDb: true };
      });
    } else {
      setErrorTable((prevValue) => {
        return { ...prevValue, alreadyInDb: false };
      });
    }
  };

  const loadData = async () => {
    setStatus(status);
    setFoodOrder(orderList);
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
          <Row>
            <Title level={5} className="mt-0">
              Food List
            </Title>
          </Row>
          <ButtonLayout
            changeActiveButton={changeActiveButton}
            foodSection={foodSection}
            setSelectedSection={setSelectedSection}
            selectedSection={selectedSection}
          />
          <Row gutter={[5, 10]}>
            {sortedFoods.map((food, index) => (
              <Col key={index} lg={6}>
                <Card
                  style={{
                    textAlign: "center",
                    backgroundColor: LIGHT_GREY_COLOR,
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                  }}
                  onClick={() => {
                    addFoodToCart(food.itemId);
                  }}
                  role="card"
                >
                  <Image
                    style={{ textAlign: "center", marginBottom: "0.5rem" }}
                    alt={`Food ${food.itemName}`}
                    src={food.itemPhoto}
                    width={150}
                    height={150}
                  />
                  <div style={{ fontWeight: "bold", alignContent: "center", justifyContent: "center" }}>
                    {food.itemName}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={8}>
          <Card style={{ backgroundColor: LIGHT_GREY_COLOR, boxShadow: "0 0 1rem rgba(0,0,0,0.3)", height: "100vh" }}>
            <Row justify="center" align="middle">
              <Title level={5}>Table Number:</Title>
              <InputNumber
                value={tableNumberValue}
                onChange={(e) => {
                  setTableNumberValue(e);
                }}
                onBlur={handleOnBlur}
                name="tableNumber"
                min={0}
                aria-label="tableNumber"
                style={{ height: "50%", top: "0.5rem", marginLeft: "1rem" }}
                placeholder="Select a table number"
              />
              {errorTable.alredyInDb && <p>This table number is already allocated</p>}
            </Row>
            <Divider style={{ border: `0.125rem solid ${LIGHT_PRIMARY_COLOR}` }} />
            <Title level={5} className="text-center">
              Order List
            </Title>
            {foodOrder?.map((food) => (
              <FoodOrderCard key={food.itemId} handleDeleteFood={handleDeleteFood} handleQty={handleQty} food={food} />
            ))}
            {foodOrder.length > 0 && (
              <Title level={5} className="text-center" style={{ color: ERROR_COLOR }}>
                Total: {calculateTotal(foodOrder).toFixed(2)} $
              </Title>
            )}
            <RediButton
              typeButton="success"
              shape="round"
              disabled={isDisabled}
              title={<b>Validate</b>}
              haveIcon={false}
              onClick={() => handleSubmit(foodOrder)}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FoodLayout;
