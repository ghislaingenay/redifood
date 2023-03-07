import { Layout, Menu } from "antd";
import styled from "styled-components";
import { BACKGROUND_COLOR, ORANGE_LIGHT } from "../../constants";

const { Content, Sider } = Layout;

export const RediSider = styled(Sider)`
  background-color: ${BACKGROUND_COLOR};
  color: ${ORANGE_LIGHT};
`;
export const RediContent = styled(Content)`
  scroll-behavior: smooth;
  overflow-y: scroll;
  margin: 0;
  padding: 1rem 3%;
  height: 88vh;
  background-color: rgba(256, 256, 256, 0.5);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
`;

export const RedisMenu = styled(Menu)`
  font-family: "Bebas Neue", cursive;
  font-size: 1.125rem;
`;

// $primary: #D9534F;
// $secondary: #FFAD60;
// $info: Gray;
// $myYellow: #FFEEAD;
// $success: #96CEB4;
// $tercery: #fd611f;

// $fontTitle: 'Bebas Neue', cursive;
// $fontBody: 'Montserrat', sans-serif;
