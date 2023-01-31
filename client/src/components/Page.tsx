import { Layout } from "antd";
import { useRouter } from "next/router";
import { navRoutes } from "../../src/constants/routes.const";
import { RedisMenu } from "../../src/styles";
import { LIGHT_GREY } from "../constants";

const { Header } = Layout;

interface IRediHeaderProps {
  bgColor: string;
}
const RediHeader = ({ bgColor }: IRediHeaderProps) => {
  const router = useRouter();
  return (
    <Header style={{ backgroundColor: bgColor, padding: "0.1rem 5%", display: "flex" }}>
      <div className="logo" />
      <RedisMenu
        style={{ backgroundColor: bgColor, color: LIGHT_GREY }}
        mode="horizontal"
        onClick={(e) => {
          router.push(e.key);
        }}
        items={navRoutes}
        defaultSelectedKeys={["/"]}
      />
    </Header>
  );
};

export { RediHeader };
