import { Col, Row, Space } from "antd";

export const RowCenter = ({ children, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="center">
      {children}
    </Row>
  );
};
export const RowCenterSp = ({ children, size, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="center">
      <Space size={size}>{children}</Space>
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

export const RowBetweenSp = ({ children, size, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="space-between">
      <Space size={size}>{children}</Space>
    </Row>
  );
};
export const RowAroundSp = ({ children, size, ...props }: any) => {
  return (
    <Row {...props} align="middle" justify="space-around">
      <Space size={size}>{children}</Space>
    </Row>
  );
};

export const CenteredCol = ({ children, ...props }: any) => {
  return (
    <Col {...props} style={{ textAlign: "center" }}>
      {children}
    </Col>
  );
};
