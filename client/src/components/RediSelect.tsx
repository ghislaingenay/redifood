import { Select } from "antd";

interface RediSelectProps extends React.ComponentProps<typeof Select> {
  options: {
    value: string;
    label: string;
  }[];
  initialOption: {
    value: string;
    label: string;
  };
}

export const RediSelect = ({ options, initialOption, ...props }: RediSelectProps) => {
  return (
    <>
      <Select {...props}>
        <Select.Option value={initialOption.value}>{initialOption.label}</Select.Option>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
