import { readFile } from "node:fs/promises";
import { exportToDirectory, IconSet } from "@iconify/tools";
import { locate } from "@iconify/json";

const outputDir = "icons";

async function main(): Promise<void> {
  // Locate icons
  const filename = locate("mdi");

  // Load icon set
  const data = JSON.parse(await readFile(filename, "utf8"));

  // Create IconSet instance
  const iconSet = new IconSet(data);

  // Export all icons
  await exportToDirectory(iconSet, {
    target: outputDir,
    log: true,
  });
}

main();
