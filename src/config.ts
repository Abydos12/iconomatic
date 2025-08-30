import { cosmiconfig } from "cosmiconfig";
import type { Config, FontConfig, FontType, Options } from "./types.ts";

const explorer = cosmiconfig("fontomatic");

export async function loadConfig(): Promise<Config> {
  return parseConfig(await loadOptions());
}

async function loadOptions(): Promise<Options> {
  const result = await explorer.search();

  if (result?.filepath) {
    console.log(`Found config file at ${result.filepath}`);
  }

  const loaded = result?.config ?? {};

  return loaded;
}

function parseConfig(opts: Options): Config {
  const name = opts.name ?? "font";

  const parseFontConfig = (opts: Options, fontType: FontType): FontConfig => {
    return {
      enable: opts.fonts?.[fontType]?.enable ?? true,
      filename: `${opts.fonts?.[fontType]?.filename ?? name}.${fontType}`,
      output:
        (opts.fonts?.[fontType]?.output ?? opts.fonts?.output ?? opts.output)
          ? `${opts.output}/fonts`
          : "output/fonts",
    };
  };

  return {
    name,
    input: opts.input ?? "icons",
    prefix: null,
    unicode: {
      start: opts.unicode?.start ?? 0xf0000,
      codepoints: {},
    },
    fonts: {
      svg: parseFontConfig(opts, "svg"),
      ttf: parseFontConfig(opts, "ttf"),
      eot: parseFontConfig(opts, "eot"),
      otf: parseFontConfig(opts, "otf"),
      woff: parseFontConfig(opts, "woff"),
      woff2: parseFontConfig(opts, "woff2"),
    },
  };
}
