import { loadIconsMeta, saveFont } from "./utils";
import type { IconMeta } from "./types";
import { generateSVG } from "./fonts";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";
import { loadConfig } from "./config";

async function main() {
  const config = await loadConfig();

  const icons: IconMeta[] = await loadIconsMeta(config);
  console.log(`${icons.length} icons found`);
  if (icons.length === 0) {
    return;
  }

  try {
    console.group("Font[SVG]");
    console.log("Generating the font...");
    const svg = await generateSVG(icons, config);
    console.log("Font generated");

    if (config.fonts.svg.enable) {
      await saveFont(svg, config.fonts.svg);
    }
    console.groupEnd();

    console.group("Font[TTF]");
    console.log("Generating the font...");
    const ttf = svg2ttf(svg.toString());
    console.log("Font generated");

    if (config.fonts.ttf.enable) {
      await saveFont(ttf.buffer, config.fonts.ttf);
    }
    console.groupEnd();

    console.group("Font[WOFF2]");
    console.log("Generating the font...");
    const woff2 = ttf2woff2(ttf.buffer);
    console.log("Font generated");

    if (config.fonts.woff2.enable) {
      await saveFont(woff2, config.fonts.woff2);
    }

    console.groupEnd();
  } catch (e) {
    console.log(e);
  }
}

main().finally(() => console.log("END"));
