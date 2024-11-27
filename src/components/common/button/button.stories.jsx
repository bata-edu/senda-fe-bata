import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Common/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export default meta;

export const PurpleButton = {
  args: {
    variant: "purple",
    label: "Inciar sesión",
  },
};

export const Green = {
  args: {
    variant: "green",
    label: "Button",
  },
};

export const White = {
  args: {
    // icon: <Metamask />,
    variant: "white",
    label: "Ingresa con Metamask",
  },
};

export const Black = {
  args: {
    variant: "black",
    label: "Wallet",
  },
};

export const Icon = {
  args: {
    variant: "white",
    // icon: <View />,
    label: "Vista",
  },
};

export const GreenWithBorder = {
  args: {
    variant: "greenWithBorder",
    label: "Button",
  },
};

export const Disabled = {
  args: {
    disabled: true,
    label: "Vista",
  },
};

export const Back = {
  args: {
    variant: "back",
    // icon: <BackArrow />,
  },
};

export const transparent = {
  args: {
    variant: "transparent",
    // icon: <Trash />,
  },
};
