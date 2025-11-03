# `hohoro`

An incremental build tool for JavaScript and TypeScript projects.

**[Docs](https://hohoro.vercel.app/)**

## Installation:

```sh
bun add hohoro
```

## Usage:

Add a build script to your `package.json`:

```json
{
  "scripts": {
    "build": "hohoro"
  }
}
```

By default, hohoro uses [oxc](https://oxc.rs/) to both transform your library assets, and also emit `.d.ts` files. You'll need to ensure that you have a `tsconfig.json` file configured for your project, as hohoro will extend your config by default!

`hohoro` will only recompile files that have changed since the last build, you can delete the `dist/build-cache.json` file to force a full re-build if necessary.

### Watch Mode:

`hohoro` doesn't have a built in "watch mode", however you can easily create a local `dev.mjs` script and use `node --watch` to accomplish the same behavior as other build tools!

Create a `dev.mjs` script (or name it whatever you want):

```mjs
// dev.mjs
import { runBuild } from "hohoro";

await runBuild({ rootDirectory: process.cwd(), logger: console });
```

Then add the following `dev` script to your `package.json`:

```json
{
  "scripts": {
    "dev": "node --watch-path=./src dev.mjs"
  }
}
```

## Legacy:

> Prior to v1, hohoro used SWC and TSC to compile your files and emit declaration files, the default was changed to used oxc instead
> If you still need/want to use SWC to compile your files, then you'll want the legacy entrypoint

This library also exposes a `hohoro-legacy` binary that builds code using [swc](https://swc.rs/).

When using the legacy binary - you'll **need to also install `@swc/core`, `@swc/cli` and `typescript` as devDependencies**.

### Usage:

```json
{
  "scripts": {
    "build": "hohoro-legacy"
  }
}
```

Additionally, you'll need to configure a local `.swcrc` config file, see [here](https://swc.rs/docs/configuration/swcrc) for details on config options.

## Contributing:

### Code Quality:

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Bun for running unit tests, run `bun run test` from the root or from this workspace!

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!

## Used By:

- [Switch Kit](https://switch-kit.vercel.app/)

## Contributors:

- [Matt Hamlin](https://github.com/hamlim)
- [Zubin Bhaskar](https://github.com/memickeymac03)
