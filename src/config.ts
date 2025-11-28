import { cosmiconfig } from "cosmiconfig";
import { type ConfigOutput, ConfigSchema } from "./types.ts";
import * as v from "valibot";
import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";

const explorer = cosmiconfig("iconomatic");

export async function loadConfig(): Promise<ConfigOutput> {
  const result = await explorer.search();

  if (!result?.config) {
    throw Error("No config found");
  }
  console.log(`Found config file at ${result.filepath}`);
  return v.parse(ConfigSchema, result?.config);
}

export const svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions> = {
  normalize: true,
  fontHeight: 1000,
};
