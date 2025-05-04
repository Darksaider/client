import React, { AnchorHTMLAttributes } from "react";

interface GoogleAuthLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  className?: string;
  href?: string; // Make href required for Google Auth links
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Optional onClick handler
}

export const Button: React.FC<GoogleAuthLinkProps> = ({
  className,
  children,
  href,
  onClick,
  ...props
}) => {
  const baseStyle =
    "inline-flex gap-2 p-2.5 border-1 rounded-lsPx border-buttonGoogleBlue cursor-pointer flex items-center justify-center";
  const combinedStyle = `${baseStyle} ${className || ""}`;

  return (
    <a
      className={combinedStyle}
      href={href} // Enforce href
      onClick={onClick} // Pass the onClick handler
      rel="noopener noreferrer" // Security best practice for external links
      {...props}
    >
      {children}
    </a>
  );
};
