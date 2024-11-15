import { UnstyledButton } from "@mantine/core";
import React, { ReactNode } from "react";

export interface ButtonProps {
  variant?:
    | "purple"
    | "green"
    | "white"
    | "black"
    | "greenWithBorder"
    | "back"
    | "transparent";
  backgroundColor?: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label?: string;
  full?: boolean;
  onClick?: () => void;
}

export const Button = ({
  variant = "purple",
  backgroundColor,
  label,
  disabled,
  icon,
  full,
  iconPosition = "left",
  ...props
}: ButtonProps) => {
  const colorClasses = {
    purple:
      "bg-gradient-to-r from-purple-senda to-purple-500 text-white shadow-sm font-semibold text-base rounded-lg",
    green:
      "bg-green-200 text-green-700 text-sm shadow-sm font-semibold rounded-lg",
    white:
      "border-gray-200 border-solid border-[1px] text-sm text-black font-semibold rounded-lg",
    black:
      "bg-black text-green-flourecent text-sm border-solid border-green-flourecent border-[1px] font-semibold shadow-sm rounded-lg",
    greenWithBorder:
      "bg-green-200 text-green-700 text-sm shadow-sm font-semibold border-green-senda border-solid border-[1px] rounded-lg",
    disabled:
      "bg-gray-50 text-gray-600 shadow-sm font-semibold text-sm rounded-lg",
    back: "bg-white shadow-sm w-11 rounded-[1000px] ",
    transparent: "w-11",
  };

  return (
    <UnstyledButton
      disabled={disabled}
      type="button"
      className={`${colorClasses[disabled ? "disabled" : variant]} ${full ? "w-full" : ""} text-nowrap px-4 py-2.5 h-11  flex items-center justify-center `}
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
