import styled from "styled-components";
import { GREY } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";

export const LRoundedInput = styled.input`
  border-radius: 2rem;
  padding: 1rem 2rem;
  width: 100%;
  font-size: 2rem;
  text-align: center;
  border: 1px solid ${hexToRgba(GREY, 0.5)};
  &:disabled {
    background-color: white;
    color: black;
  }
`;
