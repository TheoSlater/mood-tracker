import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme"; // we also have a light mdoe (ALPHA)

const currentTheme = darkTheme;
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: {
            height: "100%",
            width: "100%",
            // Prevent overscroll on mobile
            overscrollBehavior: "none",
          },
          body: {
            margin: 0,
            width: "100%",
            height: "100%",
            // Handle Android system UI bars
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            // Use dynamic viewport height for better mobile support
            minHeight: "100dvh",
            backgroundColor: (theme: {
              palette: { background: { default: any } };
            }) => theme.palette.background.default,
          },
          "#root": {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          },
          // Global mobile tap highlight removal
          "*": {
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            // Prevent pull-to-refresh on mobile
            overscrollBehavior: "none",
          },
          // For interactive elements specifically
          "button, [role='button'], input, select, textarea, a": {
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            KhtmlUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
          },
        }}
      />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
