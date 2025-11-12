import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join as pathJoin } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { runBuild } from "../legacy-incremental-build.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("[legacy] hohoro", () => {
  // copy over files from the template dir to the src dir
  beforeEach(() => {
    const templateDir = pathJoin(
      __dirname,
      "..",
      "sample-workspace-dir",
      "template",
    );
    const srcDir = pathJoin(__dirname, "..", "sample-workspace-dir", "src");
    const files = fg.sync(pathJoin(templateDir, "**/*"), { onlyFiles: true });

    for (const file of files) {
      const filePath = file.replace(templateDir, srcDir);
      copyFileSync(file, filePath);
    }
  });

  it("[legacy] correctly builds the library", async () => {
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
    expect(distFiles.some((file) => file.includes("styles.css"))).toBe(true);
    expect(distFiles.some((file) => file.includes("README.md"))).toBe(true);
    expect(distFiles.some((file) => file.includes("data.txt"))).toBe(true);
    expect(errors.length).toBe(0);
    expect(logs[0]).toContain("compiled: 2 files, copied 4 files");
  });

  it("[legacy] only builds changed files", async () => {
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
    writeFileSync(tsxFile, `export const foo = 'baz';`);

    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    // logs[0] is the initial build
    // logs[1] is the initial type def build
    // logs[2] is the incremental rebuild
    // most important assertion, only the tsx file should have been compiled!
    expect(logs[2]).toContain("compiled: 1 file");

    const distFiles = fg.sync(
      pathJoin(__dirname, "..", "sample-workspace-dir", "dist", "**/*"),
    );

    expect(distFiles.some((file) => file.includes("tsx-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("tsx-file.d.ts"))).toBe(true);
    expect(distFiles.some((file) => file.includes("js-file.js"))).toBe(true);
    expect(distFiles.some((file) => file.includes("json-file.json"))).toBe(
      true,
    );
    expect(distFiles.some((file) => file.includes("styles.css"))).toBe(true);
    expect(distFiles.some((file) => file.includes("README.md"))).toBe(true);
    expect(distFiles.some((file) => file.includes("data.txt"))).toBe(true);
    expect(errors.length).toBe(0);
  });

  it("[legacy] copies and tracks non-JS/TS asset files in cache", async () => {
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

    // Initial build
    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    // Verify asset files are copied
    const distFiles = fg.sync(
      pathJoin(__dirname, "..", "sample-workspace-dir", "dist", "**/*"),
    );
    expect(distFiles.some((file) => file.includes("styles.css"))).toBe(true);
    expect(distFiles.some((file) => file.includes("README.md"))).toBe(true);
    expect(distFiles.some((file) => file.includes("data.txt"))).toBe(true);

    // Modify an asset file
    const mdFile = pathJoin(
      __dirname,
      "..",
      "sample-workspace-dir",
      "src",
      "README.md",
    );
    writeFileSync(
      mdFile,
      `# Updated\n\nThis file has been updated.`,
    );

    // Run build again
    await runBuild({
      rootDirectory: pathJoin(__dirname, "..", "sample-workspace-dir"),
      logger,
    });

    // logs[0] is the initial compile
    // logs[1] is the initial type def build
    // logs[2] is the incremental rebuild
    // Should only rebuild the changed markdown file
    expect(logs[2]).toContain("copied 1 file");
    expect(errors.length).toBe(0);
  });

  // cleanup src and dist dirs after the tests run
  afterEach(() => {
    const srcDir = pathJoin(__dirname, "..", "sample-workspace-dir", "src");

    const files = fg.sync(pathJoin(srcDir, "**/*"), { onlyFiles: true });
    for (const file of files) {
      rmSync(file, { recursive: true });
    }
    rmSync(pathJoin(__dirname, "..", "sample-workspace-dir", "dist"), {
      recursive: true,
    });
  });
});
