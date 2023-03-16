import { Layout } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RediWhiteLogo from "../../public/redifood-logo-white.png";
import { navRoutes } from "../../src/constants/routes.const";
import { RedisMenu } from "../../src/styles";
import { useWindowSize } from "../hooks/useWindowSIze.hook";

const { Sider } = Layout;
interface IRediHeaderProps {
  bgColor: string;
  color: string;
}
const RediHeader = ({ bgColor, color }: IRediHeaderProps) => {
  const [width] = useWindowSize();
  const isCollapsible = width && width < 992 ? true : false;
  const pictureHeight = isCollapsible ? 50 : 100;
  const marginValue = isCollapsible ? 14 : 50;
  const router = useRouter();
  return (
    <>
      {/* <Header style={{ backgroundColor: bgColor, padding: "0.1rem 5%", display: "flex" }}>
          <div className="logo" />
          <RedisMenu
            style={{ backgroundColor: bgColor, color: color }}
            mode="horizontal"
            onClick={(e) => {
              router.push(e.key);
            }}
            items={navRoutes}
            defaultSelectedKeys={["/"]}
          />
        </Header> */}
      <Sider collapsed={isCollapsible} style={{ backgroundColor: bgColor, color: color }}>
        <Image height={pictureHeight} style={{ margin: marginValue }} alt="redifood logo white" src={RediWhiteLogo} />
        <RedisMenu
          style={{ backgroundColor: bgColor, color: color }}
          mode="inline"
          onClick={(e) => {
            router.push(e.key);
          }}
          items={navRoutes}
          defaultSelectedKeys={["/"]}
        />
      </Sider>
    </>
  );
};

export default RediHeader;
