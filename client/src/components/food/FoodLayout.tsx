import { Alert, Card, Col, Divider, InputNumber, Modal, Row, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ButtonLayout from "../../../src/components/food/ButtonLayout";
import FoodOrderCard from "../../../src/components/food/FoodOrderCard";
import { RediButton } from "../../../src/components/RediButton";
import { ERROR_COLOR, LIGHT_GREY_COLOR, LIGHT_PRIMARY_COLOR } from "../../../src/constants/colors.const";
import { EFoodMode, IFood } from "../../../src/interfaces/food.interface";
import { noErrorInTable } from "../../constants";
import AppContext from "../../contexts/app.context";
import { sendErrorTableInput } from "../../functions/order.fn";
import { IErrorTableInput, TStatusProps } from "../../interfaces";

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
  const router = useRouter();
  const tableTaken = [1, 4, 5];

  const { setStatus } = useContext(AppContext);

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");
  const [foodOrder, setFoodOrder] = useState([]);

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

  const checkIfArrayAreTheSame = (array1: IFood[], array2: IFood[]) => {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i].itemId !== array2[i].itemId) {
        return false;
      }
    }
    return true;
  };
  const handleCancel = (link: string) => {
    if (!checkIfArrayAreTheSame(foodOrder, currentOrder)) {
      return setCancelOrderModal(true);
    }
    router.push(link);
    return setCancelOrderModal(false);
  };

  const loadData = async () => {
    setStatus(status);
    setCurrentOrder(orderList);
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
            <Title level={5}>Food List</Title>
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
                type="number"
                value={tableNumberValue}
                onChange={(e) => {
                  if (typeof e === "number") {
                    setTableNumberValue(Number(e));
                  } else {
                    setTableNumberValue(null);
                  }
                }}
                name="tableNumber"
                min={0}
                aria-label="tableNumber"
                style={{ height: "50%", top: "0.5rem", marginLeft: "1rem" }}
                placeholder="Select a table number"
              />
              {errorTable.alreadyInDb && <Alert type="error" message="This table number is already allocated" />}
              {errorTable.missingValue && <Alert type="error" message="Please select a table number" />}
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

            <RediButton
              typeButton="error"
              shape="round"
              title={<b>Cancel order</b>}
              haveIcon={true}
              onClick={() => handleCancel("/")}
            />
          </Card>
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
