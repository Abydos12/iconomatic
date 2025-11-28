import { dirname, extname } from "node:path";
import type { FontCollectionConfig, IconMeta } from "./types.js";
import { logMemory } from "./utils.js";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "path";

export async function loadIconsMeta({
  input,
  unicode,
}: FontCollectionConfig): Promise<IconMeta[]> {
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

export async function writeIconsJsonMap(
  icons: IconMeta[],
  path: string,
): Promise<void> {
  console.group("JSON");
  logMemory();

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(icons));
  console.log(`Saved: ${path}`);
  logMemory();
  console.groupEnd();
}
