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
import { Suspense, useEffect, useMemo, useState } from "react";
import RediHeader from "../src/components/Page";
import { BACKGROUND_COLOR, ORANGE_LIGHT } from "../src/constants";
import { AuthProvider } from "../src/contexts/auth.context";
import { FoodProvider } from "../src/contexts/food.context";
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
import Head from "next/head";
import "../i18n";
import Loading from "../src/components/Loading";
import { Spinning } from "../src/components/styling/Spinning";

config.autoAddCss = false;

interface IAppProps {
  Component: any;
  pageProps: any;
  isSignOutPage?: boolean;
  loadingPage?: boolean;
}
const AppComponent = ({ Component, pageProps, isSignOutPage, loadingPage }: IAppProps) => {
  const isSignOut = useMemo(() => {
    return isSignOutPage;
  }, [isSignOutPage]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(loadingPage || false);
  }, []);
  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-redifood.png" />
        <title>REDIFOOD</title>
        <meta name="description" content="Redifood application" />
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
                        <Suspense fallback={<Spinning />}>
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
  const path = appContext.ctx.pathname;
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = (await appContext.Component.getInitialProps(appContext.ctx)) as any;
  }

  const routesNoLayout = ["/signin", "/signup", "/signout", "/forgot-password", "/reset-password", "/404"];
  return {
    pageProps,
    isSignOutPage: routesNoLayout.includes(path),
    loadingPage: false,
  };
  // };
};
export default appWithTranslation(AppComponent);
