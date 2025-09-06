import { readFile } from "node:fs/promises";
import { exportToDirectory, IconSet } from "@iconify/tools";
import { locate } from "@iconify/json";

const outputDir = "flags";

async function main(): Promise<void> {
  // Locate icons
  const filename = locate("flag");

  // Load icon set
  const collection = JSON.parse(await readFile(filename, "utf8"));

  collection.icons = Object.fromEntries(
    Object.entries(collection.icons)
      .filter(([key, _]) => key.endsWith("4x3"))
      .map(([key, data]) => [key.slice(0, -4), data]),
  );

  // Create IconSet instance
  const iconSet = new IconSet(collection);

  // Export all icons
  await exportToDirectory(iconSet, {
    target: outputDir,
    log: true,
  });
}

main();
