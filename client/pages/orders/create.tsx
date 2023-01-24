import { LIGHT_GREY_COLOR, LIGHT_PRIMARY_COLOR } from "@constants/colors.const";
import { Card, Col, Divider, InputNumber, Row, Typography } from "antd";
import Image from "next/image";
import { useContext, useState } from "react";
import ButtonLayout from "src/components/food/ButtonLayout";
import FoodOrderCard from "src/components/food/FoodOrderCard";
import { RediButton } from "src/components/RediButton";
import AppContext from "src/contexts/app.context";
import { foodSectionArray, mockedFoodData } from "../../test/mocks/mockFoodData";

const { Title } = Typography;

const CreateOrder = ({ foodList, foodSection, status }) => {
  const appValue = useContext(AppContext);
  appValue.setStatus(status);
  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");
  const [foodOrder, setFoodOrder] = useState([]);

  const isDisabled = foodOrder.length === 0 ? true : false;
  const canCancel = foodOrder.length === 0 ? false : true;

  const changeActiveButton = (sectionName: string) => {
    console.log("section", sectionName);
    if (sectionName === "all") {
      return setSortedFoods(foodList);
    }
    let filteredfoods = foodList?.filter((food) => food.itemSection === sectionName);
    setSortedFoods(filteredfoods);
  };

  const addFoodToCart = (foodId: string) => {
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

  const handleOrderCreate = () => {
    // Recover info
    // Add missing data
    // axios
  };

  return (
    <>
      <Title level={2}>Create order</Title>
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
            {/* <If condition={selectedSection === "all"}>
              <Then> */}
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
            {/* </Then>
              <Else>
                {sortedFoods?.map((onetype) => {
                  // key: name of the extra
                  return (
                    <>
                      <Divider key={onetype} />
                      <Row>{onetype?.extra}</Row>
                      <Row gutter={20}>
                        {onetype?.foods?.map((food) => {
                          return (
                            <Col key={food.itemId} lg={8}>
                              <Card role="card">
                                <Button>{food.itemName}</Button>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </>
                  );
                })}
              </Else>
            </If> */}
          </Row>
        </Col>
        <Col lg={8}>
          <Card style={{ backgroundColor: LIGHT_GREY_COLOR, boxShadow: "0 0 1rem rgba(0,0,0,0.3)", height: "100vh" }}>
            <Row justify="center">
              <Title level={5} className="mr-4 mt-0 pt-1">
                Table Number:
              </Title>
              <InputNumber
                name="tableNumber"
                min={0}
                aria-label="tableNumber"
                className="h-1/2"
                placeholder="Select a table number"
              />
            </Row>
            <Divider style={{ border: `0.125rem solid ${LIGHT_PRIMARY_COLOR}` }} />
            <Title level={5} className="text-center">
              Order List
            </Title>
            {foodOrder?.map((food) => (
              <FoodOrderCard key={food.itemId} handleDeleteFood={handleDeleteFood} handleQty={handleQty} food={food} />
            ))}

            <RediButton
              typeButton="success"
              shape="round"
              disabled={isDisabled}
              title={<b>Validate</b>}
              haveIcon={false}
              onClick={handleOrderCreate}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateOrder;

export async function getServerSideProps() {
  return {
    props: { foodList: mockedFoodData, foodSection: foodSectionArray, status: "error" },
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
