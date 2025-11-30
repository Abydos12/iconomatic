import { extname } from "node:path";
import type { ConfigOutput, FontCollectionConfig, IconMeta } from "./types.js";
import { logMemory } from "./utils.js";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "path";

export async function loadIconsMeta(
  config: ConfigOutput,
  { input, unicode, prefix }: FontCollectionConfig,
): Promise<IconMeta[]> {
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
    const className: string = [config.prefix, prefix, name].join("-");
    const path: string = join(input, entry.name);
    const codepoint: number = unicode.codepoints[name] ?? nextCodepoint();
    const codepointHex: string = codepoint.toString(16);
    const char: string = String.fromCodePoint(codepoint);

    metas.push({ name, className, path, codepoint, char, codepointHex });
  }

  return metas;
}

export async function writeIconsFiles(
  icons: IconMeta[],
  output: string,
): Promise<void> {
  console.group("ICONS");
  logMemory();
  await mkdir(output, {
    recursive: true,
  });
  console.time("Generating icons");
  await Promise.all(
    icons.map((icon) => copyFile(icon.path, join(output, `${icon.name}.svg`))),
  );
  console.timeEnd("Generating icons");
  logMemory();
  console.groupEnd();
}
