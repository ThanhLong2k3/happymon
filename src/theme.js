export const antdThemeConfig = {
  token: {
    colorPrimary: "#880099",
    colorInfo: "#880099",
    colorSuccess: "#880099",
    colorWarning: "#e8b94f",
    colorError: "#cf222e",
    colorTextBase: "#342d36",
    colorBgBase: "#ffffff",
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 600,
      primaryShadow: "0 4px 12px rgba(136, 0, 153, 0.2)",
    },
    Card: {
      borderRadiusLG: 12,
    },
    Table: {
      headerBg: "#f5e8f7",
      headerColor: "#750285",
      rowHoverBg: "#fcf9fd",
      borderRadius: 10,
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: "#f5e8f7",
      itemSelectedColor: "#750285",
      itemHoverBg: "#f5e8f7",
      itemHoverColor: "#880099",
    },
    Segmented: {
      itemSelectedBg: "#f5e8f7",
      itemSelectedColor: "#750285",
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};
