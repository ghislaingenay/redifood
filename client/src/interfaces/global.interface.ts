export type TStatusProps = "error" | "success";

export interface IGetServerSideProps {
  props: {
    data: Record<string, any>;
    status: TStatusProps;
  };
}

export enum EButtonType {
  SUCCESS = "success",
  ERROR = "error",
  EDIT = "edit",
  CREATE = "create",
  INFO = "info",
  DISPLAY = "display",
  NONE = "none",
}
