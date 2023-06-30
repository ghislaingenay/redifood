import Image, { ImageProps } from "next/image";
import Logo from "../../public/redifood-loading.gif";
import { useWindowSize } from "../hooks/useWindowSIze.hook";

const Loading = () => {
  const [widthScreen, heightScreen] = useWindowSize();

  const imageProps: ImageProps = {
    src: Logo,
    width: widthScreen * 0.35,
    height: heightScreen * 0.45,
    alt: "redifood white animated logo",
    style: {
      placeSelf: "center",
    },
  };

  return (
    <div className="background-auth no-overflow">
      <Image {...imageProps} />
    </div>
  );
};

export default Loading;
