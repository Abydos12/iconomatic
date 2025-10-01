import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix, relative } from "node:path";
import Handlebars from "handlebars";
import type { Config, IconMeta, PictogramMeta } from "./types.ts";

export async function writeDocs({
  icons,
  pictograms,
  config,
}: {
  icons: IconMeta[];
  pictograms: PictogramMeta[];
  config: Config;
}) {
  const dir = posix.join(config.output, config.docs.output);
  const path = posix.join(dir, `${config.docs.filename}.html`);

  const iconsCssPath = posix.join(
    config.output,
    config.icons.output,
    config.icons.assets.output,
    config.icons.assets.css.output,
    `${config.icons.assets.css.filename}.css`,
  );

  const relativeIconsCssPath = relative(dir, iconsCssPath);

  const pictogramsCssPath = posix.join(
    config.output,
    config.pictograms.output,
    config.pictograms.assets.output,
    config.pictograms.assets.css.output,
    `${config.pictograms.assets.css.filename}.css`,
  );

  const relativePictogramsCssPath = relative(dir, pictogramsCssPath);

  const docsTemplateStr: string = await readFile(config.docs.template, "utf8");
  const docsTemplate = Handlebars.compile(docsTemplateStr);

  const docsTemplated = docsTemplate({
    name: config.name,
    icons,
    iconsPrefix: config.icons.prefix,
    iconsCssPath: relativeIconsCssPath,
    pictograms,
    pictogramsEnabled: config.pictograms.enabled,
    pictogramsPrefix: config.pictograms.prefix,
    pictogramsCssPath: relativePictogramsCssPath,
  });
  await mkdir(dir);
  await writeFile(path, docsTemplated);
}
