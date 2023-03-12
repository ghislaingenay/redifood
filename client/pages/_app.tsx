import { ConfigProvider, Layout } from "antd";
// import { RediHeader } from "../src/components/Page";
import { AppProvider } from "../src/contexts/app.context";
import "../src/styles/globals.css";
import { RediContent, tokenProvider } from "../src/styles/index";

// import buildClient from "./api/build-client";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { appWithTranslation } from "next-i18next";
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
              <Layout style={{ minHeight: "100vh" }}>
                <RediHeader bgColor={BACKGROUND_COLOR} color={ORANGE_LIGHT} />
                <Layout className="layout" style={{ backgroundColor: ORANGE_LIGHT, overflowY: "hidden" }}>
                  <RediContent>
                    <Suspense
                      fallback={
                        <div style={{ width: "100%", height: "100%", backgroundColor: "black", color: "white" }}>
                          Loading...
                        </div>
                      }
                    >
                      <Component {...pageProps} />
                    </Suspense>
                  </RediContent>
                </Layout>
              </Layout>
            </AuthProvider>
            <ToastContainer />
          </ConfigProvider>
        </FoodProvider>
      </AppProvider>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // return {
  // currentUser: null,
  //   currentUser: { username: "pit" },
  // };
  // console.log("appContext", appContext.Component);
  // const client = buildClient(appContext.ctx);
  // const { data } = await client.get("/api/auth/currentuser");
  // console.log("data", data);
  console.log("path", appContext.ctx.pathname);

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = (await appContext.Component.getInitialProps(appContext.ctx)) as any;
  }
  return {
    pageProps,
  };
  // };
};
export default appWithTranslation(AppComponent);
