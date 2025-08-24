import { mkdir, readdir, writeFile } from "node:fs/promises";
import { extname, join } from "path";
import { IconMeta } from "./types";
import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";
import Stream from "node:stream";

export const svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions> = {
  fontName: "test-font",
  normalize: true,
};

const fontTypes = ["svg", "ttf", "eot", "otf", "woff", "woff2"] as const;
export type FontType = (typeof fontTypes)[number];

export type FontOptions = {
  enable: boolean;
  filename: string;
  output: string;
};

export interface Config {
  name: string;
  input: string;
  unicode: {
    start: number;
  };
  fonts: Record<FontType, FontOptions>;
}

export interface Options {
  name?: string;
  input?: string;
  output?: string;
  unicode?: {
    start: number;
  };
  fonts?: { output?: string } & Partial<Record<FontType, Partial<FontOptions>>>;
}

export async function loadIconsMeta(input: string): Promise<IconMeta[]> {
  const entries = await readdir(input, { withFileTypes: true });

  const scanner = entries.map(async (entry): Promise<IconMeta[]> => {
    const fullPath = join(input, entry.name);
    if (entry.isDirectory()) {
      return loadIconsMeta(fullPath);
    } else if (entry.isFile() && extname(entry.name) === ".svg") {
      return [{ name: entry.name.slice(0, -4), path: fullPath }];
    } else {
      console.warn(`unexpected extension: ${entry.name}`);
      return [];
    }
  });

  return (await Promise.all(scanner)).flat();
}

export async function saveFont(
  font:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  opts: FontOptions,
): Promise<void> {
  await mkdir(opts.output, { recursive: true });
  const path = join(opts.output, opts.filename);
  await writeFile(path, font);
  console.log(`Saved: ${path}`);
}

export function printProgress(current: number, total: number) {
  const width = 40; // width of the progress bar in characters
  const ratio = current / total;
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const percent = Math.round(ratio * 100);

  // \r moves cursor to the start of the line
  process.stdout.write(
    `[${"=".repeat(filled)}${" ".repeat(empty)}] ${percent}% (${current}/${total})\r`,
  );

  if (current === total) {
    console.log(""); // move to next line when done
  }
}
