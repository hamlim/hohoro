#!/usr/bin/env node
import { runBuild } from "../legacy-incremental-build.mjs";

runBuild({ rootDirectory: process.cwd(), logger: console }).catch((e) => {
  console.error("Error running legacy incremental build");
  console.error(e);
  process.exit(1);
});
