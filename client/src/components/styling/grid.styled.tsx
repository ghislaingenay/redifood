import { Row } from "antd";

export const RowCenter = ({ ...props }: any) => {
  return <Row {...props} align="middle" justify="center" />;
};

export const RowSpaceAround = ({ ...props }: any) => {
  return <Row {...props} align="middle" justify="space-around" />;
};

export const RowSpaceBetween = ({ ...props }: any) => {
  return <Row {...props} align="middle" justify="space-between" />;
};
