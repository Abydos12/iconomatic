import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix } from "node:path";
import Handlebars from "handlebars";
import type {
  ConfigOutput,
  DocTemplateContext,
  IconMeta,
  PictogramMeta,
} from "./types.ts";

export async function writeDocs({
  config,
}: {
  config: ConfigOutput;
  icons: IconMeta[];
  pictograms: PictogramMeta[];
}) {
  const dir = posix.join(config.output, config.docs.output);
  const path = posix.join(dir, `${config.docs.filename}.html`);

  const docsTemplateStr: string = await readFile(config.docs.template, "utf8");
  const docsTemplate = Handlebars.compile<DocTemplateContext>(docsTemplateStr);

  const docsTemplated = docsTemplate({
    name: config.name,
  });
  await mkdir(dir);
  await writeFile(path, docsTemplated);
}
