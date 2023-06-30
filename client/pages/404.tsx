import { ExclamationCircleOutlined } from "@ant-design/icons";
import { RowCenter } from "../src/components/styling/grid.styled";
import { ORANGE_DARK } from "../src/constants";
import { CenteredTitle } from "../src/styles";

const NotFoundPage = () => {
  return (
    <div className="background-auth no-overflow">
      <RowCenter>
        <ExclamationCircleOutlined style={{ color: "white", fontSize: "8rem" }} />
      </RowCenter>
      <CenteredTitle style={{ color: "white", padding: '0 "rem' }}>
        This page that you requested doesn't exist. <span style={{ color: ORANGE_DARK }}>Please try again </span>
      </CenteredTitle>
    </div>
  );
};

export default NotFoundPage;
