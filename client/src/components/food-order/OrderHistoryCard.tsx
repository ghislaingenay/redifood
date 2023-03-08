import { faList } from "@fortawesome/free-solid-svg-icons";
import { Col } from "antd";
import { useRouter } from "next/navigation";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, IOrder } from "../../interfaces";
import { CenteredPBold, LGCard } from "../../styles";
import { RediIconButton } from "../styling/Button.style";
import { RowCenter, RowSpaceBetween } from "../styling/grid.styled";

interface IOrderHistoryCard {
  foodOrder: IOrder;
}
const OrderHistoryCard = ({ foodOrder }: IOrderHistoryCard) => {
  const { convertPrice } = useCurrency();
  const router = useRouter();
  return (
    <LGCard>
      <RowSpaceBetween>
        <Col span={15}>
          <RowCenter>
            <Col span={12}>
              <CenteredPBold>Order number: {foodOrder?._id}</CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>Date: </CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>Amount: {convertPrice(foodOrder?.orderTotal, "backToFront", true)}</CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>Amount: {foodOrder?.orderCurrency}</CenteredPBold>
            </Col>
          </RowCenter>
        </Col>
        <Col span={7}>
          <RediIconButton
            iconFt={faList}
            buttonType={EButtonType.EDIT}
            onClick={() => router.push(`/orders/${foodOrder?._id}`)}
          >
            VIEW ORDER
          </RediIconButton>
        </Col>
      </RowSpaceBetween>
    </LGCard>
  );
};

export default OrderHistoryCard;
