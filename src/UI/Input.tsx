import React, { InputHTMLAttributes } from "react";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
  error?: string;
}

const Input: React.FC<inputProps> = ({
  className,
  placeholder,
  error,
  ...props
}) => {
  const baseStyle =
    "border-b-1 border-b-inputBottomColor focus:outline-0 p-1.5 w-full";
  const combinedStyle = `${baseStyle} ${className || ""}`;
  return (
    <div className="basis-1/2">
      <input className={combinedStyle} placeholder={placeholder} {...props} />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input;
