import { render as baseRender, RenderOptions, RenderResult } from "@testing-library/react";
import { ComponentType, ReactElement } from "react";
import { AppProvider } from "../src/contexts/app.context";

import { AuthProvider } from "../src/contexts/auth.context";
import { FoodProvider } from "../src/contexts/food.context";

/**
 * Custom renderer example with @testing-library/react
 * You can customize it to your needs.
 *
 * To learn more about customizing renderer,
 * please visit https://testing-library.com/docs/react-testing-library/setup
 */
export const AllTheProviders = ({ children }: { children: any }) => {
  // STATE
  // const [status, setStatus] = useState<"success" | "error">("success");

  // RECOVER CONTEXT

  // VALUES

  // RENDER
  return (
    <>
      <AppProvider>
        <FoodProvider>
          <AuthProvider>{children}</AuthProvider>
        </FoodProvider>
      </AppProvider>
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
