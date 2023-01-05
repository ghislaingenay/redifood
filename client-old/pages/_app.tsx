import "antd/dist/reset.css";
import { AppProps } from "next/app";
// import { StyledThemeProvider } from "@definitions/styled-components";
import store from "@redux/store";
import { Provider } from "react-redux";
// import "../dist/output.css";
import "../src/styles/globals.css";

function MyApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
