import { Select } from "antd";

interface RediSelectProps extends React.ComponentProps<typeof Select> {
  options: {
    value: string;
    label: string;
  }[];
}

export const RediSelect = ({ options, ...props }: RediSelectProps) => {
  return (
    <>
      <Select {...props}>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
