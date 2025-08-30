export interface IconMeta {
  name: string;
  path: string;
  codepoint: number;
  char: string;
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
  input: string;
  output: string;
  clear: boolean;
  prefix?: string;
  unicode: {
    start: number;
    codepoints: Record<string, number>;
  };
  fonts: { output: string } & Record<FontType, FontConfig>;
  assets: { output: string } & Record<AssetType, AssetConfig>;
  icons: {
    enabled: boolean;
    output: string;
  };
}

export interface Options {
  name?: string;
  input?: string;
  output?: string;
  clear?: boolean;
  prefix?: string;
  unicode?: {
    start?: number;
    codepoints?: Record<string, number>;
  };
  fonts?: { output?: string } & Partial<Record<FontType, FontConfig>>;
  assets?: { output?: string } & Partial<Record<AssetType, AssetConfig>>;
  icons?: {
    enabled?: boolean;
    output?: string;
  };
}
