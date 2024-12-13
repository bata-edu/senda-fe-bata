import { PasswordInput } from "@mantine/core";
import React from "react";

export const StyledPasswordInput = ({
  label,
  placeHolder,
  disabled,
  withAsterisk,
  description,
  value,
  onChange,
}) => {
  return (
    <PasswordInput
      withAsterisk={withAsterisk}
      disabled={disabled}
      label={label}
      placeholder={placeHolder}
      description={description}
      classNames={{
        label: "text-sm mb-1 font-sans",
        innerInput:
          "bg-none h-[44px]  placeholder:text-gray-500 placeholder:text-base placeholder:font-normal outline-none w-full rounded-lg px-3.5",
        input:
          "border-gray-200  border-[1px]  rounded-lg font-mono  outline-none w-full",
      }}
      value={value}
      onChange={onChange}
      // visibilityToggleIcon={VisibilityToggleIcon}
    />
  );
};
