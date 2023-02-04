import { Space } from "antd";
import { Dispatch, SetStateAction } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { hexToRgba } from "../../functions/global.fn";
import { EAuthChoice } from "../../interfaces";
import { RadioButton } from "../../styles";
import { SpanBlockM02Y } from "../../styles/styledComponents/typography.styled";

interface IRediRadio {
  value: string;
  label: string;
  icon?: JSX.Element;
}

interface IRediRadioButtonProps<T extends boolean, K = string> {
  radioSize: "small" | "middle" | "large";
  sizeSpace?: "small" | "middle" | "large" | number;
  radioGroupName: string;
  options: IRediRadio[];
  haveIcon: T;
  selectedButton: K;
  setSelectedButton: Dispatch<SetStateAction<EAuthChoice>>;
}

const RediRadioButton = (props: IRediRadioButtonProps<boolean, string>) => {
  const { options, haveIcon, selectedButton, setSelectedButton, radioGroupName, sizeSpace, radioSize } = props;

  const isSelected = (radioValue: string) => {
    return selectedButton === radioValue;
  };

  const fontStyling = radioSize === "small" ? "1rem" : radioSize === "middle" ? "2rem" : "3rem";
  const paddingStyling = radioSize === "small" ? "0.5rem 1.5rem" : radioSize === "middle" ? "1rem 3rem" : "2rem 6rem";

  const colorStyle = (currentButton: string) => {
    return {
      fontSize: fontStyling,
      padding: paddingStyling,
      backgroundColor: isSelected(currentButton) ? BACKGROUND_COLOR : LIGHT_GREY,
      fontWeight: isSelected(currentButton) ? "bold" : "normal",
      color: isSelected(currentButton) ? ORANGE_LIGHT : BACKGROUND_COLOR,
      border: isSelected(currentButton) ? `solid 1px ${ORANGE_DARK}` : "none",
      boxShadow: isSelected(currentButton)
        ? `0px 0px 10px ${hexToRgba(ORANGE_LIGHT, 0.25)}`
        : `inset 0 0 10px  ${hexToRgba(BACKGROUND_COLOR, 0.2)}`,
    };
  };

  return (
    <>
      <Space size={sizeSpace || "small"}>
        {options.map(({ label, value, icon }: IRediRadio) => (
          <>
            <RadioButton
              style={{ ...colorStyle(value) }}
              role="radio"
              aria-label={label}
              name={radioGroupName}
              value={value}
              aria-checked={isSelected(value)}
              onClick={(e) => {
                const target = e.target as HTMLButtonElement;
                return setSelectedButton((prevState: EAuthChoice) => target.value as EAuthChoice);
              }}
            >
              {haveIcon && <SpanBlockM02Y>{icon}</SpanBlockM02Y>}
              {label}
            </RadioButton>
          </>
        ))}
      </Space>
    </>
  );
};

export default RediRadioButton;
