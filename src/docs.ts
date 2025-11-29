import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix, relative } from "node:path";
import Handlebars from "handlebars";
import type { ConfigOutput, DocTemplateContext } from "./types.ts";

export async function writeDocs(
  config: ConfigOutput,
  results: Record<string, { name: string; className: string }[]>,
) {
  const dir = posix.join(config.output, config.docs.output);
  const path = posix.join(dir, `${config.docs.filename}.html`);

  const docsTemplateStr: string = await readFile(config.docs.template, "utf8");
  const docsTemplate = Handlebars.compile<DocTemplateContext>(docsTemplateStr);

  const docsTemplated = docsTemplate({
    name: config.name,
    collections: config.collections.map((collection) => ({
      name: collection.name,
      type: collection.type,
      prefix: [config.prefix, collection.prefix].join("-"),
      icons: results[collection.name]!,
      css: relative(
        dir,
        posix.join(config.output, collection.output, `${collection.name}.css`),
      ),
    })),
  });
  await mkdir(dir);
  await writeFile(path, docsTemplated);
}
