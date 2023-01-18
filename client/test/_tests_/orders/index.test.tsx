import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import AllOrdersPage from "../../../pages/index";

// jest.mock("antd", () => {
//   const antd = jest.requireActual("antd");

//   const Select = ({ children, onChange, multiple, defaultValue, disabled, value }) => {
//     return (
//       <select
//         value={value}
//         defaultValue={defaultValue}
//         disabled={disabled}
//         onChange={(e) =>
//           onChange(multiple ? Array.from(e.target.selectedOptions).map((option) => option.value) : e.target.value)
//         }
//       >
//         {children}
//       </select>
//     );
//   };

//   // eslint-disable-next-line react/display-name
//   Select.Option = ({ children, ...otherProps }) => {
//     return <option {...otherProps}>{children}</option>;
//   };

//   return {
//     ...antd,
//     Select,
//   };
// });

describe("All Orders Page - Unit Testing", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should render the component", () => {
    render(<AllOrdersPage />);
    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
  });
});

describe("All Orders Page - Unit Testing", () => {
  it.todo("should have a options length of 5 in select after fetching get unpaid orders");
  it.todo("should have a table with 5 columns initially after get request");
  it.todo("user select one option qnd only one result is found");
  it.todo("user select one option qnd only one result is found and then set back to ALL");
});
