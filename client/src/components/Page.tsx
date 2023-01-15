import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { RediMenu } from "@styles";
import { Layout } from "antd";
import { useRouter } from "next/router";

const { Header, Footer } = Layout;
const RediHeader = () => {
  const router = useRouter();
  return (
    <Header>
      <div className="logo" />
      <RediMenu
        theme="dark"
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

const RediFooter = () => {
  return <Footer className="text-center mb-0.5">Redifood ©{new Date().getFullYear()} Created by Ghislain Genay</Footer>;
};

export { RediHeader, RediFooter };
