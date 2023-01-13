import { useRouter } from "next/router";
import { useEffect } from "react";
import useRequest from "src/hooks/useRequest.hook";

const SignOut = () => {
  const router = useRouter();
  const [doRequest] = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>Signing you out ...</div>;
};

export default SignOut;
