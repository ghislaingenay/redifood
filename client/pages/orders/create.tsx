import { LIGHT_GREY_COLOR } from "@constants/colors.const";
import { Button, Card, Col, Divider, InputNumber, Row, Typography } from "antd";
import { useContext, useState } from "react";
import { Else, If, Then } from "react-if";
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

  const changeActiveButton = (e, sectionList: any, foods) => {
    for (let i = 0; i < sectionList.length; i++) {
      if (sectionList[i].name === e) {
        let foodSection = foods?.filter((food) => food.section === e);
        // Creation of a new state allowing to display the data properly
        let sorted = [];
        // From the section[i] => loop inside the extra
        for (let j = 0; j < sectionList[i].extra.length; j++) {
          let newArr = foodSection.filter((food) => food.extra === sectionList[i].extra[j]);
          sorted.push({ extra: sectionList[i].extra[j], foods: newArr });
        }
        return setSortedFoods(sorted);
      }
    }
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

          <Row justify="space-between" className="mb-2">
            <Col lg={4}>
              <RediButton
                name="all"
                haveIcon={false}
                typeButton="display"
                title="ALL"
                onClick={(e) => {
                  setSelectedSection(e.target.value);
                }}
              />
            </Col>
            {foodSection.map((section, index) => (
              <Col key={index} lg={4}>
                <RediButton
                  name={section}
                  haveIcon={false}
                  typeButton="display"
                  title={`${section.toUpperCase()}`}
                  onClick={(e) => {
                    setSelectedSection(e.target.value);
                  }}
                />
              </Col>
            ))}
          </Row>
          <Row gutter={20}>
            <If condition={selectedSection === "all"}>
              <Then>
                {sortedFoods.map((food, index) => (
                  <Col key={index} lg={4}>
                    <Card role="card">
                      <Button>{food.itemName}</Button>
                    </Card>
                  </Col>
                ))}
              </Then>
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
            </If>
          </Row>
        </Col>
        <Col lg={7}>
          <Card style={{ backgroundColor: LIGHT_GREY_COLOR }}>
            <Title level={5}>Table Number:</Title>
            <InputNumber name="tableNumber" aria-label="tableNumber" placeholder="Select a table number" />
            <Title level={5}>Order List:</Title>
            {foodOrder?.map((food) => (
              <Card key={food.itemId} role="card">
                {food.itemName}
                <Button>Remove</Button>
                {food.itemQuantity}
                <Button>Add</Button>
                <Button>Delete</Button>
              </Card>
            ))}

            <Button disabled={isDisabled}>Validate</Button>
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
