import type { PictogramMeta, PictogramsCollectionConfig } from "./types.js";
import { readdir, readFile } from "node:fs/promises";
import { extname } from "node:path";
import { join } from "path";

export async function loadPictogramsMeta({
  input,
}: PictogramsCollectionConfig): Promise<PictogramMeta[]> {
  const entries = await readdir(input, {
    withFileTypes: true,
  });

  const metas: PictogramMeta[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || extname(entry.name) !== ".svg") {
      continue;
    }
    const name: string = entry.name.slice(0, -4);
    const path: string = join(input, entry.name);
    const base64: string = (await readFile(path)).toString("base64");
    const cssUrl: string = `data:image/svg+xml;base64,${base64}`;

    metas.push({ name, path, cssUrl });
  }

  return metas;
}
