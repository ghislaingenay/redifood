import { Layout } from "antd";
import { useRouter } from "next/router";
import { MIDDLE_GREY_COLOR } from "../../src/constants/colors.const";
import { navRoutes } from "../../src/constants/routes.const";
import { ENavList } from "../../src/interfaces/nav.interface";
import { RedisMenu } from "../../src/styles";

const { Header } = Layout;
const RediHeader = () => {
  const router = useRouter();
  return (
    <Header style={{ backgroundColor: MIDDLE_GREY_COLOR }}>
      <div className="logo" />
      <RedisMenu
        style={{ backgroundColor: MIDDLE_GREY_COLOR }}
        mode="horizontal"
        onClick={(e) => {
          router.push(e.key);
        }}
        items={navRoutes}
        defaultSelectedKeys={[ENavList.HOME]}
      />
    </Header>
  );
};

export { RediHeader };
