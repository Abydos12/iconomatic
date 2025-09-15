import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "path";
import type { Config, FontType, IconMeta } from "./types.ts";
import Stream from "node:stream";
import { extname, posix } from "node:path";

export async function loadIconsMeta({
  icons: { input },
  unicode,
}: Config): Promise<IconMeta[]> {
  let currentCodepoint: number = unicode.start;
  const taken = new Set<number>(Object.values(unicode.codepoints));

  const nextCodepoint = () => {
    do {
      currentCodepoint++;
    } while (taken.has(currentCodepoint));
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

export async function writeFontFile(
  font:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  fontType: FontType,
  config: Config,
): Promise<string> {
  const fontConfig = config.fonts[fontType];

  const dir: string = posix.join(
    config.output,
    config.fonts.output,
    fontConfig.output,
  );
  const filename: string = `${fontConfig.filename}.${fontType}`;

  await mkdir(dir, { recursive: true });
  const path: string = posix.join(dir, filename);
  await writeFile(posix.join(dir, filename), font);
  return path;
}

export function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    });
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
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
