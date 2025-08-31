import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "path";
import type { Config, FontType, IconMeta } from "./types.ts";
import Stream from "node:stream";
import { extname } from "node:path";

export async function loadIconsMeta({
  input,
  unicode,
}: Config): Promise<IconMeta[]> {
  let currentCodepoint: number = unicode.start;
  const taken = new Set<number>(Object.values(unicode.codepoints));

  const nextCodepoint = (): number => {
    currentCodepoint++;
    // skip codepoint override
    while (taken.has(currentCodepoint)) {
      currentCodepoint++;
    }
    return currentCodepoint;
  };

  const entries = await readdir(input, {
    withFileTypes: true,
  });

  const metas: IconMeta[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || extname(entry.name) !== ".svg") {
      continue;
    }
    const name: string = entry.name.slice(0, -4);
    const path: string = join(input, entry.name);
    const codepoint: number = unicode.codepoints[name] ?? nextCodepoint();
    const codepointHex: string = codepoint.toString(16);
    const char: string = String.fromCodePoint(codepoint);

    metas.push({ name, path, codepoint, char, codepointHex });
  }

  return metas;
}

export async function saveFontIfNeeded(
  font:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  fontType: FontType,
  config: Config,
): Promise<void> {
  const fontConfig = config.fonts[fontType];

  if (!fontConfig.enabled) {
    return;
  }

  const output = join(config.output, config.fonts.output, fontConfig.output);
  const filename = `${fontConfig.filename}.${fontType}`;

  await mkdir(output, { recursive: true });
  const path = join(output, filename);
  await writeFile(join(output, filename), font);
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

export function logMemory(label = "memory") {
  const used = process.memoryUsage();
  console.log(
    `[${label}] RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB, Heap: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
  );
}
