import { Layout, Menu } from "antd";
import styled from "styled-components";

const { Content } = Layout;

export const RediContent = styled(Content)`
  padding: 1rem 5%;
  margin: 1.725rem 3.125rem 0.725rem;
  height: 80vh;
  background-color: white;
  border-radius: 1rem;
  overflow: scroll;
  shadow: 0 0 0.5rem 0.5rem rgba(0, 0, 0, 0.5);
`;

export const RediMenu = styled(Menu)`
  font-family: "Bebas Neue", cursive;
  font-size: 1.125rem;
`;
