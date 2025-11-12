import { createHash } from "node:crypto";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path, { join as pathJoin, basename, extname, dirname } from "node:path";
import createDebug from "debug";
import fg from "fast-glob";
import { transform } from "oxc-transform";

const debug = createDebug("hohoro");

function writeFileSyncWithDirs(filePath, data) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, data);
}

function copyFileSyncWithDirs(filePath, data) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  copyFileSync(filePath, data);
}

function compile({ files, logger }) {
  debug(`[compile] Compiling ${files}...`);
  let compileCount = 0;
  let copyCount = 0;
  const errors = [];
  for (const filePath of files) {
    const distPath = filePath.replace("src", "dist");

    switch (extname(filePath)) {
      case ".ts":
      case ".js":
      case ".jsx":
      case ".tsx": {
        const {
          code,
          declaration,
          errors: compileErrors,
        } = transform(basename(filePath), readFileSync(filePath).toString(), {
          typescript: {
            declaration: {
              emit: true,
            },
          },
        });

        if (compileErrors.length) {
          errors.push(...compileErrors);
          logger.error(compileErrors);
        }

        writeFileSyncWithDirs(distPath.replace(/(\.tsx|\.ts)/, ".js"), code);
        if (declaration) {
          writeFileSyncWithDirs(
            distPath.replace(/(\.tsx|\.ts)/, ".d.ts"),
            declaration,
          );
        }
        compileCount++;
        break;
      }
      default: {
        copyFileSyncWithDirs(filePath, distPath);
        copyCount++;
        break;
      }
    }
  }
  return { compileCount, copyCount, errors };
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
    path.posix.join(fg.convertPathToPattern(rootDirectory), "src/**/*"),
    {
      ignore: ["**/__tests__/**"],
      onlyFiles: true,
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

  try {
    mkdirSync(pathJoin(rootDirectory, "dist"), { recursive: true });
  } catch {}

  const { compileCount, copyCount, errors } = compile({
    files: absoluteChangedFiles,
    logger,
  });

  if (errors.length) {
    logger.error(`Failed to compile: ${errors}`);
    debug(`Ran in ${Date.now() - start}ms`);
    process.exit(1);
  }
  logger.log(
    `compiled: ${compileCount} file${compileCount === 1 ? "" : "s"}${
      copyCount > 0
        ? `, copied ${copyCount} file${copyCount === 1 ? "" : "s"}`
        : ""
    }`,
  );
  try {
    writeFileSync(cacheFilePath, JSON.stringify(filesHashed));
  } catch (error) {
    logger.error(`Failed to write cache file`);
  }
  debug(`Ran in ${Date.now() - start}ms`);
}
