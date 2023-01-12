import { navRoutes } from "@constants/routes.const";
import { ENavList } from "@interfaces/nav.interface";
import { RediContent, RediMenu, tokenProvider } from "@styles";
import { ConfigProvider, Layout } from "antd";
import { useRouter } from "next/router";
import "../src/styles/globals.css";
import buildClient from "./api/build-client";

const { Header, Footer } = Layout;

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();
  return (
    <div>
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
      {/* <Modal title="Vertically centered modal dialog" centered open={currentUser === null}>
        <p>Some contents...</p>
      </Modal> */}
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log("appContext", appContext);
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
  };
};

export default AppComponent;
