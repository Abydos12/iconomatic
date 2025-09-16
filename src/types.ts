import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";

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

type AssetType = "css" | "json";

export type FontConfig = {
  enabled: boolean;
  filename: string;
  output: string;
};

export type AssetConfig = {
  enabled: boolean;
  filename: string;
  output: string;
  template: string;
};

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
  icons: {
    enabled: boolean;
    input: string;
    output: string;
    svg: {
      enabled: boolean;
      output: string;
    };
    assets: { output: string } & Record<AssetType, AssetConfig>;
  };
  pictograms: {
    enabled: boolean;
    input: string;
    output: string;
    svg: {
      enabled: boolean;
      output: string;
    };
    prefix: string;
    assets: { output: string } & Record<AssetType, AssetConfig>;
  };
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
