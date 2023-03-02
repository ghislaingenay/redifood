import { ConfigProvider, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import Auth from "../src/components/Auth";
// import { RediHeader } from "../src/components/Page";
import { AppProvider } from "../src/contexts/app.context";
import "../src/styles/globals.css";
import { tokenProvider } from "../src/styles/index";
const { Footer, Content } = Layout;
// import buildClient from "./api/build-client";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import RediHeader from "../src/components/Page";
import { BACKGROUND_COLOR, ORANGE_LIGHT } from "../src/constants";
import { FoodProvider } from "../src/contexts/food.context";
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
        <FoodProvider>
          <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
            <If condition={currentUser}>
              <Then>
                <Layout style={{ minHeight: "100vh" }}>
                  <RediHeader bgColor={BACKGROUND_COLOR} color={ORANGE_LIGHT} />
                  <Layout className="layout" style={{ backgroundColor: ORANGE_LIGHT, padding: "1rem 2.5%" }}>
                    {/* <RediContent> */}
                    <Content>
                      <Component {...pageProps} />
                    </Content>
                    {/* </RediContent> */}
                    <Footer
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        margin: "1rem 0 0.4rem 0",
                        padding: "0",
                      }}
                    >
                      <em>Redifood ©{new Date().getFullYear()} Created by Ghislain Genay</em>
                    </Footer>
                  </Layout>
                </Layout>
              </Then>
              <Else>
                <Auth />
              </Else>
            </If>
            <ToastContainer />
          </ConfigProvider>
        </FoodProvider>
      </AppProvider>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  return {
    // currentUser: null,
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
