import { Input, InputNumber, Typography } from "antd";
import styled from "styled-components";
import { BLUE, ORANGE_DARK, RED } from "../../constants";
const { Title } = Typography;
export const RoundedInput = styled(Input)`
  border-radius: 2rem;
`;
export const RoundedInputNum = styled(InputNumber)`
  border-radius: 2rem;
`;

export const CenteredP = styled.p`
  text-align: center;
`;

export const LabelFormWhite = styled.label`
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  padding-left: 1rem;
  margin: 1rem 0;
`;
export const LabelFormBlack = styled(LabelFormWhite)`
  color: black;
  font-weight: 700;
`;
export const LabelFormOrange = styled(LabelFormBlack)`
  color: ${ORANGE_DARK};
  font-weight: 700;
`;
export const LabelFormBlue = styled(LabelFormBlack)`
  color: ${BLUE};
  font-weight: 700;
`;
export const LabelFormRed = styled(LabelFormBlue)`
  color: ${RED};
  font-weight: 700;
`;

export const CenteredTitle = styled(Title)`
  text-align: center;
`;
