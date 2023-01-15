import { RediContent, tokenProvider } from "@styles";
import { ConfigProvider, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import Auth from "src/components/Auth";
import { RediFooter, RediHeader } from "src/components/Page";
import "../src/styles/globals.css";
import buildClient from "./api/build-client";

const AppComponent = ({ Component, pageProps, currentUser, loading }) => {
  const [loadingSpin, setLoadingSpin] = useState<boolean>(loading || true);

  useEffect(() => {
    setLoadingSpin(loading);
  }, [loading]);

  if (loadingSpin) {
    return <Spin />;
  }
  return (
    // <AuthContext.Provider value={currentUser}>
    <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
      <If condition={currentUser}>
        <Then>
          <Layout className="layout">
            <RediHeader />
            <RediContent>
              <Component {...pageProps} />
            </RediContent>
            <RediFooter />
          </Layout>
        </Then>
        <Else>
          <Auth />
        </Else>
      </If>
    </ConfigProvider>
    // </AuthContext.Provider>
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
  return {
    pageProps,
    currentUser: data.currentUser,
    loading: false,
  };
};

export default AppComponent;
