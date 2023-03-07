import { ConfigProvider, Layout } from "antd";
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
import { Suspense } from "react";
import RediHeader from "../src/components/Page";
import { BACKGROUND_COLOR, ORANGE_LIGHT } from "../src/constants";
import { AuthProvider } from "../src/contexts/auth.context";
import { FoodProvider } from "../src/contexts/food.context";
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;
const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <AppProvider>
        <FoodProvider>
          <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
            <AuthProvider>
              <Suspense fallback={<div>Loading...</div>}>
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
              </Suspense>
            </AuthProvider>
            <ToastContainer />
          </ConfigProvider>
        </FoodProvider>
      </AppProvider>
    </>
  );
};
export default AppComponent;

AppComponent.getInitialProps = async (appContext) => {
  return {
    // currentUser: null,
    currentUser: { username: "pit" },
  };
  // console.log("appContext", appContext.Component);
  // const client = buildClient(appContext.ctx);
  // const { data } = await client.get("/api/auth/currentuser");
  // console.log("data", data);
  // let pageProps = {};
  // if (appContext.Component.getInitialProps) {
  //   pageProps = await appContext.Component.getnitialProps(appContext.ctx);
  // }
  // return {
  //   pageProps,
  // };
};
