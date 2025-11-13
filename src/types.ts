import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";
import * as v from "valibot";
import { basename, join, resolve } from "path";
import { TEMPLATES_DIRECTORY } from "./constants.js";

export interface IconMeta {
  name: string;
  path: string;
  codepoint: number;
  codepointHex: string;
  char: string;
}

export interface PictogramMeta {
  name: string;
  path: string;
  cssUrl: string;
}

const fontTypes = ["svg", "ttf", "woff", "woff2"] as const;
export type FontType = (typeof fontTypes)[number];
export type AssetType = "css" | "json";

export type FontConfig = {
  enabled: boolean;
  filename: string;
  output: string;
};

const FontsConfigSchema = v.object({
  output: v.exactOptional(v.string(), "fonts"),
  svg: v.exactOptional(v.boolean(), true),
  ttf: v.exactOptional(v.boolean(), true),
  woff2: v.exactOptional(v.boolean(), true),
});

export type AssetConfig = {
  enabled: boolean;
  filename: string;
  output: string;
  template: string;
};

interface IconsConfig {
  enabled: boolean;
  input: string;
  output: string;
  prefix: string;
  svg: {
    enabled: boolean;
    output: string;
  };
  assets: { output: string } & Record<AssetType, AssetConfig>;
}

const PathSchema = v.pipe(v.string(), v.transform(resolve));

const BaseCollectionConfigSchema = v.object({
  name: v.string(),
  input: PathSchema,
  output: v.string(),
  prefix: v.string(),
});

const CollectionConfigSchema = v.variant("type", [
  v.object({
    type: v.literal("FONT"),
    ...BaseCollectionConfigSchema.entries,
    fonts: FontsConfigSchema,
  }),
  v.object({
    type: v.literal("PICTOGRAMS"),
    ...BaseCollectionConfigSchema.entries,
  }),
]);

const DocsConfigSchema = v.object({
  enabled: v.exactOptional(v.boolean(), true),
  filename: v.exactOptional(v.string(), "docs"),
  output: v.exactOptional(v.string(), "docs"),
  template: v.exactOptional(
    PathSchema,
    join(TEMPLATES_DIRECTORY, "docs.html.hbs"),
  ),
});

export const ConfigSchema = v.object({
  name: v.exactOptional(v.string(), "icon-lib"),
  output: v.exactOptional(v.string(), "dist"),
  clear: v.exactOptional(v.boolean(), true),
  prefix: v.exactOptional(v.string(), "z"),
  docs: v.exactOptional(DocsConfigSchema, {}),
});

export type ConfigInput = v.InferInput<typeof ConfigSchema>;
export type ConfigOutput = v.InferOutput<typeof ConfigSchema>;

export interface Config {
  name: string;
  output: string;
  clear: boolean;
  prefix: string;
  unicode: {
    start: number;
    codepoints: Record<string, number>;
  };
  fonts: { output: string } & Record<FontType, FontConfig>;
  icons: IconsConfig;
  pictograms: IconsConfig;
  docs: {
    enabled: boolean;
    filename: string;
    output: string;
    template: string;
  };
  svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions>;
}

export type Options = DeepPartial<Config>;

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export interface DocTemplateContext {
  name: string;
  icons: IconMeta[];
  iconsPrefix: string;
  iconsCssPath: string;
  pictograms: PictogramMeta[];
  pictogramsEnabled: boolean;
  pictogramsPrefix: string;
  pictogramsCssPath: string;
}
