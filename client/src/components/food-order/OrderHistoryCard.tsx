import { faList } from "@fortawesome/free-solid-svg-icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { recoverCookie } from "../../../pages/api/build-language";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, IOrder } from "../../interfaces";
import { CenteredPBold, LGCard } from "../../styles";
import { RediIconButton } from "../styling/Button.style";
import { RowCenter, RowSpaceBetween } from "../styling/grid.styled";

interface IOrderHistoryCard {
  foodOrder: IOrder;
}
const OrderHistoryCard = ({ foodOrder }: IOrderHistoryCard) => {
  const { t, i18n } = useTranslation("history");

  useEffect(() => {
    i18n.changeLanguage(recoverCookie());
  }, [i18n]);

  const { convertPrice } = useCurrency();
  const router = useRouter();
  return (
    <LGCard>
      <RowSpaceBetween>
        <Col span={15}>
          <RowCenter>
            <Col span={12}>
              <CenteredPBold>
                {t("history.order-number")}: {foodOrder?._id}
              </CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>Date: </CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>
                {t("history.amount")}: {convertPrice(foodOrder?.orderTotal, "backToFront", true)}
              </CenteredPBold>
            </Col>
            <Col span={12}>
              <CenteredPBold>
                {t("history.amount")}: {foodOrder?.orderCurrency}
              </CenteredPBold>
            </Col>
          </RowCenter>
        </Col>
        <Col span={7}>
          <RediIconButton
            iconFt={faList}
            buttonType={EButtonType.EDIT}
            onClick={() => router.push(`/orders/${foodOrder?._id}`)}
          >
            {t("history.view-order")}
          </RediIconButton>
        </Col>
      </RowSpaceBetween>
    </LGCard>
  );
};

export default OrderHistoryCard;
