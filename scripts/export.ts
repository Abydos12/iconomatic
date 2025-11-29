import { exportToDirectory, IconSet } from "@iconify/tools";
import { lookupCollection } from "@iconify/json";
import type { IconifyJSON } from "@iconify/types";
import { join } from "path";

async function main(): Promise<void> {
  const collections = [
    new IconSet(await collectFluentColor()),
    new IconSet(await collectMaterialSymbols()),
  ];

  for (const collection of collections) {
    await exportToDirectory(collection, {
      target: join("data", collection.info.name),
      log: true,
    });
  }
}

async function collectFluentColor(): Promise<IconifyJSON> {
  const collection = await lookupCollection("fluent-color");
  collection.icons = Object.fromEntries(
    Object.entries(collection.icons)
      .filter(([key, _]) => key.endsWith("-16"))
      .map(([key, data]) => [key.slice(0, -"-16".length), data]),
  );
  return collection;
}
async function collectMaterialSymbols(): Promise<IconifyJSON> {
  const collection = await lookupCollection("material-symbols");
  collection.icons = Object.fromEntries(
    Object.entries(collection.icons)
      .filter(
        ([key, _]) =>
          key.endsWith("-rounded") && !key.endsWith("-outline-rounded"),
      )
      .map(([key, data]) => [key.slice(0, -"-rounded".length), data]),
  );
  delete collection.aliases;
  return collection;
}

await main();
