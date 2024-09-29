import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join as pathJoin } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { runBuild } from "../experimental-incremental-build.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("experimental hohoro", () => {
  // copy over files from the template dir to the src dir
  beforeEach(() => {
    const templateDir = pathJoin(
      __dirname,
      "..",
      "sample-workspace-dir",
      "template",
    );
    const srcDir = pathJoin(__dirname, "..", "sample-workspace-dir", "src");
    const files = fg.sync(pathJoin(templateDir, "**/*.{ts,tsx,js,json}"));

    for (const file of files) {
      const filePath = file.replace(templateDir, srcDir);
      copyFileSync(file, filePath);
    }
  });

  it("[experimental] It correctly builds the library", async () => {
    const logs = [];
    const errors = [];
    const logger = {
      log(message) {
        logs.push(message);
      },
      error(message) {
        errors.push(message);
      },
    };
    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    const distFiles = fg.sync(
      pathJoin(__dirname, "..", "sample-workspace-dir", "dist", "**/*"),
    );

    expect(distFiles.some((file) => file.includes("tsx-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("tsx-file.d.ts"))).toBe(true);
    expect(distFiles.some((file) => file.includes("js-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("json-file.json"))).toBe(
      true,
    );
    expect(errors.length).toBe(0);
    expect(logs[0]).toContain("compiled: 2 files, copied 1 file");
  });

  it("[experimental] It only builds changed files", async () => {
    const logs = [];
    const errors = [];
    const logger = {
      log(message) {
        logs.push(message);
      },
      error(message) {
        errors.push(message);
      },
    };

    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    // change a file
    const tsxFile = pathJoin(
      __dirname,
      "..",
      "sample-workspace-dir",
      "src",
      "tsx-file.tsx",
    );
    writeFileSync(tsxFile, `export const foo = 'bar';`);

    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    // most important assertion, only the tsx file should have been compiled!
    expect(logs[1]).toContain("compiled: 1 file");

    const distFiles = fg.sync(
      pathJoin(__dirname, "..", "sample-workspace-dir", "dist", "**/*"),
    );

    expect(distFiles.some((file) => file.includes("tsx-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("tsx-file.d.ts"))).toBe(true);
    expect(distFiles.some((file) => file.includes("js-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("json-file.json"))).toBe(
      true,
    );
    expect(errors.length).toBe(0);
  });

  // cleanup src and dist dirs after the tests run
  afterEach(() => {
    const srcDir = pathJoin(__dirname, "..", "sample-workspace-dir", "src");

    const files = fg.sync(pathJoin(srcDir, "**/*.{ts,tsx,js,json}"));
    for (const file of files) {
      rmSync(file, { recursive: true });
    }
    rmSync(pathJoin(__dirname, "..", "sample-workspace-dir", "dist"), {
      recursive: true,
    });
  });
});
