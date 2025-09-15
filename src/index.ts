#!/usr/bin/env node
import { loadIconsMeta, logMemory } from "./utils.ts";
import type { IconMeta } from "./types.ts";
import { proccessFonts } from "./fonts.ts";
import { loadConfig } from "./config.ts";
import { join } from "path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import fs from "fs-extra";
import Handlebars from "handlebars";
import { dirname, posix, relative } from "node:path";
import { writeIconsFiles, writeIconsJsonMap } from "./icons.js";

export type { Config } from "./types.ts";

async function main() {
  console.log("START");
  logMemory();
  const config = await loadConfig();

  if (config.clear) {
    await fs.emptyDir(config.output);
  }

  const icons: IconMeta[] = await loadIconsMeta(config);
  console.log(`${icons.length} icons found`);
  if (icons.length === 0) {
    return;
  }
  logMemory("icons loaded");

  try {
    const fontResults = await proccessFonts(icons, config);

    if (config.icons.svg.enabled) {
      await writeIconsFiles(icons, config);
    }

    if (config.icons.assets.json.enabled) {
      await writeIconsJsonMap(icons, config);
    }

    const pathCSS = posix.join(
      config.output,
      config.icons.output,
      config.icons.assets.output,
      config.icons.assets.css.output,
      `${config.icons.assets.css.filename}.css`,
    );

    const fonts = Object.entries(fontResults).map(([type, path]) => ({
      type,
      path,
      relativePath: posix.relative(dirname(pathCSS), path),
    }));

    // CSS
    const templateStr: string = await readFile(
      config.icons.assets.css.template,
      "utf8",
    );
    const template = Handlebars.compile(templateStr);

    const templated = template({
      fonts,
      icons,
      prefix: config.prefix,
      name: config.name,
      timestamp: Date.now(),
    });
    await writeFile(pathCSS, templated);

    // DOCS
    if (config.docs.enabled) {
      await mkdir(join(config.output, config.docs.output));
      const pathDocs = posix.join(
        config.output,
        config.docs.output,
        `${config.docs.filename}.html`,
      );
      const relativeCssPathDocs = relative(dirname(pathDocs), pathCSS);
      const docsTemplateStr: string = await readFile(
        config.docs.template,
        "utf8",
      );
      const docsTemplate = Handlebars.compile(docsTemplateStr);

      const docsTemplated = docsTemplate({
        fonts,
        icons,
        prefix: config.prefix,
        name: config.name,
        cssPath: relativeCssPathDocs,
      });
      await writeFile(pathDocs, docsTemplated);
    }
  } catch (e) {
    console.log(e);
  }
  logMemory();
}

main().finally(() => console.log("END"));
