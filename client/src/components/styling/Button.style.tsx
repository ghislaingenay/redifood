import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonProps, Space } from "antd";
import { BLUE, GREEN_A, GREY, ORANGE, PURPLE, RED } from "../../constants";
import { EButtonType } from "../../interfaces";
import { BtnHover } from "../../styles";
import { AnimButton } from "../../styles/animations/buttons.anim";

interface IRediButtonProps extends ButtonProps {
  buttonType: EButtonType;
}

export const RediButton = ({ buttonType, children, ...props }: IRediButtonProps) => {
  const handleButtonColor = (buttonColor: IRediButtonProps["buttonType"]) => {
    const basicStyling = { margin: 0 };
    switch (buttonColor) {
      case EButtonType.CREATE: {
        return { ...basicStyling, backgroundColor: BLUE };
      }
      case EButtonType.DISPLAY: {
        return { ...basicStyling, backgroundColor: ORANGE };
      }
      case EButtonType.EDIT: {
        return { ...basicStyling, backgroundColor: PURPLE };
      }
      case EButtonType.ERROR: {
        return { ...basicStyling, backgroundColor: RED };
      }
      case EButtonType.SUCCESS: {
        return { ...basicStyling, backgroundColor: GREEN_A };
      }
      case EButtonType.INFO: {
        return { ...basicStyling, backgroundColor: GREY };
      }
      case EButtonType.NONE: {
        return { ...basicStyling };
      }
    }
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
