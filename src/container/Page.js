import { useEffect, useState } from "react";
import clsx from "clsx";

const Page = ({ className, children }) => {
  const [height, setHeight] = useState(window.innerHeight)
  useEffect(() => {
    const handler = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    }
  }, []);
  return (
    <div
      className={clsx([
        "w-screen h-screen bg-blue-400 flex justify-center items-center",
        className,
      ])}
      style={{
        height,
      }}
    >
      {children}
    </div>
  );
};

export default Page;
