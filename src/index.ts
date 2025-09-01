import { loadIconsMeta, logMemory, saveFontIfNeeded } from "./utils.ts";
import type { IconMeta } from "./types.ts";
import { generateSVG } from "./fonts.ts";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";
import { loadConfig } from "./config.ts";
import { join } from "path";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import fs from "fs-extra";
import Handlebars from "handlebars";
import { dirname, posix, relative } from "node:path";

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
    console.group("Font[SVG]");
    logMemory();
    console.log("Generating the font...");
    const svg = await generateSVG(icons, config);
    console.log("Font generated");
    await saveFontIfNeeded(svg, "svg", config);
    logMemory();
    console.groupEnd();

    console.group("Font[TTF]");
    logMemory();
    console.log("Generating the font...");
    const ttf = svg2ttf(svg.toString());
    console.log("Font generated");
    await saveFontIfNeeded(ttf.buffer, "ttf", config);
    logMemory();
    console.groupEnd();

    console.group("Font[WOFF2]");
    logMemory();
    console.log("Generating the font...");
    const woff2 = ttf2woff2(ttf.buffer);
    console.log("Font generated");
    await saveFontIfNeeded(woff2, "woff2", config);
    logMemory();
    console.groupEnd();

    if (config.icons.enabled) {
      console.group("ICONS");
      logMemory();
      await mkdir(join(config.output, config.icons.output), {
        recursive: true,
      });
      console.time("Generating icons");
      await Promise.all(
        icons.map((icon) =>
          copyFile(
            icon.path,
            join(config.output, config.icons.output, `${icon.name}.svg`),
          ),
        ),
      );
      console.timeEnd("Generating icons");
      logMemory();
      console.groupEnd();
    }

    console.group("JSON");
    logMemory();
    const output = join(
      config.output,
      config.assets.output,
      config.assets.json.output,
    );
    const filename = `${config.assets.json.filename}.json`;

    await mkdir(output, { recursive: true });
    const path = join(output, filename);
    await writeFile(join(output, filename), JSON.stringify(icons));
    console.log(`Saved: ${path}`);
    logMemory();
    console.groupEnd();

    const pathWoff2 = posix.join(
      config.output,
      config.fonts.output,
      config.fonts.woff2.output,
      `${config.fonts.woff2.filename}.woff2`,
    );
    const pathCSS = posix.join(
      config.output,
      config.assets.output,
      config.assets.css.output,
      `${config.assets.css.filename}.css`,
    );
    const relativePath = posix.relative(dirname(pathCSS), pathWoff2);

    const fonts = [
      {
        path: posix.join(
          config.output,
          config.fonts.output,
          config.fonts.woff2.output,
          `${config.fonts.woff2.filename}.woff2`,
        ),
        relativePath,
        type: "woff2",
        timestamp: Date.now(),
      },
    ];

    // CSS
    const templateStr: string = await readFile(
      config.assets.css.template,
      "utf8",
    );
    const template = Handlebars.compile(templateStr);

    const templated = template({
      fonts,
      icons,
      prefix: config.prefix,
      name: config.name,
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
