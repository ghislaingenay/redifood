import { Typography } from "antd";
import React from "react";

const { Title } = Typography;
const Home: React.FC = () => {
  return (
    <>
      <div className="text-3xl text-green-600 p-2">
        Hello Geeks!
      </div>
      <Title level={1} className="my-8">
        Hello
      </Title>
    </>
  );
};

export default Home;
