#!/usr/bin/env node
import { logMemory } from "./utils.ts";
import type { IconMeta } from "./types.ts";
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

export type { Config } from "./types.ts";

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

  if (config.docs.enabled) {
    await writeDocs(icons, config);
  }

  logMemory();
}

main().finally(() => console.log("END"));
