import { ConfigProvider, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import Auth from "../src/components/Auth";
import { RediHeader } from "../src/components/Page";
import { AppProvider } from "../src/contexts/app.context";
import "../src/styles/globals.css";
import { RediContent, tokenProvider } from "../src/styles/index";
const { Footer } = Layout;
// import buildClient from "./api/build-client";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const AppComponent = ({ Component, pageProps, currentUser, loading }) => {
  const [loadingSpin, setLoadingSpin] = useState<boolean>(loading || true);
  // const [status, setStatus] = useState<"error" | "success">("success");
  useEffect(() => {
    setLoadingSpin(loading);
  }, [loading]);

  if (loadingSpin) {
    return <Spin />;
  }

  return (
    <>
      <AppProvider>
        <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
          <If condition={currentUser}>
            <Then>
              <Layout className="layout bg-amber-100 mb-0">
                <RediHeader />
                <RediContent>
                  <Component {...pageProps} />
                </RediContent>
                <Footer
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    margin: "0 0 0.4rem 0",
                    padding: "0",
                  }}
                >
                  <em>Redifood ©{new Date().getFullYear()} Created by Ghislain Genay</em>
                </Footer>
              </Layout>
            </Then>
            <Else>
              <Auth />
            </Else>
          </If>
        </ConfigProvider>
      </AppProvider>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  return {
    currentUser: { username: "pit" },
    loading: false,
  };
  // console.log("appContext", appContext.Component);
  // const client = buildClient(appContext.ctx);
  // const { data } = await client.get("/api/auth/currentuser");
  // console.log("data", data);
  // let pageProps = {};
  // if (appContext.Component.getInitialProps) {
  //   pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  // }
  // return {
  //   pageProps,
  //   currentUser: data.currentUser,
  //   loading: false,
  // };
};

export default AppComponent;
