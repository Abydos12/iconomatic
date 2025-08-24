import { readdir } from "node:fs/promises";
import { extname, join } from "path";
import { IconMeta } from "./types";
import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";

export const svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions> = {
  fontName: "test-font",
  normalize: true,
};

export const OPTIONS = {
  input: "icons",
  unicode: {
    start: 0xf0000,
  },
  fonts: {
    svg: {
      enable: true,
      filename: "font.svg",
      output: "output",
    },
    ttf: {
      enable: true,
      filename: "font.tff",
      output: "output",
    }
  },
};

export type Options = typeof OPTIONS;

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