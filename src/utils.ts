import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "path";
import type { Config, FontConfig, IconMeta } from "./types.ts";
import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";
import Stream from "node:stream";
import { extname } from "node:path";

export const svgIcon2svgFontOptions: Partial<SVGIcons2SVGFontStreamOptions> = {
  fontName: "test-font",
  normalize: true,
};

export async function loadIconsMeta({
  input,
  unicode,
}: Config): Promise<IconMeta[]> {
  let currentCodepoint: number = unicode.start;
  const taken = new Set<number>(Object.values(unicode.codepoints));

  const nextCodepoint = (): number => {
    // skip codepoint override
    while (taken.has(currentCodepoint)) {
      currentCodepoint++;
    }
    return currentCodepoint;
  };

  const entries = await readdir(input, {
    withFileTypes: true,
  });

  const metas = entries
    .filter((entry) => entry.isFile() && extname(entry.name) === ".svg")
    .map((entry): IconMeta => {
      const name: string = entry.name.slice(0, -4);
      const path: string = join(input, entry.name);
      const codepoint: number = unicode.codepoints[name] ?? nextCodepoint();

      return { name, path, codepoint };
    });

  return metas;
}

export async function saveFont(
  font:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  opts: FontConfig,
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
