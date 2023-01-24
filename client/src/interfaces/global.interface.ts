type TStatusProps = "error" | "success";

export interface IGetServerSideProps {
  props: {
    data: Record<string, any>;
    status: TStatusProps;
  };
}
