# Iconomatic

Iconomatic is a library designed to help you build and manage icon libraries.
It provides a command-line interface (CLI) to process your SVG icons and generate various font formats (SVG, TTF, WOFF2) along with CSS files.
This makes it easy to integrate your icons into web projects.

## Installation

To get started with Iconomatic, you need to install it as a development dependency in your project:

``` shell
npm install iconomatic --save-dev
```

## Usage
Once you have configured Iconomatic, you can run it using the following command:
``` shell
npx iconomatic
```
This will process your icon collections and generate the necessary files in the specified output directory.

See the [Example below](#example)

## Configuration
Create a configuration file named `iconomatic.config.mjs` in the root of your project.
This file defines how Iconomatic should process your icons.
Here's an example configuration:
```js
/** @type {import("src").ConfigInput} */
const config = {
  // The name of your icon library. This will be used in the generated CSS and documentation.
  name: "MyIcons",

  // The directory where the generated files will be placed. Defaults to "dist".
  output: "dist",

  // A prefix to be added to all icon classes. This helps avoid naming conflicts with other CSS classes.
  prefix: "my",

  // Whether to clear the output directory before generating new files. Defaults to true.
  clear: true,

  // An array of icon collections to process.
  collections: [
    {
      // FONT collection are for monochrome icons. Icons are put inside a font file.
      type: "FONT",

      // The name of the collection. This will be used in the generated CSS and documentation.
      name: "Nice Icons",

      // The directory containing the SVG icons to be processed.
      input: "path/to/your/icons",

      // The directory where the collection files will be placed. This is relative to the output directory.
      output: "nice-icons",

      // A prefix to be added to all icons in this collection. This helps avoid naming conflicts with other collections.
      prefix: "ni",

      // The default size of the icons. This can be any valid CSS size value (e.g., "1em", "24px").
      // Defaults to 1em. 
      size: "1em",

      // Configuration for font generation.
      fonts: {
        // The directory where the font files will be placed. This is relative to the collection output directory.
        output: "fonts",

        // Whether to generate SVG fonts. Defaults to true.
        svg: true,

        // Whether to generate TTF fonts. Defaults to true.
        ttf: true,

        // Whether to generate WOFF2 fonts. Defaults to true.
        woff2: true,
      },

      // Unicode configuration for the icons.
      unicode: {
        // The starting Unicode codepoint. Defaults to 0xf0000.
        start: 0xf0000,

        // A map of icon names to specific Unicode codepoints. This allows you to assign specific Unicode values to icons.
        codepoints: {},
      },

      // Paths to custom templates for CSS generation.
      templates: {
        // The path to the CSS template file. Defaults to the built-in template.
        css: "path/to/css/template",
      },
    },
    {
      // PICTOGRAMS collection are for colorful icons / logo.
      type: "PICTOGRAMS",

      // The name of the collection. This will be used in the generated CSS and documentation.
      name: "Nice Pictograms",

      // The directory containing the SVG icons to be processed.
      input: "path/to/your/pictograms",

      // The directory where the collection files will be placed. This is relative to the output directory.
      output: "nice-pictograms",

      // A prefix to be added to all icons in this collection. This helps avoid naming conflicts with other collections.
      prefix: "np",

      // The default size of the icons. This can be any valid CSS size value (e.g., "1em", "24px").
      // Defaults to 2em.
      size: "2em",

      // Paths to custom templates for CSS generation.
      templates: {
        // The path to the CSS template file. Defaults to the built-in template.
        css: "path/to/pictograms/css/template",
      },
    },
  ],

  // Documentation configuration.
  docs: {
    // Whether to generate documentation. Defaults to true.
    enabled: true,

    // The name of the documentation file. Defaults to "index".
    filename: "index",

    // The directory where the documentation will be placed. This is relative to the output directory. Defaults to "docs".
    output: "docs",

    // The path to the documentation template file. Defaults to the built-in template.
    template: "path/to/docs/template",
  },
};

export default config;
```
## Example

### Config file
```js
/** @type {import("src").ConfigInput} */
const config = {
  name: "icon-lib",
  prefix: "z",
  collections: [
    {
      type: "FONT",
      name: "Nice icons",
      prefix: "ni",
      input: "path/to/my-nice-icons",
      output: "nice-icons",
    },
    {
      type: "PICTOGRAMS",
      name: "Nice pictograms",
      prefix: "np",
      input: "path/to/my-nice-pictograms",
      output: "nice-pictograms",
    },
  ],
};

export default config;

```

### Files generated

```
dist/
├── docs/
│   └── index.html
├── nice-icons/
│   ├── fonts/
│   │   ├── nice-icons.svg
│   │   ├── nice-icons.ttf
│   │   └── nice-icons.woff2
│   ├── nice-icons.css
│   └── nice-icons.json
├── nice-pictograms/
│   ├── nice-pictograms.css
│   └── nice-pictograms.json
└── icon-lib.css
```