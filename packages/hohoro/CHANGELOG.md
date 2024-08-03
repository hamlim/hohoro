### Unreleased:

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
