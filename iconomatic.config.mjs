/** @type {import("src").ConfigInput} */
const config = {
  output: "tests/dev/dist",
  collections: [
    {
      type: "FONT",
      name: "icon",
      prefix: "i",
      input: "tests/dev/icons",
      output: "icons",
    },
    {
      type: "PICTOGRAMS",
      name: "pictograms",
      prefix: "p",
      input: "tests/dev/pictograms",
      output: "pictograms",
    },
  ],
};

export default config;
