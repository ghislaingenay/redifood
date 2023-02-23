import TextArea from "antd/es/input/TextArea";
import { IFormInterface } from "../interfaces";
import { RoundedInput, RoundedInputNum } from "../styles/styledComponents/typography.styled";

const styleNoM = { margin: 0 };
export const optionsCreateFood: IFormInterface[] = [
  {
    label: "Picture",
    name: "itemPhoto",
    component: <RoundedInput style={styleNoM} />,
    rules: [{ required: true, message: "A picture is required" }],
  },
  {
    label: "Name",
    name: "itemName",
    component: <RoundedInput maxLength={30} placeholder="Name" style={styleNoM} />,
    rules: [{ required: true, message: "A name is required" }],
  },
  {
    label: "Description",
    name: "itemDescription",
    component: <TextArea maxLength={40} rows={2} placeholder="Description" style={styleNoM} />,
    rules: [{ required: false, message: "A description is required" }],
  },
  {
    label: "Price",
    name: "itemPrice",
    component: <RoundedInputNum placeholder="Price..." addonAfter="$" style={styleNoM} />,
    rules: [
      { required: true, message: "A price is required" },
      { min: 0, message: "A price can't be below 0" },
    ],
  },
];
