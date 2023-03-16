import styled from "styled-components";
import { BACKGROUND_COLOR } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { LGCard } from "../styledComponents/card.styled";
import { goUp } from "./functions.anim";

export const AnimToTop = styled.div`
  animation: ${goUp("0", "10%")} 0.5s ease-in-out;
`;

export const AnimCard = styled(LGCard)`
  &:hover {
    animation: ${goUp("1", "4%")} 0.3s ease-out;
    background-color: ${hexToRgba(BACKGROUND_COLOR, 0.2)}
`;
