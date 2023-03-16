import { Divider } from "antd";
import styled from "styled-components";
import { GREY, ORANGE_DARK, RED } from "../../../src/constants/colors.const";

export const OrderCardStyled = styled.div`
  border-radius: 2rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 0.02rem solid ${GREY};
  box-shadow: 0 0 0.1rem 0.01rem rgba(0, 0, 0, 0.3);
`;

export const RediRadio = styled.input`
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: none;
  border-radius: 0.35rem;
  width: 15vw;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
  &:hover {
    color: red;
    background-color: ${RED};
  }
  &:active {
    background-color: ${ORANGE_DARK};
    border: none;
    box-shadow: none;
`;

export const SpacingDiv10X = styled.div`
  padding: 0 10%;
`;
export const SpacingDiv25X = styled.div`
  padding: 0 25%;
`;
export const SpacingDiv5X = styled.div`
  padding: 0 5%;
`;

export const Scroll = styled.div`
  height: 60vh;
  overflow-y: scroll;
  scrollbar-color: gray rgb(105, 105, 105);
`;

export const RediDivider = styled(Divider)`
  margin: 2rem 0;
  border: 0.01rem solid ${GREY};
`;
export const NoSpacingDivider = styled(Divider)`
  margin: 0.5rem 0;
  padding: 0;
`;
