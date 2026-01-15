import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

const PRIMARY = "#6E026F";

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: PRIMARY,

    borderRadius: 10,

    colorBgLayout: "#FAF7FA",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",

    colorText: "#1F1A1D",
    colorTextSecondary: "#6C6067",

    colorLink: PRIMARY,
    colorLinkHover: "#8A0A8B",
    colorLinkActive: "#5A0059",

    colorBorder: "rgba(31, 26, 29, 0.12)",
    fontFamily: "Tasa, sans-serif",
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "0 6px 16px rgba(110, 2, 111, 0.25)",
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(110, 2, 111, 0.18)",
    },
    Select: {
      optionSelectedBg: "rgba(110, 2, 111, 0.10)",
    },
    Tabs: {
      inkBarColor: PRIMARY,
    },
    Checkbox: { colorPrimary: PRIMARY },
    Radio: { colorPrimary: PRIMARY },
    Switch: { colorPrimary: PRIMARY },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: PRIMARY,
    borderRadius: 10,

    colorBgLayout: "#0F0B0E",
    colorBgContainer: "#151015",
    colorBgElevated: "#1A141A",

    colorText: "#F3EEF1",
    colorTextSecondary: "#B9AEB5",

    colorLink: PRIMARY,
    colorLinkHover: "#C24C8A",
    colorLinkActive: "#8A2758",

    colorBorder: "rgba(243, 238, 241, 0.14)",
    fontFamily: "Tasa, sans-serif",
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "0 8px 18px rgba(110, 2, 111, 0.28)",
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(110, 2, 111, 0.22)",
    },
    Select: {
      optionSelectedBg: "rgba(110, 2, 111, 0.16)",
    },
    Tabs: {
      inkBarColor: PRIMARY,
    },
    Checkbox: { colorPrimary: PRIMARY },
    Radio: { colorPrimary: PRIMARY },
    Switch: { colorPrimary: PRIMARY },
  },
};
