import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { RediContent, RediMenu, tokenProvider } from "@styles";
import { ConfigProvider, Layout, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import Auth from "src/components/Auth";
import { AuthContext } from "src/contexts/auth.context";
import "../src/styles/globals.css";
import buildClient from "./api/build-client";

const { Header, Footer } = Layout;

const AppComponent = ({ Component, pageProps, currentUser, loading }) => {
  const router = useRouter();

  const [loadingSpin, setLoadingSpin] = useState<boolean>(loading || true);

  useEffect(() => {
    setLoadingSpin(loading);
  }, [loading]);

  if (loadingSpin) {
    return <Spin />;
  }
  return (
    <AuthContext.Provider value={currentUser}>
      <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
        <If condition={currentUser}>
          <Then>
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
              <Footer className="text-center mb-0.5">
                Redifood ©{new Date().getFullYear()} Created by Ghislain Genay
              </Footer>
            </Layout>
          </Then>
          <Else>
            <Auth />
          </Else>
        </If>
      </ConfigProvider>
    </AuthContext.Provider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log("appContext", appContext.Component);
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/auth/currentuser");
  console.log("data", data);
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log("user", data.currentUser);
  return {
    pageProps,
    currentUser: data.currentUser,
    loading: false,
  };
};

export default AppComponent;
