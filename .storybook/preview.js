import "@mantine/core/styles.css";

import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import React from "react";
import "../src/index.css";

export const decorators = [
  (renderStory) => (
    <MantineProvider forceColorScheme="light" theme={DEFAULT_THEME}>
      {renderStory()}
    </MantineProvider>
  ),
];
