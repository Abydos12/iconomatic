import { loadIconsMeta, saveFontIfNeeded } from "./utils.ts";
import type { IconMeta } from "./types.ts";
import { generateSVG } from "./fonts.ts";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";
import { loadConfig } from "./config.ts";
import { join } from "path";
import { mkdir, writeFile } from "node:fs/promises";
import fs from "fs-extra";

export type { Config } from "./types.ts";

async function main() {
  const config = await loadConfig();

  if (config.clear) {
    await fs.emptyDir(config.output);
  }

  const icons: IconMeta[] = await loadIconsMeta(config);
  console.log(`${icons.length} icons found`);
  if (icons.length === 0) {
    return;
  }

  try {
    console.group("Font[SVG]");
    console.log("Generating the font...");
    const svg = await generateSVG(icons, config);
    console.log("Font generated");
    await saveFontIfNeeded(svg, "svg", config);
    console.groupEnd();

    console.group("Font[TTF]");
    console.log("Generating the font...");
    const ttf = svg2ttf(svg.toString());
    console.log("Font generated");
    await saveFontIfNeeded(ttf.buffer, "ttf", config);
    console.groupEnd();

    console.group("Font[WOFF2]");
    console.log("Generating the font...");
    const woff2 = ttf2woff2(ttf.buffer);
    console.log("Font generated");
    await saveFontIfNeeded(woff2, "woff2", config);
    console.groupEnd();

    const output = join(
      config.output,
      config.assets.output,
      config.assets.json.output,
    );
    const filename = `${config.assets.json.filename}.json`;

    await mkdir(output, { recursive: true });
    const path = join(output, filename);
    await writeFile(join(output, filename), JSON.stringify(icons));
    console.log(`Saved: ${path}`);
  } catch (e) {
    console.log(e);
  }
}

main().finally(() => console.log("END"));
