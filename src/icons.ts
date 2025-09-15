import type { Config, IconMeta } from "./types.js";
import { logMemory } from "./utils.js";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "path";

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