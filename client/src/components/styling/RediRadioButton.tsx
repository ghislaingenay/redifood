import { ButtonProps, Col } from "antd";
import { Dispatch, SetStateAction } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { EAuthChoice } from "../../interfaces";
import { RadioButton } from "../../styles";
import { SpanBlockM02Y } from "../../styles/styledComponents/span.styled";
import { RowSpaceAround } from "./grid.styled";

interface IRediRadio {
  value: string;
  label: string;
}
interface IRediRadioWithIcon extends IRediRadio {
  value: string;
  label: string;
  icon: JSX.Element;
}
export type TRadioIconType = keyof TIconDataMap;

export type TIconDataMap = {
  true: IRediRadioWithIcon[];
  false: IRediRadio[];
};

export type Booleanish = "true" | "false";

interface IRediRadioButtonProps<T extends Booleanish> extends ButtonProps {
  // radioSize: "small" | "middle" | "large";
  // widthButton: string | number;
  radioGroupName: string;
  options: TIconDataMap[T];
  haveIcon: T;
  selectedButton: string;
  setSelectedButton: Dispatch<SetStateAction<EAuthChoice>>;
  disabled?: boolean;
  clickedFn?: () => void;
  padding?: string;
  fontSize?: string;
}

const RediRadioButton = (props: IRediRadioButtonProps<Booleanish>) => {
  const {
    disabled,
    options,
    haveIcon,
    selectedButton,
    setSelectedButton,
    radioGroupName,
    clickedFn,
    padding,
    fontSize,
  }: // widthButton,
  // radioSize
  IRediRadioButtonProps<Booleanish> = props;

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
      fontSize: fontSize || "1.5rem",
      // padding: paddingStyling,
      // width: widthButton,
      padding: padding || "1rem 3rem",
      width: "100%",
      backgroundColor: isSelected(currentButton) ? BACKGROUND_COLOR : LIGHT_GREY,
      fontWeight: isSelected(currentButton) ? "bold" : "normal",
      color: isSelected(currentButton) ? ORANGE_LIGHT : BACKGROUND_COLOR,
      border: isSelected(currentButton) ? `solid 1px ${ORANGE_DARK}` : "none",
      boxShadow: isSelected(currentButton)
        ? `0px 0px 10px 2px ${hexToRgba(ORANGE_LIGHT, 0.25)}`
        : `inset 0 0 10px  ${hexToRgba(BACKGROUND_COLOR, 0.2)}`,
    };
  };

  return (
    <>
      <RowSpaceAround>
        {options.map(({ label, value, icon }: any, index) => (
          <>
            <Col span={spanValue(options)} style={{ width: "100%" }} key={index}>
              <RadioButton
                style={{ ...colorStyle(value) }}
                role="radio"
                aria-label={label}
                name={radioGroupName}
                value={value}
                aria-checked={isSelected(value)}
                onClick={(e) => {
                  const target = e.target as HTMLButtonElement;
                  if (clickedFn) clickedFn();
                  console.log("target.value", target.value);
                  // @ts-ignore
                  if (!disabled) return setSelectedButton((prevState: EAuthChoice) => target.value as EAuthChoice);
                }}
              >
                {haveIcon === "true" && <SpanBlockM02Y>{icon}</SpanBlockM02Y>}
                <b>{label.toUpperCase()}</b>
              </RadioButton>
            </Col>
          </>
        ))}
      </RowSpaceAround>
    </>
  );
};

export default RediRadioButton;
