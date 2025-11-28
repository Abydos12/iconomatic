#!/usr/bin/env node
import { logMemory } from "./utils.ts";
import { loadConfig } from "./config.ts";
import fs from "fs-extra";
import { processFontCollection } from "./collections.js";

export type { ConfigInput } from "./types.ts";

async function main() {
  console.log("START");
  logMemory();
  const config = await loadConfig();

  if (config.clear) {
    await fs.emptyDir(config.output);
  }

  const collectionResults = [];

  for (const collection of config.collections) {
    switch (collection.type) {
      case "FONT": {
        await processFontCollection(config, collection);
        break;
      }
      case "PICTOGRAMS": {
        break;
      }
    }
  }

  if (config.docs.enabled) {
    // await writeDocs({ icons, pictograms, config });
  }

  logMemory();
}

main().finally(() => console.log("END"));
