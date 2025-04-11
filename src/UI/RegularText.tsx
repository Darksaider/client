interface RegularTextProps {
  children: React.ReactNode;
  className?: string;
}

export const RegularText: React.FC<RegularTextProps> = ({
  children,
  className,
}) => {
  const baseStyle = "text-16";
  const combinedStyle = `${baseStyle} ${className || ""}`;
  return <span className={combinedStyle}>{children}</span>;
};
