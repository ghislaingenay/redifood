import { Button, ButtonProps } from "antd";
import { BLUE, GREEN_A, GREY, ORANGE, PURPLE, RED } from "../../constants";
import { EButtonType } from "../../interfaces";

interface IRediButtonProps extends ButtonProps {
  buttonType: EButtonType;
}

export const RediButton = ({ buttonType, children, ...props }: IRediButtonProps) => {
  const handleButtonColor = (buttonColor: IRediButtonProps["buttonType"]) => {
    const basicStyling = { margin: "1rem 0" };
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
    <Button {...props} type="primary" style={handleButtonColor(buttonType)}>
      {children}
    </Button>
  );
};
