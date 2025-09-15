import { extname, posix } from "node:path";
import type { Config, IconMeta } from "./types.js";
import { logMemory } from "./utils.js";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { join } from "path";
import Handlebars from "handlebars";
import type { FontResults } from "./fonts.js";

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

export async function writeIconsFiles(
  icons: IconMeta[],
  config: Config,
): Promise<void> {
  console.group("ICONS");
  logMemory();
  await mkdir(
    join(config.output, config.icons.output, config.icons.svg.output),
    {
      recursive: true,
    },
  );
  console.time("Generating icons");
  await Promise.all(
    icons.map((icon) =>
      copyFile(
        icon.path,
        join(
          config.output,
          config.icons.output,
          config.icons.svg.output,
          `${icon.name}.svg`,
        ),
      ),
    ),
  );
  console.timeEnd("Generating icons");
  logMemory();
  console.groupEnd();
}

export async function writeIconsJsonMap(
  icons: IconMeta[],
  config: Config,
): Promise<void> {
  console.group("JSON");
  logMemory();
  const output = join(
    config.output,
    config.icons.output,
    config.icons.assets.output,
    config.icons.assets.json.output,
  );
  const filename = `${config.icons.assets.json.filename}.json`;

  await mkdir(output, { recursive: true });
  const path = join(output, filename);
  await writeFile(join(output, filename), JSON.stringify(icons));
  console.log(`Saved: ${path}`);
  logMemory();
  console.groupEnd();
}

export async function writeIconsCss(
  icons: IconMeta[],
  fontResults: FontResults,
  config: Config,
): Promise<string> {
  const templateStr: string = await readFile(
    config.icons.assets.css.template,
    "utf8",
  );
  const template = Handlebars.compile(templateStr);

  const dir = posix.join(
    config.output,
    config.icons.output,
    config.icons.assets.output,
    config.icons.assets.css.output,
  );
  const path = posix.join(dir, `${config.icons.assets.css.filename}.css`);

  const fonts = Object.entries(fontResults).map(([type, fontPath]) => ({
    type,
    path,
    relativePath: posix.relative(dir, fontPath),
  }));

  const templated = template({
    fonts,
    icons,
    prefix: config.prefix,
    name: config.name,
    timestamp: Date.now(),
  });
  await writeFile(path, templated);
  return path;
}
