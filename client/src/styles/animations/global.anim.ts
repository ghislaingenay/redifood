import styled, { keyframes } from "styled-components";

const Up = keyframes`
  0% {
    transform: translateY(10%);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const AnimToTop = styled.div`
  animation: ${Up} 0.5s ease-in-out;
`;
