import { ExclamationCircleOutlined } from "@ant-design/icons";

const NotFoundPage = () => {
  return (
    <div className="background-auth no-overflow">
      <ExclamationCircleOutlined style={{ color: "white", fontSize: "4rem" }} />
      {/* </Col>
        <Col span={12}>
          <CenteredTitle>This page doesn't exist.Please try again </CenteredTitle>
        </Col> */}
    </div>
  );
};

export default NotFoundPage;
