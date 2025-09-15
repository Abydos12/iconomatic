import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix, relative } from "node:path";
import Handlebars from "handlebars";
import type { Config, IconMeta } from "./types.ts";

export async function writeDocs(icons: IconMeta[], config: Config) {
  const dir = posix.join(config.output, config.docs.output);
  const path = posix.join(dir, `${config.docs.filename}.html`);

  const cssPath = posix.join(
    config.output,
    config.icons.output,
    config.icons.assets.output,
    config.icons.assets.css.output,
    `${config.icons.assets.css.filename}.css`,
  );

  const relativeCssPath = relative(dir, cssPath);

  const docsTemplateStr: string = await readFile(config.docs.template, "utf8");
  const docsTemplate = Handlebars.compile(docsTemplateStr);

  const docsTemplated = docsTemplate({
    icons,
    prefix: config.prefix,
    name: config.name,
    cssPath: relativeCssPath,
  });
  await mkdir(dir);
  await writeFile(path, docsTemplated);
}
