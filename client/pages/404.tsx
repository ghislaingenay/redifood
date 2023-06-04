import { Col } from "antd";
import { RowSpaceAround } from "../src/components/styling/grid.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { CenteredTitle } from "../src/styles";

const NotFoundPage = () => {
  return (
    <div className="background-auth no-overflow">
      <RowSpaceAround>
        <Col span={12}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </Col>
        <Col span={12}>
          <CenteredTitle>This page doesn't exist.Please try again </CenteredTitle>
        </Col>
      </RowSpaceAround>
    </div>
  );
};

export default NotFoundPage;
