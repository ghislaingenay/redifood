import { ButtonProps, Col } from "antd";
import { useEffect, useState } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { RadioButton } from "../../styles";
import { AnimRadioButton } from "../../styles/animations/styled.anim";
import { SpanBlockM02Y } from "../../styles/styledComponents/span.styled";
import { RowSpaceBetween } from "./grid.styled";

interface IRediRadio {
  value: string;
  label: string;
  ariaLabel: string;
}
interface IRediRadioWithIcon extends IRediRadio {
  value: string;
  label: string;
  icon: JSX.Element;
  ariaLabel: string;
}
export type TRadioIconType = keyof TIconDataMap;

export type TIconDataMap = {
  true: IRediRadioWithIcon[];
  false: IRediRadio[];
};

export type Booleanish = "true" | "false";

interface IRediRadioButtonProps<T extends Booleanish> extends ButtonProps {
  radioGroupName: string;
  options: TIconDataMap[T];
  haveIcon: T;
  selectedButton: any;
  disabled?: boolean;
  clickedFn?: (element?: any) => void;
  padding?: string;
  fontSize?: string;
}

const RediRadioButton = (props: IRediRadioButtonProps<Booleanish>) => {
  const {
    options,
    haveIcon,
    selectedButton,
    radioGroupName,
    clickedFn,
    padding,
    fontSize,
  }: IRediRadioButtonProps<Booleanish> = props;

  const [selectedValue, setSelectedValue] = useState(options[0].value);
  useEffect(() => setSelectedValue(selectedButton), [selectedButton]);

  const isSelected = (radioValue: string | number) => selectedValue === radioValue;

  const spanValue = (options: IRediRadio[] | IRediRadioWithIcon[]) => {
    switch (options.length) {
      case 2:
        return 11;
      case 3:
        return 7;
      default:
        return 5;
    }
  };

  const colorStyle = (currentButton: string | number) => {
    return {
      fontSize: fontSize || "1.5rem",
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

  const generateRandomKey = () => Math.random().toString(36);

  return (
    <RowSpaceBetween style={{ width: "100%" }} key={generateRandomKey()}>
      {options.map(({ label, value, icon, ariaLabel }: any) => {
        return (
          <>
            <Col
              xs={24}
              sm={24}
              md={spanValue(options)}
              style={{ width: "100%" }}
              key={value}
              onClick={(e) => {
                const target = e.target as HTMLButtonElement;
                if (!target) throw new Error("Error while selecting an option");
                clickedFn && clickedFn(target.value);
              }}
            >
              <AnimRadioButton key={value}>
                <RadioButton
                  key={value}
                  aria-label={ariaLabel}
                  style={{ ...colorStyle(value) }}
                  role="radio"
                  name={radioGroupName}
                  value={value}
                  aria-checked={isSelected(value)}
                >
                  {haveIcon === "true" && <SpanBlockM02Y>{icon}</SpanBlockM02Y>}
                  {label.toUpperCase()}
                </RadioButton>
              </AnimRadioButton>
            </Col>
          </>
        );
      })}
    </RowSpaceBetween>
  );
};

export default RediRadioButton;
