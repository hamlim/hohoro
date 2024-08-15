import { exec } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, readFileSync, rmSync, writeFileSync } from "node:fs";
import path, { join as pathJoin, resolve } from "node:path";
import { promisify } from "node:util";
import createDebug from "debug";
import fg from "fast-glob";

const execAsync = promisify(exec);

const debug = createDebug("hohoro");

function compile({ rootDirectory, files, logger }) {
  const swcConfigPath = pathJoin(rootDirectory, ".swcrc");
  const distPath = pathJoin(rootDirectory, "dist");
  const command = [
    "swc",
    files.join(" "),
    "-d",
    distPath,
    // copy over files that are not compiled
    "--copy-files",
    `--config-file ${swcConfigPath}`,
    // Remove the leading directories from the compiled files
    "--strip-leading-paths",
  ].join(" ");
  debug(`[compile] ${command}`);
  return execAsync(command, { cwd: rootDirectory }).then(
    ({ stdout, stderr }) => {
      if (stderr) {
        logger.error(stderr);
      }
      if (stdout) {
        logger.log(stdout);
      }
    },
  );
}

// Hack incoming!
// @SEE: https://stackoverflow.com/a/44748041
// TL;DR: Create a temp tsconfig file with the files to compile the declarations for
// and run tsc with only those files
// We can't mix the `tsc` cli with both `--project` and a list of files to compile because TSC
// ignores the tsconfig file when passing file paths in!
async function compileDeclarations({ rootDirectory, files, logger }) {
  const tempTSConfigPath = pathJoin(rootDirectory, "temp.tsconfig.json");
  const tempTSconfig = {
    extends: "./tsconfig.json",
    include: files,
    compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: "dist",
    },
    exclude: ["**/__tests__/**"],
  };
  debug(
    `[compileDeclarations] Writing temp tsconfig file: `,
    JSON.stringify(tempTSconfig, null, 2),
  );
  writeFileSync(tempTSConfigPath, JSON.stringify(tempTSconfig, null, 2));
  const command = `tsc --project temp.tsconfig.json`;
  debug(`[compileDeclarations] ${command}`);
  return execAsync(command, { cwd: rootDirectory }).then(
    // For both success and failures we want to cleanup the temp file!
    ({ stdout, stderr }) => {
      if (stderr) {
        logger.error(stderr);
      }
      if (stdout) {
        logger.log(stdout);
      }
      rmSync(tempTSConfigPath);
    },
    (err) => {
      rmSync(tempTSConfigPath);
      if (typeof err.stdout === "string") {
        throw new Error(err.stdout);
      }
      if (typeof err.stderr === "string") {
        throw new Error(err.stderr);
      }
      throw new Error(`Unknown raw error: \n\n${JSON.stringify(err, null, 2)}`);
    },
  );
}

function loadCacheFile({ cacheFilePath }) {
  try {
    return JSON.parse(readFileSync(cacheFilePath).toString());
  } catch (e) {
    return [];
  }
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("md5");
    const stream = createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}

export async function runBuild(
  { rootDirectory, logger } = { rootDirectory: process.cwd(), logger: console },
) {
  const start = Date.now();
  debug("[runBuild] Starting...");
  const cacheFilePath = pathJoin(rootDirectory, "dist", "build-cache.json");
  const cacheFile = loadCacheFile({ cacheFilePath });
  debug(`Cache file: `, JSON.stringify(cacheFile, null, 2));

  // Need to convert to a posix path for use with `fast-glob` on Windows.
  // @see https://github.com/mrmlnc/fast-glob/issues/237#issuecomment-546057189
  // @see https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#how-to-write-patterns-on-windows
  const files = fg.sync(
    path.posix.join(
      fg.convertPathToPattern(rootDirectory),
      "src/**/*.{ts,tsx,js,json}",
    ),
    {
      ignore: ["**/__tests__/**"],
    },
  );

  const relativeFiles = files.map((file) => file.split(rootDirectory)[1]);

  const filesHashed = (await Promise.all(files.map(hashFile))).map(
    (hashed, idx) => [relativeFiles[idx], hashed],
  );

  const changedFiles = [];

  for (const [computedFile, computedHash] of filesHashed) {
    if (
      cacheFile.find(([filePath]) => filePath === computedFile)?.[1] !==
      computedHash
    ) {
      changedFiles.push(computedFile);
    }
  }

  if (!changedFiles.length) {
    logger.log(`No files changed!`);
    debug(`Early exit, ran in ${Date.now() - start}ms`);
    process.exit(0);
  }

  debug(`[runBuild] Changed files: `, JSON.stringify(changedFiles, null, 2));

  const absoluteChangedFiles = changedFiles.map(
    (changedFile) => rootDirectory + changedFile,
  );

  const [compileResult, declarationsResult] = await Promise.allSettled([
    compile({ rootDirectory, files: absoluteChangedFiles, logger }),
    compileDeclarations({ rootDirectory, files: absoluteChangedFiles, logger }),
  ]);
  if (
    compileResult.status === "rejected" ||
    declarationsResult.status === "rejected"
  ) {
    if (compileResult.status === "rejected") {
      logger.error(`Failed to compile: ${compileResult.reason}`);
    }
    if (declarationsResult.status === "rejected") {
      logger.error(
        `Failed to compile declarations: ${declarationsResult.reason}`,
      );
    }
    debug(`Ran in ${Date.now() - start}ms`);
    process.exit(1);
  }
  try {
    writeFileSync(cacheFilePath, JSON.stringify(filesHashed));
  } catch (error) {
    logger.error(`Failed to write cache file`);
  }
  debug(`Ran in ${Date.now() - start}ms`);
}
