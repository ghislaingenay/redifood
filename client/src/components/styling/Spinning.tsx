import { Spin } from "antd";

const Spinning = ({ ...props }) => {
  return (
    <div style={{ display: "grid", height: "100%" }}>
      <Spin {...props} style={{ placeSelf: "center" }} />
    </div>
  );
};

export { Spinning };
