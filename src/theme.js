export const antdThemeConfig = {
  token: {
    colorPrimary: "#880099",
    colorInfo: "#880099",
    colorSuccess: "#6d9c71",
    colorWarning: "#e8b94f",
    colorError: "#cf222e",
    colorTextBase: "#29362f",
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
      headerBg: "#f6f9f6",
      headerColor: "#4d0057",
      rowHoverBg: "#fcfdfc",
      borderRadius: 10,
    },
    Menu: {
      itemBorderRadius: 8,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};
