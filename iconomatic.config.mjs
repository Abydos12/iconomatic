/** @type {import("src").ConfigInput} */
const config = {
  name: "Ze best lib",
  output: "tests/dev/dist",
  prefix: "z",
  collections: [
    {
      type: "FONT",
      name: "Material Symbols",
      prefix: "ms",
      input: "tests/dev/Material Symbols",
      output: "material-symbols",
    },
    {
      type: "PICTOGRAMS",
      name: "Fluent Color",
      prefix: "fc",
      input: "tests/dev/Fluent UI System Color Icons",
      output: "fluent-color",
    },
  ],
};

export default config;
