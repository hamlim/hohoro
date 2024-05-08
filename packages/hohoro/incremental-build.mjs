import createDebug from "debug";
import fg from "fast-glob";
import { exec } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, readFileSync, rmSync, writeFileSync } from "node:fs";
import path, { join as pathJoin } from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const debug = createDebug("hohoro");

function compile({ rootDirectory, files, logger }) {
  const swcConfigPath = pathJoin(rootDirectory, ".swcrc");
  const distPath = pathJoin(rootDirectory, "dist");
  const command = `swc ${
    files.join(
      " ",
    )
  } -d ${distPath} --copy-files --config-file ${swcConfigPath}`;
  debug(`[compile] ${command}`);
  return execAsync(command).then(({ stdout, stderr }) => {
    if (stderr) {
      logger.error(stderr);
    }
    logger.log(stdout);
  });
}

// Hack incoming!
// @SEE: https://stackoverflow.com/a/44748041
// TL;DR: Create a temp tsconfig file with the files to compile the declarations for
// and run tsc with only those files
// We can't mix the `tsc` cli with both `--project` and a list of files to compile because TSC
// ignores the tsconfig file when passing file paths in!
async function compileDeclarations({ rootDirectory, files, logger }) {
  const tempTSConfigPath = pathJoin(rootDirectory, "temp.tsconfig.json");
  writeFileSync(
    tempTSConfigPath,
    JSON.stringify({
      extends: "./tsconfig.json",
      includes: files,
    }),
  );
  const command = `tsc --project temp.tsconfig.json`;
  debug(`[compileDeclarations] ${command}`);
  return execAsync(command).then(
    // For both success and failures we want to cleanup the temp file!
    ({ stdout, stderr }) => {
      if (stderr) {
        logger.error(stderr);
      }
      logger.log(stdout);
      rmSync(tempTSConfigPath);
    },
    () => {
      rmSync(tempTSConfigPath);
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

  const filesHashed = (await Promise.all(files.map(hashFile))).map(
    (hashed, idx) => [files[idx], hashed],
  );

  const changedFiles = [];

  for (const [computedFile, computedHash] of filesHashed) {
    if (
      cacheFile.find(([filePath]) => filePath === computedFile)?.[1]
        !== computedHash
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

  await Promise.all([
    compile({ rootDirectory, files: changedFiles, logger }),
    compileDeclarations({ rootDirectory, files: changedFiles, logger }),
  ]);
  try {
    writeFileSync(cacheFilePath, JSON.stringify(filesHashed));
  } catch (error) {
    logger.error(`Failed to write cache file`);
  }
  debug(`Ran in ${Date.now() - start}ms`);
}
