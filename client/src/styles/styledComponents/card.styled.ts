import { Card } from "antd";
import styled from "styled-components";
import { LIGHT_GREY } from "../../constants";

export const LGCard = styled(Card)`
  background-color: ${LIGHT_GREY};
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
`;
