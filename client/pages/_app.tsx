import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import "../src/styles/globals.css";

const { Header, Content, Footer } = Layout;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={(e) => {
              router.push(e.key);
            }}
            items={navRoutes}
            defaultSelectedKeys={[ENavList.HOME]}
          />
        </Header>
        <Content style={{ padding: "5%", height: "100vh" }}>
          <Component {...pageProps} />
        </Content>
        <Footer className="text-center mb-0.5">Redifood ©{new Date().getFullYear()} Created by Ghislain Genay</Footer>
      </Layout>
    </>
  );
}

export default MyApp;
