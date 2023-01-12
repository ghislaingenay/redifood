import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { RediContent, RediMenu, tokenProvider } from "@styles";
import { ConfigProvider, Layout } from "antd";
import { useRouter } from "next/router";
import "../src/styles/globals.css";

const { Header, Footer } = Layout;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <>
      <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
        <Layout className="layout">
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
          <RediContent>
            <Component {...pageProps} />
          </RediContent>
          <Footer className="text-center mb-0.5">Redifood ©{new Date().getFullYear()} Created by Ghislain Genay</Footer>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
