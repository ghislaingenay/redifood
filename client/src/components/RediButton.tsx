import {
  CheckOutlined,
  CloseCircleOutlined,
  FormOutlined,
  InfoOutlined,
  PlusCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { CreateButton, DisplayButton, EditButton, ErrorButton, InfoButton, SuccessButton } from "@styles";
import { Button, ButtonProps } from "antd";

type ButtonType = "warning" | "error" | "success" | "info" | "edit" | "create" | "display";
interface IButtonProps extends ButtonProps {
  typeButton: ButtonType;
  title: string;
  haveIcon: boolean;
}

interface IButtonChoice {
  type: ButtonType;
  icon: JSX.Element;
}

const buttonChoice: IButtonChoice[] = [
  { type: "warning", icon: <WarningOutlined /> },
  { type: "success", icon: <CheckOutlined /> },
  { type: "create", icon: <PlusCircleOutlined /> },
  { type: "error", icon: <CloseCircleOutlined /> },
  { type: "edit", icon: <FormOutlined /> },
  { type: "info", icon: <InfoOutlined /> },
];

export const RediButton: IButtonProps = ({ typeButton, title, haveIcon, ...props }): JSX.Element => {
  const button = buttonChoice.find((button) => button.type === typeButton);
  const showIcon = { icon: haveIcon ? button.icon : null };
  switch (button.type) {
    case "success": {
      return (
        <SuccessButton {...props} {...showIcon}>
          {title}
        </SuccessButton>
      );
    }
    case "warning": {
      return (
        <Button {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </Button>
      );
    }
    case "error": {
      return (
        <ErrorButton {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </ErrorButton>
      );
    }
    case "create": {
      return (
        <CreateButton {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </CreateButton>
      );
    }
    case "edit": {
      return (
        <EditButton {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </EditButton>
      );
    }
    case "info": {
      return (
        <InfoButton {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </InfoButton>
      );
    }
    case "display": {
      return (
        <DisplayButton {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </DisplayButton>
      );
    }
    default: {
      return (
        <Button {...props} icon={haveIcon ? button.icon : null}>
          {title}
        </Button>
      );
    }
  }
};
