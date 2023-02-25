import styled from "styled-components";
import { BACKGROUND_COLOR, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";

const baseColor = ORANGE_LIGHT;
export const RediTable = styled.table`
  text-align: center;
  margin: 2rem auto;
  width: 100%;
  border: 1px solid ${baseColor};
  border-collapse: none;
`;

export const THead = styled.thead`
  border: 1px solid ${baseColor};
  border-collapse: none;
  padding: 0.5rem;
`;
export const TH = styled.th`
  border: 1px solid ${baseColor};
  border: none;
  border-collapse: none;
  padding: 0.5rem;
`;
export const TD = styled.td`
  border: 1px solid ${baseColor};
  border: none;
  border-collapse: none;
  padding: 0.5rem;
`;
export const TR = styled.tr`
  border: 1px solid ${baseColor};
  border-collapse: none;
  padding: 0.5rem;
  border: ;
  background-color: ${hexToRgba(BACKGROUND_COLOR, 0.3)};
`;
export const TRLight = styled.tr`
  border-collapse: none;
  padding: 0.5rem;
  border: ;
  background-color: ${hexToRgba(ORANGE_DARK, 0.3)};
`;
export const TRDark = styled.tr`
  border-collapse: none;
  padding: 0.5rem;
  background-color: ${hexToRgba(ORANGE_DARK, 0.5)};
`;
