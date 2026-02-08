import type {
  ConfigOutput,
  FontCollectionConfig,
  IconMeta,
  PictogramMeta,
  PictogramsCollectionConfig,
} from "./types.js";
import { loadIconsMeta } from "./icons.js";
import { logMemory, writeJsonMap } from "./utils.js";
import { generateSVG } from "./fonts.js";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";
import { dirname, posix } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import Handlebars from "handlebars";
import { loadPictogramsMeta } from "./pictograms.js";

export async function processFontCollection(
  config: ConfigOutput,
  collection: FontCollectionConfig,
) {
  const icons: IconMeta[] = await loadIconsMeta(config, collection);
  console.log(`${icons.length} icons found`);
  if (icons.length === 0) {
    return icons;
  }
  logMemory("icons loaded");

  const svg = await generateSVG(icons, { fontName: collection.name });
  const ttf = svg2ttf(svg.toString());
  const woff2 = ttf2woff2(ttf.buffer);

  const paths = {
    collection: posix.join(config.output, collection.output),
    fonts: {
      svg: posix.join(
        config.output,
        collection.output,
        collection.fonts.output,
        `${collection.name}.svg`,
      ),
      ttf: posix.join(
        config.output,
        collection.output,
        collection.fonts.output,
        `${collection.name}.ttf`,
      ),
      woff2: posix.join(
        config.output,
        collection.output,
        collection.fonts.output,
        `${collection.name}.woff2`,
      ),
    },
    css: posix.join(config.output, collection.output, `${collection.name}.css`),
    json: posix.join(
      config.output,
      collection.output,
      `${collection.name}.json`,
    ),
  };

  await mkdir(dirname(paths.fonts.svg), { recursive: true });
  await writeFile(paths.fonts.svg, svg);
  await writeFile(paths.fonts.ttf, ttf.buffer);
  await writeFile(paths.fonts.woff2, woff2);

  await writeJsonMap(icons, paths.json);

  const templateStr: string = await readFile(collection.templates.css, "utf8");
  const template = Handlebars.compile(templateStr);

  const fonts = Object.entries(paths.fonts).map(([type, fontPath]) => ({
    type,
    path: posix.relative(dirname(paths.css), fontPath),
  }));

  const templated = template({
    fonts,
    icons,
    prefix: [config.prefix, collection.prefix].join("-"),
    name: config.name,
    timestamp: Date.now(),
    size: collection.size,
  });
  await mkdir(dirname(paths.css), { recursive: true });
  await writeFile(paths.css, templated);

  return icons;
}

export async function processPictogramCollection(
  config: ConfigOutput,
  collection: PictogramsCollectionConfig,
) {
  const pictograms: PictogramMeta[] = await loadPictogramsMeta(
    config,
    collection,
  );
  console.log(`${pictograms.length} pictograms found`);
  if (pictograms.length === 0) {
    return pictograms;
  }
  logMemory("pictograms loaded");

  const paths = {
    collection: posix.join(config.output, collection.output),
    css: posix.join(config.output, collection.output, `${collection.name}.css`),
    json: posix.join(
      config.output,
      collection.output,
      `${collection.name}.json`,
    ),
  };

  await writeJsonMap(pictograms, paths.json);

  const templateStr: string = await readFile(collection.templates.css, "utf8");
  const template = Handlebars.compile(templateStr);

  const templated = template({
    pictograms,
    prefix: [config.prefix, collection.prefix].join("-"),
    name: config.name,
    size: collection.size,
  });
  await mkdir(dirname(paths.css), { recursive: true });
  await writeFile(paths.css, templated);

  return pictograms;
}

// class Collection<T> {
//   private readonly appConfig: ConfigOutput;
//   readonly name: string;
//
//   constructor(appConfig: ConfigOutput, name: string) {
//     this.appConfig = appConfig;
//     this.name = name;
//   }
//
//   get config() {
//     return this.appConfig[this.name];
//   }
// }
