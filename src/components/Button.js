import clsx from "clsx";

const Button = ({ className, children, onClick }) => {
  return (
    <button
      className={clsx([
        "flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0",
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
