import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix } from "node:path";
import Handlebars from "handlebars";
import type { ConfigOutput, DocTemplateContext } from "./types.ts";
import slug from "slug";

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
    css: posix.relative(
      dir,
      posix.join(config.output, `${slug(config.name)}.css`),
    ),
    collections: config.collections.map((collection) => ({
      name: collection.name,
      type: collection.type,
      size: collection.size,
      prefix: [config.prefix, collection.prefix].join("-"),
      icons: results[collection.name]!,
    })),
  });
  await mkdir(dir);
  await writeFile(path, docsTemplated);
}
