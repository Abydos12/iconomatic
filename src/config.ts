import { cosmiconfig } from "cosmiconfig";
import type { Config, Options } from "./types.ts";

import defaultsDeep from "lodash.defaultsdeep";
import { join } from "path";
import { TEMPLATES_DIRECTORY } from "./constants.js";

const explorer = cosmiconfig("fontomatic");

export async function loadConfig(): Promise<Config> {
  const result = await explorer.search();

  if (result?.filepath) {
    console.log(`Found config file at ${result.filepath}`);
  }

  const config: Options = result?.config ?? {};

  defaultsDeep(config, defaultConfig);

  return config as Config;
}

const DEFAULT_NAME: string = "iconfont";

const defaultConfig: Config = {
  name: DEFAULT_NAME,
  input: "icons",
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
  assets: {
    output: "assets",
    css: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
      template: join(TEMPLATES_DIRECTORY, "css.hbs"),
    },
    json: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
      template: "",
    },
  },
  icons: { enabled: true, output: "icons" },
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
