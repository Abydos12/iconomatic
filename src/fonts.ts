import type { Config, FontType, IconMeta } from "./types.ts";
import { SVGIcons2SVGFontStream } from "svgicons2svgfont";
import { logMemory, printProgress, streamToBuffer } from "./utils.ts";
import { createReadStream } from "node:fs";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";
import type Stream from "node:stream";
import { posix } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

export async function proccessFonts(
  icons: IconMeta[],
  config: Config,
): Promise<Partial<Record<FontType, string>>> {
  const results: Partial<Record<FontType, string>> = {};

  console.group("Font[SVG]");
  logMemory();
  console.log("Generating the font...");
  const svg = await generateSVG(icons, config);
  console.log("Font generated");
  if (config.fonts.svg.enabled) {
    results.svg = await writeFontFile(svg, "svg", config);
  }
  logMemory();
  console.groupEnd();

  console.group("Font[TTF]");
  logMemory();
  console.log("Generating the font...");
  const ttf = svg2ttf(svg.toString());
  console.log("Font generated");
  if (config.fonts.ttf.enabled) {
    results.ttf = await writeFontFile(ttf.buffer, "ttf", config);
  }
  logMemory();
  console.groupEnd();

  console.group("Font[WOFF2]");
  logMemory();
  console.log("Generating the font...");
  if (config.fonts.woff2.enabled) {
    const woff2 = ttf2woff2(ttf.buffer);
    results.woff2 = await writeFontFile(woff2, "woff2", config);
  }
  console.log("Font generated");
  logMemory();
  console.groupEnd();

  return results;
}

export async function generateSVG(
  icons: IconMeta[],
  config: Config,
): Promise<Buffer> {
  const fontStream: SVGIcons2SVGFontStream = new SVGIcons2SVGFontStream(
    config.svgIcon2svgFontOptions,
  );

  for (const [index, icon] of icons.entries()) {
    const glyph = createReadStream(icon.path);

    // @ts-ignore
    glyph.metadata = {
      name: icon.name,
      unicode: [icon.char],
    };

    // pipeline doesn't work sadly, because of the metadata being striped
    // await pipeline(glyph, fontStream);
    if (!fontStream.write(glyph)) {
      // Wait for backpressure
      await new Promise<void>((resolve) => fontStream.once("drain", resolve));
    }
    printProgress(index + 1, icons.length);
  }

  fontStream.end();

  return await streamToBuffer(fontStream);
}

export async function writeFontFile(
  font:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  fontType: FontType,
  config: Config,
): Promise<string> {
  const fontConfig = config.fonts[fontType];

  const dir: string = posix.join(
    config.output,
    config.fonts.output,
    fontConfig.output,
  );
  const filename: string = `${fontConfig.filename}.${fontType}`;

  await mkdir(dir, { recursive: true });
  const path: string = posix.join(dir, filename);
  await writeFile(posix.join(dir, filename), font);
  return path;
}
