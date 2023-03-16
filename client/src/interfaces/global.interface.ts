import { RequestContext } from "next/dist/server/base-server";

export interface IGetServerSideProps {
  props: {
    data: Record<string, any>;
    status: "error" | "success";
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

export interface IFormInterface {
  label: string;
  name: string;
  component: JSX.Element;
  rules: Object[];
}

export interface IGlobalOptions {
  value: string | number;
  label: string;
}

export enum ELanguage {
  ENGLISH = "en",
  FRENCH = "fr",
}

export interface ServerInfo {
  locale: any;
  req: RequestContext;
}
