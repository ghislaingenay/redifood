import { faRegistered, faSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import { useState } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { RadioButton } from "../../styles";
import { SpanBlockM02Y } from "../../styles/styledComponents/typography.styled";

const RediRadioButton = () => {
  // props: options, selected, defaultValue, main and second color, grey
  const [selectedButton, setSelectedButton] = useState("SIGN IN");
  const [hasIcon, setHasIcon] = useState(true);
  const haveIcon = hasIcon;
  const isSelected = (radioValue: string) => {
    return selectedButton === radioValue;
  };
  // function that convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToRgba = (rgb: { r: number; g: number; b: number }, opacity: number) => {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };
  const colorStyle = (currentButton: string) => {
    return {
      backgroundColor: isSelected(currentButton) ? BACKGROUND_COLOR : LIGHT_GREY,
      fontWeight: isSelected(currentButton) ? "bold" : "normal",
      color: isSelected(currentButton) ? ORANGE_LIGHT : BACKGROUND_COLOR,
      border: isSelected(currentButton) ? `solid 1px ${ORANGE_DARK}` : "none",
      boxShadow: isSelected(currentButton)
        ? `0px 0px 10px ${rgbToRgba(hexToRgb(ORANGE_LIGHT), 0.25)}`
        : `inset 0 0 10px  ${rgbToRgba(hexToRgb(BACKGROUND_COLOR), 0.2)}`,
    };
  };

  return (
    <>
      <Space size="small">
        <RadioButton
          style={{ ...colorStyle("SIGN IN") }}
          role="radio"
          aria-label="SIGN IN"
          name="auth"
          value="SIGN IN"
          aria-checked={isSelected("SIGN IN")}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            console.log("selcted button", selectedButton);
            return setSelectedButton(() => target.value);
          }}
        >
          {haveIcon && (
            <SpanBlockM02Y>
              <FontAwesomeIcon icon={faSign} />
            </SpanBlockM02Y>
          )}
          SIGN IN
        </RadioButton>
        <RadioButton
          style={{ ...colorStyle("REGISTER") }}
          role="radio"
          aria-label="REGISTER"
          name="auth"
          value="REGISTER"
          aria-checked={isSelected("REGISTER")}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            console.log("selcted button", selectedButton);
            return setSelectedButton(() => target.value);
          }}
        >
          {haveIcon && (
            <SpanBlockM02Y>
              <FontAwesomeIcon icon={faRegistered} />
            </SpanBlockM02Y>
          )}
          REGISTER
        </RadioButton>
      </Space>
    </>
  );
};

export default RediRadioButton;
