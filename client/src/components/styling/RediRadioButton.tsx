import { faRegistered, faSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import { useState } from "react";
import { BACKGROUND_COLOR, LIGHT_GREY, ORANGE_DARK, ORANGE_LIGHT } from "../../constants";
import { RadioButton } from "../../styles";
import { SpanBlockM02Y } from "../../styles/styledComponents/typography.styled";

const RediRadioButton = () => {
  // props: options, selected, defaultValue
  const [selectedButton, setSelectedButton] = useState("SIGN IN");
  const [hasIcon, setHasIcon] = useState(true);
  const haveIcon = hasIcon;
  const isSelected = (radioValue: string) => {
    return selectedButton === radioValue;
  };
  const colorStyle = (currentButton: string) => {
    return {
      backgroundColor: isSelected(currentButton) ? BACKGROUND_COLOR : LIGHT_GREY,
      fontWeight: isSelected(currentButton) ? "bold" : "normal",
      color: isSelected(currentButton) ? ORANGE_LIGHT : BACKGROUND_COLOR,
      border: isSelected(currentButton) ? `solid 1px ${ORANGE_DARK}` : "none",
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
