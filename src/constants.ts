import { join } from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export const ROOT_DIRECTORY: string = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);

export const TEMPLATES_DIRECTORY: string = join(ROOT_DIRECTORY, "templates");
