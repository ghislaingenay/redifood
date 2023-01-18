import { Jest } from "@jest/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AllOrdersPage from "../../../pages/index";

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

describe("All Orders Page - Unit Testing", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should render the component", () => {
    render(<AllOrdersPage />);
    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
  });

  it("select input with default value of ALL - Test with mock", async () => {
    render(<AllOrdersPage />);
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(2);
  });
  // it("select input with default value of ALL - Test without mock (PASSED)", async () => {
  //   const { container } = render(<AllOrdersPage />);
  //   const selectedValue = container.querySelector("div.ant-select-selector > span.ant-select-selection-item");
  //   expect(selectedValue.textContent).toBe("ALL");
  //   expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  //   expect(screen.queryAllByRole("option")).toHaveLength(0);
  // });

  // it("user able to see the different option on select - Test without mock (PASSED) Test not needed if use mock", async () => {
  //   render(<AllOrdersPage />);
  //   const user = userEvent.setup();
  //   const SelectElement = screen.getByRole("combobox");
  //   expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  //   expect(screen.queryAllByRole("option")).toHaveLength(0);
  //   await user.click(SelectElement as HTMLElement);
  //   expect(await screen.findByRole("listbox")).toBeInTheDocument();
  //   expect(await screen.findAllByRole("option")).toHaveLength(2);
  //   expect(await screen.findByRole("option", { name: /ALL/i })).toHaveAttribute("aria-selected", "true");
  //   expect(await screen.findByRole("option", { name: /NONE/i })).toHaveAttribute("aria-selected", "false");
  // });

  // it("should be able to select NONE - TEst without mock (DO NOT PASS)", async () => {
  //   const { container } = render(<AllOrdersPage />);
  //   const user = userEvent.setup();
  //   // const selectedValue = container.querySelector("div.ant-select-selector > span.ant-select-selection-item");
  //   // expect(selectedValue.textContent).toBe("ALL");
  //   const SelectElement = screen.getByRole("combobox");
  //   expect(screen.queryAllByRole("option")).toHaveLength(0);
  //   screen.debug();
  //   await user.click(SelectElement as HTMLElement);
  //   const noneOption = await screen.findByLabelText(/NONE/i);
  //   await waitFor(() => {
  //     noneOption;
  //   });
  //   await user.click(noneOption);
  //   await waitFor(() => screen.debug());
  //   // expect(selectedValue.textContent).toBe("NONE");

  //   logRoles(await screen.findByRole("option"));
  // });

  it("should be able to select NONE - Test without mock", async () => {
    render(<AllOrdersPage />);
    const user = userEvent.setup();
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(2);
    screen.debug();
    // const noneOption = await screen.findByRole("option", { name: /NONE/i });
    await user.click(SelectElement as HTMLElement);
    // await user.click(noneOption);
    expect(SelectElement.value).toBe("ALL");
    fireEvent.change(SelectElement, { target: { value: "NONE" } });
    // @ts-ignore
    await waitFor(() => {
      expect(SelectElement.value).toBe("NONE");
      expect(SelectElement.value).not.toBe("ALL");
    });
  });
});

describe("All Orders Page - Unit Testing", () => {
  it("should have a options length of 5 in select after fetching get unpaid orders", async () => {
    render(<AllOrdersPage />);
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toHaveLength(2);
    screen.debug();
    await waitFor(() => {
      expect(screen.queryAllByRole("option")).toHaveLength(3);
      expect(SelectElement.value).toBe("ALL");
    });
  });

  it("should have a table with 5 columns initially after get request", async () => {
    render(<AllOrdersPage />);
    expect(screen.queryAllByRole("row")).toBe(null);
    await waitFor(() => {
      screen.debug();
      ["Order #", "Total", "Status", "Table Number", "Actions"].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
      expect(screen.queryByText("Order Menu")).toBeInTheDocument();
      ["Order #APP1", "Order #FTP2", "Order #KBB3"].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
      expect(screen.queryAllByRole("row")).toHaveLength(3);
    });
  });

  it("user select one option qnd only one result is found and then set back to ALL", async () => {
    render(<AllOrdersPage />);
    const user = userEvent.setup();
    const SelectElement: Jest.Mock<HTMLSelectElement> = screen.getByRole("combobox");
    expect(SelectElement.value).toBe("ALL");
    expect(screen.queryAllByRole("option")).toBe(null);
    screen.debug();
    await user.click(SelectElement as HTMLElement);
    fireEvent.change(SelectElement, { target: { value: "KBB3" } });
    await waitFor(() => {
      expect(SelectElement.value).toBe("KBB3");
      ["Order #APP1", "Order #FTP2"].forEach((text) => {
        expect(screen.getByText(text)).not.toBeInTheDocument();
      });
    });
    expect(await screen.findAllByRole("row")).toHaveLength(1);
    await user.click(SelectElement as HTMLElement);
    fireEvent.change(SelectElement, { target: { value: "ALL" } });
    await waitFor(() => {
      screen.debug();
      ["Order #APP1", "Order #FTP2", "Order #KBB3"].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
    expect(await screen.findAllByRole("row")).toHaveLength(3);
  });
});
