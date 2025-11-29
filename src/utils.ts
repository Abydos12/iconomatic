import { dirname } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

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

export function printProgress(current: number, total: number) {
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

export function logMemory(label = "memory") {
  const used = process.memoryUsage();
  console.log(
    `[${label}] RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB, Heap: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
  );
}

export async function writeJsonMap<T>(data: T[], path: string): Promise<void> {
  console.group("JSON");
  logMemory();

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data));
  console.log(`Saved: ${path}`);
  logMemory();
  console.groupEnd();
}
