import { cosmiconfig } from "cosmiconfig";
import type { Config, Options } from "./types.ts";

import defaultsDeep from "lodash.defaultsdeep";

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

// function parseConfig(opts: Options): Config {
//   const name = opts.name ?? "font";
//
//   const parseFontConfig = (opts: Options, fontType: FontType): FontConfig => {
//     return {
//       enabled: opts.fonts?.[fontType]?.enabled ?? true,
//       filename: `${opts.fonts?.[fontType]?.filename ?? name}.${fontType}`,
//       output:
//         (opts.fonts?.[fontType]?.output ?? opts.fonts?.output ?? opts.output)
//           ? `${opts.output}/fonts`
//           : "output/fonts",
//     };
//   };
//
//   return {
//     name,
//     input: opts.input ?? "icons",
//     prefix: null,
//     unicode: {
//       start: opts.unicode?.start ?? 0xf0000,
//       codepoints: {},
//     },
//     fonts: {
//       svg: parseFontConfig(opts, "svg"),
//       ttf: parseFontConfig(opts, "ttf"),
//       woff: parseFontConfig(opts, "woff"),
//       woff2: parseFontConfig(opts, "woff2"),
//     },
//   };
// }

const DEFAULT_NAME: string = "iconfont";

const defaultConfig: Config = {
  name: DEFAULT_NAME,
  input: "icons",
  output: "output",
  clear: true,
  prefix: undefined,
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
      template: "templates/css.hbs",
    },
    json: {
      enabled: true,
      filename: DEFAULT_NAME,
      output: "",
      template: "",
    },
  },
  icons: { enabled: true, output: "icons" },
};
