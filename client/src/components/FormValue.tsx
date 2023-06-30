export interface IFormItemBrokerType<T = any> {
  id?: string;
  value?: T;
  onChange?: (value: T) => void;
  children?: (val: Omit<IFormItemBrokerType<T>, "children">) => JSX.Element;
}

export const FormValue = (props: IFormItemBrokerType) => {
  const { id, value, onChange, children } = props;
  if (!children) return <></>;
  return children({ id, value, onChange });
};
