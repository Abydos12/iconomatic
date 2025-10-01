/** @type {import("iconomatic").Options} */
const options = {
  fonts: {
    output: "fonts",
    svg: {
      enabled: false,
    },
    ttf: {
      enabled: false,
    },
    woff: {
      enabled: true,
    },
    woff2: {
      enabled: true,
    },
  },
  icons: {
    enabled: true,
    input: "icons",
    output: "icons",
    svg: {
      enabled: true,
    },
    assets: {
      css: {
        enabled: true,
      },
      json: {
        enabled: true,
      },
    },
  },
  pictograms: {
    enabled: true,
    input: "pictograms",
    output: "pictograms",
    svg: {
      enabled: true,
    },
    assets: {
      output: "assets",
      css: {
        enabled: true,
      },
      json: {
        enabled: true,
      },
    },
  },
};

export default options;
