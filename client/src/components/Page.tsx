import { LIGHT_GREY_COLOR } from "@constants/colors.const";
import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { RedisMenu } from "@styles";
import { Layout } from "antd";
import { useRouter } from "next/router";

const { Header } = Layout;
const RediHeader = () => {
  const router = useRouter();
  return (
    <Header style={{ backgroundColor: LIGHT_GREY_COLOR }}>
      <div className="logo" />
      <RedisMenu
        style={{ backgroundColor: LIGHT_GREY_COLOR }}
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
