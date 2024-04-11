import clsx from "clsx";

const Page = ({ className, children }) => {
  return (
    <div
      className={clsx([
        "min-h-screen bg-blue-400 flex justify-center items-center",
        className,
      ])}
    >
      {children}
    </div>
  );
};

export default Page;
