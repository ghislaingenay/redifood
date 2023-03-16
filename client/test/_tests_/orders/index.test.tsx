import { Jest } from "@jest/types";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../..";
import AllOrdersPage from "../../../pages/index";
import { getOptions } from "../../../src/functions/global.fn";
import { ELanguage } from "../../../src/interfaces";
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

// describe("get Server Side Props - Index", () => {
//   it("should send an error message if the API is not working or doesn't send the data in server side", async () => {
//     server.resetHandlers(rest.get("/api/orders", (req, res, ctx) => res(ctx.status(400), ctx.json("Error data"))));
//     const response = await getServerSideProps();
//     expect(response).toEqual(
//       expect.objectContaining({
//         props: {
//           allOrders: [],
//           getList: [],
//           status: "error",
//         },
//       }),
//     );
//   });
// });

const allOrdersSuccesprops = {
  allOrders: allDataOrders,
  getList: getListUnpaidOrders,
  status: "success",
  language: ELanguage.ENGLISH,
};

describe("All Orders Page", () => {
  it("should render the component", async () => {
    render(<AllOrdersPage {...allOrdersSuccesprops} />);
    expect(await screen.findByRole("heading", { name: /list of all orders/i })).toBeInTheDocument();
    expect(1 + 1).toEqual(2);
  });

  it("should have a create order button", async () => {
    render(<AllOrdersPage {...allOrdersSuccesprops} />);
    expect(await screen.findByRole("button", { name: /create order/i })).toBeInTheDocument();
  });

  it("select input with default value of ALL - Test with mock", async () => {
    render(<AllOrdersPage {...allOrdersSuccesprops} />);
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(4);
  });

  it("getOptions function test", () => {
    expect(getOptions(["aa", "bb", "cc"])).toEqual([
      { label: "Aa", value: "aa" },
      { label: "Bb", value: "bb" },
      { label: "Cc", value: "cc" },
    ]);
  });

  it("should be able to select KBB3 - Test without mock", async () => {
    render(<AllOrdersPage {...allOrdersSuccesprops} />);
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
    render(<AllOrdersPage {...allOrdersSuccesprops} />);
    expect(await screen.findAllByRole("row")).toHaveLength(4);
    expect(await screen.findAllByRole("button", { name: /edit/i })).toHaveLength(3);
    expect(await screen.findAllByRole("button", { name: /pay/i })).toHaveLength(3);
    ["ID", "Table", "Amount", "Action"].forEach(async (text) => {
      expect(await screen.findByText(text)).toBeInTheDocument();
    });
    //Check table for each card
    [/APP1/i, /FTP2/i, /KBB3/i].forEach(async (text) => {
      expect(await screen.findByRole("gridcell", { name: text })).toBeInTheDocument();
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
});

// Add all the element and check no error on notification
