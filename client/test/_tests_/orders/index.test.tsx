import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AllOrdersPage from "../../../pages/index";

describe("All Orders Page - Unit Testing", () => {
  it("should render the component", () => {
    render(<AllOrdersPage />);
    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
  });
  it("should have a select input with default value of ALL", () => {
    render(<AllOrdersPage />);
    expect(screen.getByText(/ALL/i)).toBeInTheDocument();
    // console.log("container", container.querySelector(".ant-select-selection-search-input"));
    // console.log("select", screen.getByRole("combobox"));
    // expect(screen.getByText(/ALL/i)).toBeInTheDocument();
    // expect(screen.getByRole("combobox")).toHaveTextContent(/ALL/i);
  });
  it("should be able to select NONE", async () => {
    render(<AllOrdersPage />);
    const user = userEvent.setup();
    const SelectElement: HTMLElement = screen.getByRole("combobox");
    console.log("select", SelectElement);
    expect(SelectElement).toHaveTextContent(/ALL/i);
    await user.click(SelectElement);
    const noneOption = screen.getByRole("option", { name: /NONE/i });
    await user.pointer([
      {
        type: "pointerMove",
        target: noneOption,
      },
    ]);
    await user.click(noneOption);
    expect(SelectElement).toHaveTextContent(/NONE/i);
  }); // this test will be removed after the mock API, some issues were found with select input and might need to be mocked. Test user Pointer as well

  it("should have a table with 5 columns initially after get request", () => {
    render(<Select />)
});

describe("All Orders Page - Unit Testing", () => {
  it.todo("should have a options length of 5 in select after fetching get unpaid orders");
  it.todo("should have a table with 5 columns initially after get request");
  it.todo("user select one option qnd only one result is found");
  it.todo("user select one option qnd only one result is found and then set back to ALL");
});
