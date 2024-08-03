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

Ensure you have SWC and TSC installed and configured, specifically you'll need:

- `.swcrc` in the root of your project
- `tsconfig.json` in the root of your project

`hohoro` takes care of the rest by automatically running SWC and TSC in parallel, and only recompiling files that have changed since the last build.

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

## Contributing:

### Code Quality:

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Node for running unit tests, run `bun run test` from the root or from this workspace!

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!

## Used By:

- [Switch Kit](https://switch-kit.vercel.app/)

## Contributors:

- [Matt Hamlin](https://github.com/hamlim)
- [Zubin Bhaskar](https://github.com/memickeymac03)
