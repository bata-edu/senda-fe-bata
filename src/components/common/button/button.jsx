import { UnstyledButton } from "@mantine/core";
import React from "react";

export const Button = ({
  variant = "blue",
  backgroundColor,
  label,
  disabled,
  icon,
  full,
  iconPosition = "right",
  ...props
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white shadow-sm font-normal text-base rounded-lg font-mono",
  };

  return (
    <UnstyledButton
      disabled={disabled}
      type="button"
      className={`${colorClasses[disabled ? "disabled" : variant]} ${
        full ? "w-full" : ""
      } text-nowrap px-4 py-2.5 h-11  flex items-center justify-center `}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <div className={label ? "mr-2" : ""}>{icon}</div>
      )}
      {label && label}
      {icon && iconPosition === "right" && <div className="ml-2">{icon}</div>}
    </UnstyledButton>
  );
};
