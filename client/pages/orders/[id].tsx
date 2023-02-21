import { mockOneOrder } from "../../test/mocks/mockOrdersData";

const CurrentOrder = ({ currentOrder, status }: any) => {
  console.log(status);
  return (
    <>
      <h1>Current food</h1>
    </>
  );
};

export default CurrentOrder;
export async function getServerSideProps(context: any) {
  const id: string = context.query["id"];
  return { props: { currentOrder: mockOneOrder, status: "success" } };
}
