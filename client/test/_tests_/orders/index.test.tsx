import { Jest } from "@jest/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import AllOrdersPage, { getOptions, getServerSideProps } from "../../../pages/index";
import { server } from "../../../test/mocks/server";
import { allDataOrders, getListUnpaidOrders } from "../../mocks/mockOrdersData";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  const Select = ({ children, onChange, multiple, defaultValue, disabled, value }) => {
    return (
      <select
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(e) =>
          onChange(multiple ? Array.from(e.target.selectedOptions).map((option) => option.value) : e.target.value)
        }
      >
        {children}
      </select>
    );
  };

  // eslint-disable-next-line react/display-name
  Select.Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };

  return {
    ...antd,
    Select,
  };
});

jest.setTimeout(30000);

describe("get Server Side Props - Index", () => {
  it("should send an error message if the API is not working or doesn't send the data in server side", async () => {
    server.resetHandlers(rest.get("/api/orders", (req, res, ctx) => res(ctx.status(400), ctx.json("Error"))));
    const response = await getServerSideProps();
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          allOrders: [],
          getList: [],
          status: "error",
        },
      }),
    );
  });
});

describe("All Orders Page", () => {
  it("should render the component", async () => {
    render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
    expect(screen.queryByText(/page will refresh automatically in 5 seconds/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/All Orders/i)).toBeInTheDocument();
  });

  it("should have a create order button", async () => {
    render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
    expect(await screen.findByRole("button", { name: /create order/i })).toBeInTheDocument();
  });

  it("select input with default value of ALL - Test with mock", async () => {
    render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(4);
  });

  it("getOptions function test", () => {
    expect(getOptions(["a", "b", "c"])).toEqual([
      { label: "a", value: "a" },
      { label: "b", value: "b" },
      { label: "c", value: "c" },
    ]);
  });

  it("should be able to select KBB3 - Test without mock", async () => {
    render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
    const user = userEvent.setup();
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(4);
    await user.click(SelectElement as HTMLElement);
    // await user.click(noneOption);
    expect(SelectElement.value).toBe("ALL");
    fireEvent.change(SelectElement, { target: { value: "KBB3" } });
    await waitFor(() => {
      expect(SelectElement.value).toBe("KBB3");
      expect(SelectElement.value).not.toBe("ALL");
    });
  });
});

describe("All Orders Page - Table unit", () => {
  it("should have 3 card initially after get request with all the included data", async () => {
    render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
    expect(await screen.findAllByRole("card")).toHaveLength(3);
    expect(await screen.findAllByRole("button", { name: /edit/i })).toHaveLength(3);
    expect(await screen.findAllByRole("button", { name: /pay/i })).toHaveLength(3);
    ["Order ID:", "Order Total:", "Order Status:", "Table Number:", "Name", "Quantity", "Price"].forEach(
      async (text) => {
        expect(await screen.findAllByText(text)).toHaveLength(3);
      },
    );
    //Check table for each card
    ["DRINK", "MAN Z", "Choco", "Salad"].forEach(async (text) => {
      expect(await screen.findByText(text)).toBeInTheDocument();
    });
  });

  // it("user select one option qnd only one result is found and then set back to ALL", async () => {
  //   const user = userEvent.setup();
  //   render(<AllOrdersPage status="success" allOrders={allDataOrders} getList={getListUnpaidOrders} />);
  //   const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
  //   expect(SelectElement.value).toBe("ALL");
  //   await user.click(SelectElement as HTMLElement);
  //   fireEvent.change(SelectElement, { target: { value: "KBB3" } });
  //   expect(SelectElement.value).toBe("KBB3");
  //   expect(await screen.findAllByRole("button", { name: /edit/i })).toHaveLength(1);
  //   ["Choco", "Salad"].forEach(async (text) => {
  //     expect(await screen.findByText(text)).toBeInTheDocument();
  //   });
  //   await waitFor(() => {
  //     ["DRINK", "MAN Z"].forEach((text) => {
  //       expect(screen.getByText(text)).not.toBeInTheDocument();
  //     });
  //   });
  //   expect(await screen.findAllByRole("card")).toHaveLength(1);
  //   await user.click(SelectElement as HTMLElement);
  //   fireEvent.change(SelectElement, { target: { value: "ALL" } });
  //   await waitFor(() => {
  //     screen.debug();
  //     expect(screen.queryAllByRole("button", { name: /edit/i })).toHaveLength(3);
  //     ["DRINK", "MAN Z", "Choco", "Salad"].forEach((text) => {
  //       expect(screen.getByText(text)).toBeInTheDocument();
  //     });
  //   });
  //   expect(await screen.findAllByRole("row")).toHaveLength(3);
  // });

  it("error in front end if data wasn't received from the API", async () => {
    render(<AllOrdersPage status="error" allOrders={[]} getList={[]} />);
    await waitFor(() => {
      expect(screen.queryAllByRole("card")).toHaveLength(0);
    });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(await screen.findByText(/page will refresh automatically in 5 seconds/i)).toBeInTheDocument();
  });
});

// Add all the element and check no error on notification
