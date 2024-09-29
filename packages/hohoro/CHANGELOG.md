### Unreleased:

### [0.3.0] - September 29th, 2024

_This change should be backwards compatible for existing installs_

This release introduces a new `experimental` export and binary:

- Export: `'hohoro/experimental'`
- Binary: `hohoro-experimental`

Both support the same API as the existing export and binary, however under the hood it's using [Oxc](https://oxc.rs/) and it's new [Oxc Transformer Alpha](https://oxc.rs/blog/2024-09-29-transformer-alpha.html).

What this means in practice is that you should be able to remove your `.swcrc` config (as well as related `swc` dependencies) and the `typescript` dependency if you're using the experimental export/binary. We use Oxc to both compile JavaScript/TypeScript into ESNext compatible JavaScript, and also use it to generate [isolated declarations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#isolated-declarations).

### [0.2.1] - August 15th, 2024

Fix missing stderr output if `tsc` fails for type errors. Previously `hohoro` would exit with a successful exit code and it would be possible for no type declaration files to be generated in dist (or the target output directory).

With this change, if there are type errors, the command will exit with a non-successful exit code and print the type errors from `tsc`!

### [0.2.0] - August 3rd, 2024

- Update formatter to use biome instead of dprint
- Add docs for "watch mode" support
- Add exports to package to make build API public

### [0.1.3] - June 4th, 2024

- Simplified the package structure when published to npm - huge thanks to [Zubin Bhaskar](https://github.com/memickeymac03)

### [0.1.2] - May 21st, 2024

- Fix `.d.ts` files not being generated properly by `hohoro`
- Fix not cleaning up `temp.tsconfig.json` file if `swc` failed to compile
- Fix calling `build` programatically not working properly (although this is an unstable API)

### [0.1.1] - May 20th, 2024

- Fix file paths within `build-cache.json` to be relative to the project root
  - Note - upgrading to this version may invalidate the cache locally!

### [0.1.0] - May 13th, 2024

- Improve readme with additional context of the library
- Add homepage to package.json

### [0.0.5] - May 13th, 2024

- Update build cache filename - will temporarily invalidate caches locally

### [0.0.4] - May 7th, 2024

- Updated tests, fixed debug parameter

### [0.0.3] - May 6th, 2024

- Updated context within package.json

### [0.0.2] - May 6th, 2024

- Updated docs in README

### [0.0.1] - May 6th, 2024

- Initial release!
