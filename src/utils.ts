import { dirname } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import consola from "consola";

export function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
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

export function logProgress(current: number, total: number) {
  const width = 40;
  const ratio = current / total;
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const percent = Math.round(ratio * 100);

  process.stdout.write(
    `[${"=".repeat(filled)}${" ".repeat(empty)}] ${percent}% (${current}/${total})\r`,
  );

  if (current === total) {
    console.log(""); // move to next line when done
  }
}

export function logMemory() {
  const mem = process.memoryUsage();
  const rss = (mem.rss / 1024 / 1024).toFixed(2);
  const heapUsed = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const heapTotal = (mem.heapTotal / 1024 / 1024).toFixed(2);
  const external = (mem.external / 1024 / 1024).toFixed(2);

  consola.debug(
    `Memory usage — RSS: ${rss}MB, Heap: ${heapUsed}/${heapTotal}MB, External: ${external}MB`,
  );
}

export async function writeJsonMap<T>(data: T[], path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data));
}
