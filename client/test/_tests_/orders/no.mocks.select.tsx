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
