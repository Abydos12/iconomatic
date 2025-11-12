#!/usr/bin/env node
import { logMemory } from "./utils.ts";
import type { IconMeta, PictogramMeta } from "./types.ts";
import { proccessFonts } from "./fonts.ts";
import { loadConfig } from "./config.ts";
import fs from "fs-extra";
import {
  loadIconsMeta,
  writeIconsCss,
  writeIconsFiles,
  writeIconsJsonMap,
} from "./icons.js";
import { writeDocs } from "./docs.js";
import { loadPictogramsMeta, writePictogramsCss } from "./pictograms.js";

export type { Config, ConfigInput } from "./types.ts";

async function main() {
  console.log("START");
  logMemory();
  const config = await loadConfig();

  if (config.clear) {
    await fs.emptyDir(config.output);
  }

  const icons: IconMeta[] = await loadIconsMeta(config);
  console.log(`${icons.length} icons found`);
  if (icons.length === 0) {
    return;
  }
  logMemory("icons loaded");

  const fontResults = await proccessFonts(icons, config);

  if (config.icons.svg.enabled) {
    await writeIconsFiles(icons, config);
  }

  if (config.icons.assets.json.enabled) {
    await writeIconsJsonMap(icons, config);
  }

  if (config.icons.assets.css.enabled) {
    await writeIconsCss(icons, fontResults, config);
  }

  const pictograms: PictogramMeta[] = [];
  if (config.pictograms.enabled) {
    pictograms.push(...(await loadPictogramsMeta(config)));

    if (config.pictograms.assets.css.enabled) {
      await writePictogramsCss(pictograms, config);
    }
  }

  if (config.docs.enabled) {
    await writeDocs({ icons, pictograms, config });
  }

  logMemory();
}

main().finally(() => console.log("END"));
