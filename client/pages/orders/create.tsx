import { Button, Card, Col, Divider, InputNumber, Row, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { Else, If, Then } from "react-if";

const { Title } = Typography;

const CreateOrder = ({ foodList, foodSection, status }) => {
  const [globalStatus, setGlobalStatus] = useState(status);
  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");

  const [foodOrder, setFoodOrder] = useState([]);
  const isDisabled = foodOrder.length === 0 ? true : false;
  const canCancel = foodOrder.length === 0 ? false : true;
  return (
    <>
      <h1>Create Order</h1>
      <Row>
        <Col lg={16}>
          <Row>Food List</Row>
          <Row>
            <Col lg={6}>
              <Button name="all">ALL</Button>
            </Col>
            {foodSection.map((section, index) => (
              <Col key={index} lg={6}>
                <Button name={section}>{section.toUpperCase()}</Button>
              </Col>
            ))}
          </Row>
          <Row>
            <If condition={selectedSection === "all"}>
              <Then>
                {sortedFoods.map((food, index) => (
                  <Col key={index} lg={6}>
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
                      <Row>
                        {onetype?.foods?.map((food) => {
                          return (
                            <Col key={food.itemId} lg={6}>
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
        <Col lg={8}>
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
        </Col>
      </Row>
    </>
  );
};

export default CreateOrder;

export async function getServerSideProps() {
  await axios
    .get("/api/foods", { params: { selectedSection: "all" } })
    .then((res: any) => {
      const {
        data: { foodList, foodSection },
      } = res;
      return {
        props: { foodList, foodSection, status: "success" },
      };
    })
    .catch((err) => {
      console.log(err);
    });
  return {
    props: { foodList: [], foodSection: [], status: "error" },
  };
}
