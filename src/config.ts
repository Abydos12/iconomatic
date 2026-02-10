import { cosmiconfig } from "cosmiconfig";
import { type ConfigOutput, ConfigSchema } from "./types.ts";
import * as v from "valibot";
import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";
import consola from "consola";

const explorer = cosmiconfig("iconomatic");

export async function loadConfig(): Promise<ConfigOutput> {
  consola.start("Loading config...");
  const result = await explorer.search();

  if (!result?.config) {
    throw Error("No config found");
  }

  const config = v.parse(ConfigSchema, result?.config);
  consola.ready(`Config file found at ${result.filepath}`);
  return config;
}

export const svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions> = {
  normalize: true,
  fontHeight: 1000,
};
