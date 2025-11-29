/** @type {import("src").ConfigInput} */
const config = {
  name: "icon-lib",
  output: "tests/dev/dist",
  prefix: "z",
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
    {
      type: "FONT",
      name: "icon-2",
      prefix: "i2",
      input: "tests/dev/icons",
      output: "icons-2",
    },
    {
      type: "PICTOGRAMS",
      name: "pictograms2",
      prefix: "p2",
      input: "tests/dev/pictograms",
      output: "pictograms-2",
    },
  ],
};

export default config;
