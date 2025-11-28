import type { IconMeta } from "./types.ts";
import {
  SVGIcons2SVGFontStream,
  type SVGIcons2SVGFontStreamOptions,
} from "svgicons2svgfont";
import { printProgress, streamToBuffer } from "./utils.ts";
import { createReadStream } from "node:fs";
import { svgIcon2svgFontOptions } from "./config.js";

export async function generateSVG(
  icons: IconMeta[],
  options: Partial<SVGIcons2SVGFontStreamOptions>,
): Promise<Buffer> {
  const fontStream: SVGIcons2SVGFontStream = new SVGIcons2SVGFontStream({
    ...svgIcon2svgFontOptions,
    ...options,
  });

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
