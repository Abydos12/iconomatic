#!/usr/bin/env node
import { logMemory } from "./utils.ts";
import { loadConfig } from "./config.ts";
import fs from "fs-extra";
import {
  processFontCollection,
  processPictogramCollection,
  writeMainCssFile,
} from "./collections.js";
import { writeDocs } from "./docs.js";

export type { ConfigInput } from "./types.ts";

async function main() {
  console.log("START");
  logMemory();
  const config = await loadConfig();

  if (config.clear) {
    await fs.emptyDir(config.output);
  }

  const results: Record<string, { name: string; className: string }[]> = {};

  for (const collection of config.collections) {
    switch (collection.type) {
      case "FONT": {
        results[collection.name] = await processFontCollection(
          config,
          collection,
        );
        break;
      }
      case "PICTOGRAMS": {
        results[collection.name] = await processPictogramCollection(
          config,
          collection,
        );
        break;
      }
    }
  }

  if (config.docs.enabled) {
    await writeDocs(config, results);
  }

  await writeMainCssFile(config);

  logMemory();
}

main().finally(() => console.log("END"));
