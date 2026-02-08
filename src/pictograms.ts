import type {
  ConfigOutput,
  PictogramMeta,
  PictogramsCollectionConfig,
} from "./types.js";
import { readdir, readFile } from "node:fs/promises";
import { extname } from "node:path";
import { join } from "path";
import slug from "slug";

export async function loadPictogramsMeta(
  config: ConfigOutput,
  { input, prefix }: PictogramsCollectionConfig,
): Promise<PictogramMeta[]> {
  const entries = await readdir(input, {
    withFileTypes: true,
  });

  const metas: PictogramMeta[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || extname(entry.name) !== ".svg") {
      continue;
    }
    const name: string = slug(entry.name.slice(0, -4));
    const className: string = [config.prefix, prefix, name].join("-");
    const path: string = join(input, entry.name);
    const base64: string = (await readFile(path)).toString("base64");
    const cssUrl: string = `data:image/svg+xml;base64,${base64}`;

    metas.push({ name, className, path, cssUrl });
  }

  return metas;
}
