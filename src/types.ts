import * as v from "valibot";
import { join, resolve } from "path";
import { TEMPLATES_DIRECTORY } from "./constants.js";

export interface IconMeta {
  name: string;
  className: string;
  path: string;
  codepoint: number;
  codepointHex: string;
  char: string;
}

export interface PictogramMeta {
  name: string;
  className: string;
  path: string;
  cssUrl: string;
}

const FontsConfigSchema = v.object({
  output: v.exactOptional(v.string(), "fonts"),
  svg: v.exactOptional(v.boolean(), true),
  ttf: v.exactOptional(v.boolean(), true),
  woff2: v.exactOptional(v.boolean(), true),
});

const PathSchema = v.pipe(v.string(), v.transform(resolve));

const UnicodeSchema = v.object({
  start: v.exactOptional(v.pipe(v.number(), v.integer()), 0xf0000),
  codepoints: v.exactOptional(
    v.record(v.string(), v.pipe(v.number(), v.integer())),
    {},
  ),
});

const BaseCollectionConfigSchema = v.object({
  name: v.string(),
  input: PathSchema,
  output: v.string(),
  prefix: v.string(),
});

const FontCollectionConfigSchema = v.object({
  type: v.literal("FONT"),
  ...BaseCollectionConfigSchema.entries,
  size: v.optional(v.string(), "1em"),
  fonts: v.exactOptional(FontsConfigSchema, {}),
  unicode: v.exactOptional(UnicodeSchema, {}),
  templates: v.exactOptional(
    v.object({
      css: v.exactOptional(
        PathSchema,
        join(TEMPLATES_DIRECTORY, "icons.css.hbs"),
      ),
    }),
    {},
  ),
});

export type FontCollectionConfig = v.InferOutput<
  typeof FontCollectionConfigSchema
>;

const PictogramsCollectionConfigSchema = v.object({
  type: v.literal("PICTOGRAMS"),
  ...BaseCollectionConfigSchema.entries,
  size: v.optional(v.string(), "2em"),
  templates: v.exactOptional(
    v.object({
      css: v.exactOptional(
        PathSchema,
        join(TEMPLATES_DIRECTORY, "pictograms.css.hbs"),
      ),
    }),
    {},
  ),
});

export type PictogramsCollectionConfig = v.InferOutput<
  typeof PictogramsCollectionConfigSchema
>;

const CollectionConfigSchema = v.variant("type", [
  FontCollectionConfigSchema,
  PictogramsCollectionConfigSchema,
]);

export type CollectionConfig = v.InferOutput<typeof CollectionConfigSchema>;

const DocsConfigSchema = v.object({
  enabled: v.exactOptional(v.boolean(), true),
  filename: v.exactOptional(v.string(), "index"),
  output: v.exactOptional(v.string(), "docs"),
  template: v.exactOptional(
    PathSchema,
    join(TEMPLATES_DIRECTORY, "docs.html.hbs"),
  ),
});

export const ConfigSchema = v.object({
  name: v.string(),
  output: v.exactOptional(v.string(), "dist"),
  clear: v.exactOptional(v.boolean(), true),
  prefix: v.string(),
  collections: v.array(CollectionConfigSchema),
  docs: v.exactOptional(DocsConfigSchema, {}),
});

export type ConfigInput = v.InferInput<typeof ConfigSchema>;
export type ConfigOutput = v.InferOutput<typeof ConfigSchema>;

export interface DocTemplateContext {
  name: string;
  collections: {
    name: string;
    type: CollectionConfig["type"];
    prefix: string;
    icons: { name: string; className: string }[];
    css: string;
  }[];
}
