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
import { Suspense, useMemo } from "react";
import RediHeader from "../src/components/Page";
import { BACKGROUND_COLOR, ORANGE_LIGHT } from "../src/constants";
import { AuthProvider } from "../src/contexts/auth.context";
import { FoodProvider } from "../src/contexts/food.context";
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
import Head from "next/head";
// import faviconRedifood from "../public/favicon-redifood.png";
import "../i18n";

config.autoAddCss = false;

interface IAppProps {
  Component: any;
  pageProps: any;
  isSignOutPage?: boolean;
}
const AppComponent = ({ Component, pageProps, isSignOutPage }: IAppProps) => {
  const isSignOut = useMemo(() => {
    return isSignOutPage;
  }, [isSignOutPage]);
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-redifood.png" />
      </Head>
      <AppProvider>
        <FoodProvider>
          <ConfigProvider theme={{ token: tokenProvider, inherit: false }}>
            <AuthProvider>
              {isSignOut ? (
                <Component {...pageProps} />
              ) : (
                <>
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
                </>
              )}
            </AuthProvider>

            <ToastContainer />
          </ConfigProvider>
        </FoodProvider>
      </AppProvider>
    </>
  );
};

AppComponent.getInitialProps = async (appContext: any) => {
  // const client = buildClient(appContext.ctx);
  // const { data } = await client.get("/api/auth/currentuser");
  const path = appContext.ctx.pathname;
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = (await appContext.Component.getInitialProps(appContext.ctx)) as any;
  }
  return {
    pageProps,
    isSignOutPage: path === "/signout",
  };
  // };
};
export default appWithTranslation(AppComponent);
