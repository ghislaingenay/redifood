import { Row } from "antd";

export const RowCenter = ({ children, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="center">
      {children}
    </Row>
  );
};

export const RowSpaceAround = ({ children, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="space-around">
      {children}
    </Row>
  );
};

export const RowSpaceBetween = ({ children, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="space-between">
      {children}
    </Row>
  );
};
