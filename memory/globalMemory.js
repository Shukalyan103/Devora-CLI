import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const MEMORY_DIR = path.join(
  os.homedir(),
  ".devora"
);

const MEMORY_FILE = path.join(
  MEMORY_DIR,
  "memory.json"
);

export async function loadGlobalMemory() {
  try {
    const data = await fs.readFile(
      MEMORY_FILE,
      "utf-8"
    );

    return JSON.parse(data);
  } catch {
    return {
      preferences: [],
      notes: []
    };
  }
}

export async function saveGlobalMemory(memory) {
  await fs.mkdir(MEMORY_DIR, {
    recursive: true
  });

  await fs.writeFile(
    MEMORY_FILE,
    JSON.stringify(memory, null, 2),
    "utf-8"
  );
}