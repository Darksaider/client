import React from "react";

interface StatusConfig {
  [key: string]: string;
}

interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
  defaultClass?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  config,
  defaultClass = "bg-gray-100 text-gray-800",
}) => {
  const className = config[status] || defaultClass;

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}
    >
      {status}
    </span>
  );
};
