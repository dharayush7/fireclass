# Changelog

All notable changes to this project will be documented in this file.

This project adheres to Keep a Changelog and Semantic Versioning.

## v0.1.9 - 2025-11-30

### Added

- Comprehensive `README.md` with installation, usage, `class-validator` and `class-transformer` integrations
- API reference covering `getBaseModel`, `Collection` decorator, and `QueryOptions<T>`
- Practical examples (Express API, Cloud Functions) and error handling strategies

### Improved

- Documentation of validation flow (`validateOrReject`) and transformation pipeline (`plainToInstance`)
- Guidance on query capabilities (`where`, `orderBy`, `limit`) and index considerations

### Build & Packaging

- Confirmed export map for ESM/CJS and `typesVersions`
- Type declarations generated via `tsup` build

### Compatibility

- Verified with `firebase-admin@^13.6.0`
- Uses `class-validator@^0.14.3` and `class-transformer@^0.5.1`
