import { ButtonProps, Col } from "antd";
import { Dispatch, SetStateAction } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { EAuthChoice } from "../../interfaces";
import { RadioButton } from "../../styles";
import { SpanBlockM02Y } from "../../styles/styledComponents/span.styled";
import { RowSpaceBetween } from "./grid.styled";

interface IRediRadio {
  value: string;
  label: string;
}
interface IRediRadioWithIcon extends IRediRadio {
  value: string;
  label: string;
  icon: JSX.Element;
}
type ThaveIcon = "yes" | "no";

interface IRediRadioButtonProps<T extends ThaveIcon> extends ButtonProps {
  // radioSize: "small" | "middle" | "large";
  // widthButton: string | number;
  radioGroupName: string;
  options: T extends "yes" ? IRediRadioWithIcon[] : IRediRadio[];
  haveIcon: T;
  selectedButton: string;
  setSelectedButton: Dispatch<SetStateAction<EAuthChoice>>;
}

const RediRadioButton = (props: IRediRadioButtonProps<ThaveIcon>) => {
  const {
    options,
    haveIcon,
    selectedButton,
    setSelectedButton,
    radioGroupName,
  }: // widthButton,
  // radioSize
  IRediRadioButtonProps<ThaveIcon> = props;

  const isSelected = (radioValue: string) => {
    return selectedButton === radioValue;
  };

  const spanValue = (options) => {
    switch (options.length) {
      case 2: {
        return 11;
      }
      case 3: {
        return 7;
      }
      default: {
        return 5;
      }
    }
  };

  // const fontStyling = radioSize === "small" ? "1rem" : radioSize === "middle" ? "2rem" : "3rem";
  // const paddingStyling = radioSize === "small" ? "0.5rem 1.5rem" : radioSize === "middle" ? "1rem 3rem" : "2rem 6rem";

  const colorStyle = (currentButton: string) => {
    return {
      // fontSize: fontStyling,
      // padding: paddingStyling,
      // width: widthButton,
      padding: "1rem 3rem",
      width: "100%",
      backgroundColor: isSelected(currentButton) ? BACKGROUND_COLOR : LIGHT_GREY,
      fontWeight: isSelected(currentButton) ? "bold" : "normal",
      color: isSelected(currentButton) ? ORANGE_LIGHT : BACKGROUND_COLOR,
      border: isSelected(currentButton) ? `solid 1px ${ORANGE_DARK}` : "none",
      boxShadow: isSelected(currentButton)
        ? `0px 0px 5px 10px ${hexToRgba(ORANGE_LIGHT, 0.25)}`
        : `inset 0 0 10px  ${hexToRgba(BACKGROUND_COLOR, 0.2)}`,
    };
  };

  return (
    <>
      <RowSpaceBetween>
        {options.map(({ label, value, icon }: any) => (
          <>
            <Col span={spanValue(options)} style={{ width: "100%" }}>
              <RadioButton
                style={{ ...colorStyle(value) }}
                role="radio"
                aria-label={label}
                name={radioGroupName}
                value={value}
                aria-checked={isSelected(value)}
                onClick={(e) => {
                  const target = e.target as HTMLButtonElement;
                  console.log("target.value", target.value);
                  // @ts-ignore
                  return setSelectedButton((prevState: EAuthChoice) => target.value as EAuthChoice);
                }}
              >
                {haveIcon && <SpanBlockM02Y>{icon}</SpanBlockM02Y>}
                {label}
              </RadioButton>
            </Col>
          </>
        ))}
      </RowSpaceBetween>
    </>
  );
};

export default RediRadioButton;
