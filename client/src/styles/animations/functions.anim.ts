import { keyframes } from "styled-components";

export const goUp = (opacity: string, tranformY: string) => {
  return keyframes`
  0% {
    transform: translateY(${tranformY});
    opacity: ${opacity};
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
};
