import { faList } from "@fortawesome/free-solid-svg-icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { recoverCookie } from "../../../pages/api/build-language";
import { IOrderApi } from "../../../redifood-module/src/interfaces";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType } from "../../interfaces";
import { CenteredPBold } from "../../styles";
import { AnimCard } from "../../styles/animations/global.anim";
import { RediIconButton } from "../styling/Button.style";
import { RowCenter } from "../styling/grid.styled";

interface IOrderHistoryCard {
  order: IOrderApi<string>;
}
const OrderHistoryCard = ({ order }: IOrderHistoryCard) => {
  const { t, i18n } = useTranslation("common");

  const { orderNo, orderTotal, id } = order;

  useEffect(() => {
    i18n.changeLanguage(recoverCookie());
  }, [i18n]);

  const { convertPrice } = useCurrency();
  const router = useRouter();

  const colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
  };
  return (
    <AnimCard>
      <RowCenter>
        <Col md={24} lg={15}>
          <RowCenter>
            <Col {...colSpan}>
              <CenteredPBold>
                {t("history.order-number")}: {orderNo}
              </CenteredPBold>
            </Col>
            <Col {...colSpan}>
              <CenteredPBold>
                {t("glossary.amount")}: {convertPrice(orderTotal, "backToFront", true)}
              </CenteredPBold>
            </Col>
            <Col {...colSpan}>
              <CenteredPBold>Date: </CenteredPBold>
            </Col>
            <Col {...colSpan}>
              <CenteredPBold>
                {t("glossary.amount")}: {orderTotal}
              </CenteredPBold>
            </Col>
          </RowCenter>
        </Col>
        <Col xs={24} lg={6} style={{ textAlign: "center" }}>
          <RediIconButton iconFt={faList} buttonType={EButtonType.EDIT} onClick={() => router.push(`/orders/${id}`)}>
            {t("buttons.view-order")}
          </RediIconButton>
        </Col>
      </RowCenter>
    </AnimCard>
  );
};

export default OrderHistoryCard;
