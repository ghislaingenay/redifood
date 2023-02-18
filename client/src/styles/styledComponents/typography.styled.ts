import { Input, Typography } from "antd";
import styled from "styled-components";
const { Title } = Typography;
export const RoundedInput = styled(Input)`
  border-radius: 2rem;
`;

export const LabelFormWhite = styled.label`
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  padding-left: 1rem;
  margin: 1rem 0;
`;

export const CenteredTitle = styled(Title)`
  text-align: center;
`;
