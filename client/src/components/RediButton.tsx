import {
  CheckOutlined,
  CloseCircleOutlined,
  FormOutlined,
  InfoOutlined,
  PlusCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { CreateButton, DisplayButton, EditButton, ErrorButton, InfoButton, SuccessButton } from "../styles/index";

type ButtonType = "warning" | "error" | "success" | "info" | "edit" | "create" | "display";
interface IButtonProps {
  typeButton: ButtonType;
  title: string;
  haveIcon: boolean;
}

interface IButtonChoice {
  typeButton: ButtonType;
  icon: JSX.Element;
}

const buttonChoice: IButtonChoice[] = [
  { typeButton: "warning", icon: <WarningOutlined /> },
  { typeButton: "success", icon: <CheckOutlined /> },
  { typeButton: "create", icon: <PlusCircleOutlined /> },
  { typeButton: "error", icon: <CloseCircleOutlined /> },
  { typeButton: "edit", icon: <FormOutlined /> },
  { typeButton: "info", icon: <InfoOutlined /> },
];

export const RediButton = ({ typeButton, title, haveIcon, ...props }): JSX.Element => {
  const button = buttonChoice.find((button) => button.typeButton === typeButton);
  const showIcon = { icon: haveIcon ? button.icon : null };
  switch (typeButton) {
    case "success": {
      return (
        <SuccessButton {...props} {...showIcon}>
          {title}
        </SuccessButton>
      );
    }
    case "warning": {
      return (
        <Button {...props} {...showIcon}>
          {title}
        </Button>
      );
    }
    case "error": {
      return (
        <ErrorButton {...props} {...showIcon}>
          {title}
        </ErrorButton>
      );
    }
    case "create": {
      return (
        <CreateButton {...props} {...showIcon}>
          {title}
        </CreateButton>
      );
    }
    case "edit": {
      return (
        <EditButton {...props} {...showIcon}>
          {title}
        </EditButton>
      );
    }
    case "info": {
      return (
        <InfoButton {...props} {...showIcon}>
          {title}
        </InfoButton>
      );
    }
    case "display": {
      return (
        <DisplayButton {...props} {...showIcon}>
          {title}
        </DisplayButton>
      );
    }
    default: {
      return (
        <Button {...props} {...showIcon}>
          {title}
        </Button>
      );
    }
  }
};
