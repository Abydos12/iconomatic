import { cosmiconfig } from "cosmiconfig";
import type { Config, Options } from "./types.ts";

import defaultsDeep from "lodash.defaultsdeep";
import { join } from "path";
import { TEMPLATES_DIRECTORY } from "./constants.js";

const explorer = cosmiconfig("iconomatic");

export async function loadConfig(): Promise<Config> {
  const result = await explorer.search();

  if (result?.filepath) {
    console.log(`Found config file at ${result.filepath}`);
  }

  const config: Options = result?.config ?? {};

  defaultsDeep(config, defaultConfig);

  return config as Config;
}

const DEFAULT_NAME: string = "icon-lib";

const defaultConfig: Config = {
  name: DEFAULT_NAME,
  output: "dist",
  clear: true,
  prefix: "icon",
  unicode: {
    start: 0xf0000,
    codepoints: {},
  },
  fonts: {
    output: "fonts",
    svg: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
    },
    ttf: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
    },
    woff: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
    },
    woff2: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
    },
  },
  icons: {
    enabled: true,
    input: "icons",
    output: "icons",
    svg: {
      enabled: true,
      output: "svg",
    },
    assets: {
      output: "assets",
      css: {
        enabled: true,
        filename: DEFAULT_NAME,
        output: "",
        template: join(TEMPLATES_DIRECTORY, "icons.css.hbs"),
      },
      json: {
        enabled: true,
        filename: "map",
        output: "",
        template: "",
      },
    },
  },
  pictograms: {
    enabled: true,
    input: "pictograms",
    output: "pictograms",
    svg: {
      enabled: true,
      output: "svg",
    },
    prefix: "picto",
    assets: {
      output: "assets",
      css: {
        enabled: true,
        filename: DEFAULT_NAME,
        output: "",
        template: join(TEMPLATES_DIRECTORY, "pictograms.css.hbs"),
      },
      json: {
        enabled: true,
        filename: "map",
        output: "",
        template: "",
      },
    },
  },
  docs: {
    enabled: true,
    filename: DEFAULT_NAME,
    output: "docs",
    template: join(TEMPLATES_DIRECTORY, "docs.html.hbs"),
  },
  svgIcon2svgFontOptions: {
    fontName: DEFAULT_NAME,
    normalize: true,
    fontHeight: 1000,
  },
};
