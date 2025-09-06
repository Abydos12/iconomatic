import type { Config, IconMeta } from "./types.ts";
import { SVGIcons2SVGFontStream } from "svgicons2svgfont";
import { printProgress } from "./utils.ts";
import { createReadStream } from "node:fs";

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

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    });
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
