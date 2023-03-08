import { IFormInterface } from "../interfaces";
import { RoundedInput, RoundedInputNum } from "../styles/styledComponents/typography.styled";

const styleNoM = { margin: 0 };
export const optionsCreateFood = (fn: Function): IFormInterface[] => [
  // {
  //   label: "Picture",
  //   name: "itemPhoto",
  //   component: <RoundedInput style={styleNoM} />,
  //   rules: [{ required: true, message: "A picture is required" }],
  // },
  {
    label: "Name",
    name: "itemName",
    component: <RoundedInput maxLength={30} placeholder="Name" style={styleNoM} aria-label="itemName" />,
    rules: [{ required: true, message: "A name is required" }],
  },
  {
    label: "Description",
    name: "itemDescription",
    component: <RoundedInput maxLength={40} placeholder="Description" style={styleNoM} aria-label="itemDescription" />,
    rules: [{ required: false, message: "A description is required" }],
  },
  {
    label: "Price",
    name: "itemPrice",
    component: <RoundedInputNum placeholder="Price..." addonAfter={fn()} style={styleNoM} aria-label="itemPrice" />,
    rules: [{ required: true, message: "A price is required" }],
  },
];
