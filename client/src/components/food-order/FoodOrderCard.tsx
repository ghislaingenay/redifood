import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Col, Space, Typography } from "antd";
import { IFoodApi } from "../../../redifood-module/src/interfaces";
import { GREY } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { useWindowSize } from "../../hooks/useWindowSIze.hook";
import { EButtonType } from "../../interfaces";
import { AnimFoodCard } from "../../styles/animations/global.anim";
import { CenteredTitle } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenterSp, RowSpaceAround, RowSpaceBetween } from "../styling/grid.styled";
const { Title } = Typography;

interface IFoodOrderCard {
  food: IFoodApi;
}

const FoodOrderCard = ({ food }: IFoodOrderCard) => {
  const {
    functions: { deleteFood, addFood, removeFood },
  } = useFood();
  const isDisabled = food.itemQuantity === 1 ? true : false;

  const [width] = useWindowSize();
  const widthBreakPoint = 992;
  const isLargeScreen = width && width > widthBreakPoint;

  const renderText = () => {
    return (
      <>
        <Title level={5} style={{ margin: 0, padding: "0 auto 1rem" }}>
          <b>{food.itemName}</b>
        </Title>
        <RediButton
          buttonType={EButtonType.ERROR}
          name={`Delete ${food.itemName}`}
          shape="round"
          size="large"
          onClick={() => deleteFood(food.id)}
        >
          <DeleteOutlined aria-label={`delete ${food.itemName}`} />
        </RediButton>
      </>
    );
  };

  const renderButtons = () => {
    return (
      <RowSpaceAround style={{ height: "3rem", margin: 0 }}>
        <RediButton
          buttonType={EButtonType.DISPLAY}
          size="large"
          shape="circle"
          disabled={isDisabled}
          onClick={() => removeFood(food.id)}
        >
          <MinusSquareOutlined aria-label={`remove ${food.itemName}`} />
        </RediButton>
        <CenteredTitle level={4} style={{ margin: 0 }}>
          {food.itemQuantity}
        </CenteredTitle>
        <RediButton buttonType={EButtonType.SUCCESS} size="large" shape="circle" onClick={() => addFood(food.id)}>
          <PlusSquareOutlined aria-label={`add ${food.itemName}`} />
        </RediButton>
      </RowSpaceAround>
    );
  };
  return (
    <AnimFoodCard key={food.id} role="card">
      {isLargeScreen ? (
        <>
          <RowCenterSp size={20} gutter={10} style={{ padding: "0 0.5rem", marginBottom: "0.25rem" }}>
            {renderText()}
          </RowCenterSp>
          <RowSpaceBetween>
            <Col lg={24} style={{ border: `1px solid ${GREY}`, borderRadius: "4rem" }}>
              {renderButtons()}
            </Col>
          </RowSpaceBetween>
        </>
      ) : (
        <RowSpaceAround>
          <Col span={12}>
            <Space size="middle">{renderText()}</Space>
          </Col>
          <Col span={12}>{renderButtons()}</Col>
        </RowSpaceAround>
      )}
    </AnimFoodCard>
  );
};

export default FoodOrderCard;
