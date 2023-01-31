import { Radio } from "antd";
import styled from "styled-components";
import { BACKGROUND_COLOR } from "../../constants";

export const RediRadioButton = styled(Radio.Button)`
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: none;
  background-color: ${BACKGROUND_COLOR};
  border-radius: 0.35rem;
  width: 15vw;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
`;

// export const EditButton = styled(Button)`
//   background-color: ${EDIT_COLOR};
//   color: white;
// `;

// export const CreateButton = styled(Button)`
//   background-color: ${CREATE_COLOR};
//   color: white;
// `;
// export const ErrorButton = styled(Button)`
//   background-color: ${ERROR_COLOR};
// `;
// export const SuccessButton = styled(Button)`
//   background-color: ${SUCCESS_COLOR};
// `;

// export const InfoButton = styled(Button)`
//   background-color: ${MIDDLE_GREY_COLOR};
//   color: white;
// `;
// export const DisplayButton = styled(Button)`
//   background-color: ${PRIMARY_COLOR};
// `;
