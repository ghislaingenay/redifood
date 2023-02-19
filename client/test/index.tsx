import { render as baseRender, RenderOptions, RenderResult } from "@testing-library/react";
import { ComponentType, ReactElement, useState } from "react";
import AppContext from "../src/contexts/app.context";

import { AuthContext } from "../src/contexts/auth.context";
import { FoodProvider } from "../src/contexts/food.context";
import { TStatusProps } from "../src/interfaces";

/**
 * Custom renderer example with @testing-library/react
 * You can customize it to your needs.
 *
 * To learn more about customizing renderer,
 * please visit https://testing-library.com/docs/react-testing-library/setup
 */
export const AllTheProviders = ({ children }: { children: any }) => {
  // STATE
  const [status, setStatus] = useState<TStatusProps>("success");

  // RECOVER CONTEXT

  // VALUES
  const userValue = {
    authorization: {
      id: "5f9f1b9b0b5b9c0017b5b1a5",
      email: "",
    },
  };

  // RENDER
  return (
    <>
      <AppContext.Provider
        value={{
          setStatus: setStatus,
          state: {
            status: status,
          },
        }}
      >
        <FoodProvider>
          <AuthContext.Provider value={userValue}>{children}</AuthContext.Provider>
        </FoodProvider>
      </AppContext.Provider>
    </>
  );
};

const render = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) =>
  baseRender(ui, {
    wrapper: AllTheProviders as ComponentType<{}> | undefined,
    ...options,
  }) as RenderResult;

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };

// ComponentType<{}> | undefined
