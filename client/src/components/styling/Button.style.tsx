import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonProps, Space } from "antd";
import { BLUE, GREEN_A, GREY, ORANGE, PURPLE, RED } from "../../constants";
import { EButtonType } from "../../interfaces";
import { BtnHover } from "../../styles";
import { AnimButton } from "../../styles/animations/styled.anim";

interface IRediButtonProps extends ButtonProps {
  buttonType: EButtonType;
}

export const RediButton = ({ buttonType, children, ...props }: IRediButtonProps) => {
  const handleButtonColor = (buttonColor: IRediButtonProps["buttonType"]) => {
    const basicStyling = { margin: 0 };

    const colorDictionary: Record<EButtonType, Record<string, string>> = {
      [EButtonType.CREATE]: { backgroundColor: BLUE },
      [EButtonType.DISPLAY]: { backgroundColor: ORANGE },
      [EButtonType.EDIT]: { backgroundColor: PURPLE },
      [EButtonType.ERROR]: { backgroundColor: RED },
      [EButtonType.SUCCESS]: { backgroundColor: GREEN_A },
      [EButtonType.INFO]: { backgroundColor: GREY },
      [EButtonType.NONE]: {},
    };
    return { ...basicStyling, ...colorDictionary[buttonColor] };
  };

  return (
    <BtnHover {...props} type="primary" style={handleButtonColor(buttonType)}>
      {children}
    </BtnHover>
  );
};

interface IRediIconButtonProps extends ButtonProps {
  buttonType: EButtonType;
  iconFt: IconProp;
  square?: boolean;
}

export const RediIconButton = ({ buttonType, children, iconFt, square, ...props }: IRediIconButtonProps) => {
  const isSquare = square ? { borderRadius: 0 } : {};
  return (
    <AnimButton>
      <RediButton buttonType={buttonType} {...props} style={isSquare}>
        <Space size={4}>
          <FontAwesomeIcon icon={iconFt as IconProp} /> {children}
        </Space>
      </RediButton>
    </AnimButton>
  );
};
