#!/usr/bin/env node
import { runBuild } from "../experimental-incremental-build.mjs";

runBuild({ rootDirectory: process.cwd(), logger: console }).catch((e) => {
  console.error("Error running experimental incremental build");
  console.error(e);
  process.exit(1);
});
