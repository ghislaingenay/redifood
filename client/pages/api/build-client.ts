import axios from "axios";

const buildClient = ({ req }: { req: any }) => {
  // return axios.create({
  //   baseURL: `${process.env.BACK_END}`,
  //   headers: req.headers,
  // });
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      baseURL: "http://www.rediapp.net",
      headers: req.headers,
    });
    // baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
