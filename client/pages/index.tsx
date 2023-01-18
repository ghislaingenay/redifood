import { Select, Typography } from "antd";
import Head from "next/head";
import { useState } from "react";

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
      <Select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e)}
        showArrow={false}
        // options={optionsSelect}
      >
        {optionsSelect.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default AllOrdersPage;
