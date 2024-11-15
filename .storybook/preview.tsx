// Import styles of packages that you've installed.
// All packages except @mantine/hooks require styles imports
import "@mantine/core/styles.css";

import "../src/app/globals.css";
import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import React from "react";
// theme.ts file from previous step

export const decorators = [
  (renderStory: any) => (
    <MantineProvider forceColorScheme="light" theme={DEFAULT_THEME}>
      {renderStory()}
    </MantineProvider>
  ),
];
