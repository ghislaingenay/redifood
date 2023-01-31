import { Layout, Menu } from "antd";
import styled from "styled-components";

const { Content } = Layout;

export const RediContent = styled(Content)`
  padding: 1rem 5%;
  margin: 1.725rem 3.125rem 0.725rem;
  height: 100vh;
  overflow-y: scroll;
  background-color: rgba(256, 256, 256, 0.5);
  border-radius: 1rem;
  scrollbar-color: gray rgb(105, 105, 105);
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
