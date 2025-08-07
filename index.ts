import { createReadStream, createWriteStream } from "node:fs";

import type { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";
import { SVGIcons2SVGFontStream } from "svgicons2svgfont";

const options: Partial<SVGIcons2SVGFontStreamOptions> = {
  fontName: "test-font",
  normalize: true,
};

async function main() {
  try {
    const fontSvg = await generateSVG();
    console.log(fontSvg);
  } catch (e) {
    console.log(e);
  }
  console.log("END");
}

async function generateSVG(): Promise<Buffer> {
  const fontStream: SVGIcons2SVGFontStream = new SVGIcons2SVGFontStream(
    options,
  );

  fontStream.pipe(createWriteStream("font-svg2.svg"));

  let codepoint = 0xf0000;

  for (const i of ["1", "2", "3"]) {
    const name = `icon-${i}`;
    const glyph = createReadStream(`icons/${name}.svg`);

    // @ts-ignore
    glyph.metadata = {
      name,
      unicode: [String.fromCodePoint(codepoint++)],
    };

    fontStream.write(glyph);
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

main().finally(() => console.log("coucou"));
