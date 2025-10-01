import type { Config, PictogramMeta } from "./types.js";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, posix } from "node:path";
import { join } from "path";
import Handlebars from "handlebars";

export async function loadPictogramsMeta({
  pictograms: { input },
}: Config): Promise<PictogramMeta[]> {
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

export async function writePictogramsCss(
  pictograms: PictogramMeta[],
  config: Config,
): Promise<string> {
  const templateStr: string = await readFile(
    config.pictograms.assets.css.template,
    "utf8",
  );
  const template = Handlebars.compile(templateStr);

  const dir = posix.join(
    config.output,
    config.pictograms.output,
    config.pictograms.assets.output,
    config.pictograms.assets.css.output,
  );
  const path = posix.join(dir, `${config.pictograms.assets.css.filename}.css`);

  const templated = template({
    pictograms,
    prefix: config.pictograms.prefix,
    name: config.name,
  });
  await mkdir(dir, { recursive: true });
  await writeFile(path, templated);
  return path;
}
