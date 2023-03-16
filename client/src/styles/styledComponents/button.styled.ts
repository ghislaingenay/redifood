import { Button } from "antd";
import styled from "styled-components";

export const RadioButton = styled.button`
  border-radius: 0.5rem;
  margin: 0.5rem auto 0.5rem;
  &:hover {
    opacity: 0.85;
    box-shadow: none;
`;

export const BtnHover = styled(Button)`
  &:hover {
    opacity: 0.85;
  }
`;
