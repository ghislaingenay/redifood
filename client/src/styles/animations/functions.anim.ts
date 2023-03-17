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

export const anticipationKeyframes = () => {
  return keyframes`

  0% {
    scale: 0;
  }
  70% {
    scale: 1.2;
  }
  75% {
    scale: 0.8;
  }
  80% {
    scale: 1.1;
  }
  85% {
    scale: 0.9;
  }
  90% {
    scale: 1.05;
  }
  95% {
    scale: 0.95;
  }
  100% {
    scale: 1;
  }`;
};
