#!/usr/bin/env node
import { runBuild } from "../incremental-build.mjs";

runBuild({ rootDirectory: process.cwd(), logger: console }).catch((e) => {
  console.error("Error running incremental build");
  console.error(e);
  process.exit(1);
});
