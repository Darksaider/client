import React, { HTMLAttributes } from "react";

interface H1Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  styleProps?: string;
  className?: string;
}

export const FascoH1: React.FC<H1Props> = ({
  className,
  children,
  ...props
}) => {
  const baseStyle = "font-Forum text-7xl text-h1Title self-start ";
  const combinedStyle = `${baseStyle} ${className || ""}`;

  return (
    <h1 className={combinedStyle} {...props}>
      FASCO
    </h1>
  );
};
