import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NotificationRes } from "src/definitions/notification.class";
import { AxiosFunction } from "../src/functions/axios.function";

const SignOut = () => {
  const router = useRouter();

  const logOut = async () => {
    await AxiosFunction({
      url: "/api/auth/signout",
      method: "post",
      body: {},
      params: {},
    })
      .then(() => {
        console.log("success");
        NotificationRes.onSuccess({
          title: "Sign out",
          description: "You have been signed out successfully",
          placement: "top",
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch((err) => {
        console.log("failure");
        console.log("err", err);
        NotificationRes.onFailure({
          title: "Sign out",
          description: "Error while sign out, please try again",
          placement: "top",
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      });
  };
  useEffect(() => {
    logOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Signing you out ...</div>;
};

export default SignOut;
