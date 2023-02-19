import { Alert, Card, Col, Divider, InputNumber, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { getOptions } from "../../../pages";
import FoodOrderCard from "../../../src/components/food/FoodOrderCard";
import { EFoodMode, IFood } from "../../../src/interfaces/food.interface";
import { LIGHT_GREY, noErrorInTable, ORANGE, RED } from "../../constants";
import AppContext from "../../contexts/app.context";
import { useFood } from "../../contexts/food.context";
import { calculateTotal, checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { EButtonType, IErrorTableInput, TStatusProps } from "../../interfaces";
import { Scroll } from "../../styles/styledComponents/div.styled";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenter, RowCenterSp } from "../styling/grid.styled";
import RediRadioButton from "../styling/RediRadioButton";
import FoodCard from "./FoodCard";

const { Title } = Typography;
interface IFoodLayoutProps {
  status: TStatusProps;
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

  const isCreateMode = mode === EFoodMode.CREATE ? true : false;

  const { setStatus } = useContext(AppContext);
  const { foodOrder } = useFood();

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const isVisible = foodOrder.length > 0 ? "visible" : "hidden";

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
                <FoodCard foodList={foodList} food={food} />
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={8}>
          <Card style={{ backgroundColor: LIGHT_GREY, boxShadow: "0 0 1rem rgba(0,0,0,0.3)", height: "100vh" }}>
            <RowCenter>
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
                disabled={!isCreateMode ? true : false}
                name="tableNumber"
                min={0}
                aria-label="tableNumber"
                style={{ height: "50%", top: "0.5rem", marginLeft: "1rem" }}
                placeholder="Select a table number"
              />
              {errorTable.alreadyInDb && <Alert type="error" message="This table number is already allocated" />}
              {errorTable.missingValue && <Alert type="error" message="Please select a table number" />}
            </RowCenter>
            {EFoodMode.EDIT && (
              <RowCenter>
                <Title level={5}>Order #</Title>
              </RowCenter>
            )}
            <Divider style={{ border: `0.125rem solid ${ORANGE}` }} />
            <CenteredTitle level={5}>Order List</CenteredTitle>
            <Scroll>
              {foodOrder?.map((food) => (
                <FoodOrderCard key={food.itemId} food={food} />
              ))}
            </Scroll>
            <CenteredTitle level={5} style={{ color: RED, visibility: isVisible }}>
              Total: {calculateTotal(foodOrder).toFixed(2)} $
            </CenteredTitle>
            <RowCenterSp style={{ marginTop: "1rem" }}>
              <RediButton
                buttonType={EButtonType.SUCCESS}
                shape="round"
                disabled={isDisabled}
                onClick={() => handleSubmit(foodOrder)}
              >
                <b>Validate</b>
              </RediButton>

              <RediButton buttonType={EButtonType.ERROR} shape="round" onClick={() => handleCancel("/")}>
                Cancel Order
              </RediButton>
            </RowCenterSp>
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
