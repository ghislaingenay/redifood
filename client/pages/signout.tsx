import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../src/components/Loading";
import { NotificationRes } from "../src/definitions/notification.class";
import { AxiosFunction } from "./api/axios-request";

const SignOut = () => {
  const router = useRouter();

  const logOut = async () => {
    await AxiosFunction({
      url: "/api/auth/signout",
      method: "post",
      body: {},
      queryParams: {},
    })
      .then(() => {
        NotificationRes.onSuccess({
          title: "Sign out",
          description: "You have been signed out successfully",
          placement: "top",
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch(() => {
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
  }, []);

  return <Loading />;
};

export default SignOut;
