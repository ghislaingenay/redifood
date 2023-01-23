import { Button, Radio } from "antd";
import styled from "styled-components";
import {
  CREATE_COLOR,
  EDIT_COLOR,
  ERROR_COLOR,
  MIDDLE_GREY_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
} from "../constants/colors.const";

export const AuthRadioButton = styled(Radio.Button)`
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 15vw;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Bebas Neue", cursive;
`;

export const EditButton = styled(Button)`
  background-color: ${EDIT_COLOR};
  color: white;
`;

export const CreateButton = styled(Button)`
  background-color: ${CREATE_COLOR};
  color: white;
`;
export const ErrorButton = styled(Button)`
  background-color: ${ERROR_COLOR};
`;
export const SuccessButton = styled(Button)`
  background-color: ${SUCCESS_COLOR};
`;

export const InfoButton = styled(Button)`
  background-color: ${MIDDLE_GREY_COLOR};
  color: white;
`;
export const DisplayButton = styled(Button)`
  background-color: ${PRIMARY_COLOR};
`;
