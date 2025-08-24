export interface IconMeta {
  name: string;
  path: string;
  codepoint: number;
}

const fontTypes = ["svg", "ttf", "eot", "otf", "woff", "woff2"] as const;
export type FontType = (typeof fontTypes)[number];

export type FontConfig = {
  enable: boolean;
  filename: string;
  output: string;
};

export interface Config {
  name: string;
  input: string;
  prefix: string | null;
  unicode: {
    start: number;
    codepoints: Record<string, number>;
  };
  fonts: Record<FontType, FontConfig>;
}

export interface Options {
  name?: string;
  input?: string;
  output?: string;
  unicode?: {
    start: number;
  };
  fonts?: { output?: string } & Partial<Record<FontType, Partial<FontConfig>>>;
}
