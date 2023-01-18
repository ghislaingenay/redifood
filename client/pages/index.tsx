import { Typography } from "antd";
import Head from "next/head";
import { useState } from "react";
import { RediSelect } from "src/components/RediSelect";

const AllOrdersPage = () => {
  const { Title } = Typography;
  const [selectedOption, setSelectedOption] = useState("ALL");
  const optionsSelect = [
    {
      value: "ALL",
      label: "ALL",
    },
    {
      value: "NONE",
      label: "NONE",
    },
  ];
  return (
    <>
      <Head>
        <title>List of all unpaid orders</title>
        <meta name="description" content="List of all unpaid orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title level={2}>List of all orders</Title>
      <RediSelect value={selectedOption} onChange={(e: string) => setSelectedOption(e)} options={optionsSelect} />
    </>
  );
};

export default AllOrdersPage;
