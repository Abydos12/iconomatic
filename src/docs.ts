import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix, relative } from "node:path";
import Handlebars from "handlebars";
import type {
  Config,
  DocTemplateContext,
  IconMeta,
  PictogramMeta,
} from "./types.ts";
import { assetPath } from "./utils.js";

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

  const relativeIconsCssPath = relative(dir, assetPath(config, "icons", "css"));
  const relativePictogramsCssPath = relative(
    dir,
    assetPath(config, "pictograms", "css"),
  );

  const docsTemplateStr: string = await readFile(config.docs.template, "utf8");
  const docsTemplate = Handlebars.compile<DocTemplateContext>(docsTemplateStr);

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
