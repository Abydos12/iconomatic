/** @type {import("src").ConfigInput} */
const config = {
  name: "icon-lib",
  output: "tests/dev/dist",
  prefix: "z",
  collections: [
    {
      type: "FONT",
      name: "material-symbols",
      prefix: "ms",
      input: "tests/dev/Material Symbols",
      output: "material-symbols",
    },
    {
      type: "PICTOGRAMS",
      name: "fluent-color",
      prefix: "fc",
      input: "tests/dev/Fluent UI System Color Icons",
      output: "fluent-color",
    },
  ],
};

export default config;
