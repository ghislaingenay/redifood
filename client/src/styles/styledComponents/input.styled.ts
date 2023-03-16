import styled from "styled-components";
import { GREY } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";

export const LRoundedInput = styled.input`
  border-radius: 2rem;
  padding: 0.5rem 2rem;
  width: 80%;
  text-align: center;
  font-size: 2rem;
  text-align: center;
  border: 1px solid ${hexToRgba(GREY, 0.5)};
  &:disabled {
    background-color: white;
    color: black;
  }
`;
