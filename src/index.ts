import { loadIconsMeta, OPTIONS } from "./utils";
import type { IconMeta } from "./types";
import { generateSVG } from "./fonts";
import svg2ttf from "svg2ttf";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "path";

async function main() {
  const icons: IconMeta[] = await loadIconsMeta(OPTIONS.input);
  console.log(`${icons.length} icons found`);

  try {
    console.group("Font[SVG]");
    console.log("Generating the font...");
    const fontSvg = await generateSVG(icons, OPTIONS);
    console.log("Font generated");

    if (OPTIONS.fonts.svg.enable) {
      await mkdir(OPTIONS.fonts.svg.output, { recursive: true });
      const path = join(OPTIONS.fonts.svg.output, OPTIONS.fonts.svg.filename);
      await writeFile(path, fontSvg);
      console.log(`Saved: ${path}`);
    }
    console.groupEnd();

    console.group("Font[TTF]");
    console.log("Generating the font...");
    const ttf = svg2ttf(fontSvg.toString());
    console.log("Font generated");

    if (OPTIONS.fonts.ttf.enable) {
      await mkdir(OPTIONS.fonts.svg.output, { recursive: true });
      const path = join(OPTIONS.fonts.ttf.output, OPTIONS.fonts.ttf.filename);
      await writeFile(
        join(OPTIONS.fonts.ttf.output, OPTIONS.fonts.ttf.filename),
        ttf.buffer,
      );
      console.log(`Saved: ${path}`);
    }
    console.groupEnd();

  } catch (e) {
    console.log(e);
  }
}

main().finally(() => console.log("END"));
