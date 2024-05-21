import fg from "fast-glob";
import assert from "node:assert";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join as pathJoin } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { runBuild } from "../incremental-build.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// copy over files from the template dir to the src dir
before(() => {
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

test("It correctly builds the library", async () => {
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

  assert.ok(
    distFiles.some((file) => file.includes("tsx-file.js")),
    "Couldn't find tsx-file.js!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("tsx-file.d.ts")),
    "Couldn't find tsx-file.d.ts!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("js-file.js")),
    "Couldn't find js-file.js!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("json-file.json")),
    "Couldn't find json-file.json!",
  );
  assert.equal(errors.length, 0, "There were errors logged during build!");
  assert.ok(
    logs[0].includes(`compiled: 2 files, copied 1 file`),
    `Log message doesn't match!\n Received: ${logs[0]}`,
  );
});

test("It only builds changed files", async () => {
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
  assert.ok(
    logs[0].includes(`compiled: 1 file`),
    `Log message doesn't match!\n Received: ${logs[0]}`,
  );

  const distFiles = fg.sync(
    pathJoin(__dirname, "..", "sample-workspace-dir", "dist", "**/*"),
  );

  assert.ok(
    distFiles.some((file) => file.includes("tsx-file.js")),
    "Couldn't find tsx-file.js!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("tsx-file.d.ts")),
    "Couldn't find tsx-file.d.ts!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("js-file.js")),
    "Couldn't find js-file.js!",
  );
  assert.ok(
    distFiles.some((file) => file.includes("json-file.json")),
    "Couldn't find json-file.json!",
  );
  assert.equal(errors.length, 0, "There were errors logged during build!");
});

// cleanup src and dist dirs after the tests run
after(() => {
  const srcDir = pathJoin(__dirname, "..", "sample-workspace-dir", "src");

  const files = fg.sync(pathJoin(srcDir, "**/*.{ts,tsx,js,json}"));
  for (const file of files) {
    rmSync(file, { recursive: true });
  }
  rmSync(pathJoin(__dirname, "..", "sample-workspace-dir", "dist"), {
    recursive: true,
  });
});
