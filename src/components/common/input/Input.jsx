import { Input } from "@mantine/core";
import React from "react";

export const TextInput = ({
  label,
  placeHolder,
  disabled,
  withAsterisk,
  error,
  icon,
  value,
  onChange,
  id,
  onKeyDown,
}) => {
  return (
    <Input.Wrapper
      withAsterisk={withAsterisk}
      classNames={{ label: "text-sm mb-1 font-sans" }}
      label={label}
      error={error}
    >
      <Input
        id={id}
        leftSection={icon}
        disabled={disabled}
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        classNames={{
          placeHolder: "font-mono",
          input: `border-gray-200 border-[1px]  rounded-lg h-[44px] px-3.5 ${
            icon && "pl-9"
          } outline-none placeholder:text-gray-500 placeholder:text-base placeholder:font-normal w-full font-mono`,
        }}
      />
    </Input.Wrapper>
  );
};
