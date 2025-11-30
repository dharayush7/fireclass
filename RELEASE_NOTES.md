# Release Notes

## v0.1.9 (2025-11-30)

### Summary

- Adds comprehensive documentation and examples to onboard users quickly.
- Confirms stable API for `getBaseModel`, `@Collection` decorator, and typed queries.

### What’s New

- `README.md` with detailed integration for `class-validator` and `class-transformer`.
- API reference for `BaseModel` methods and `QueryOptions<T>`.
- Practical examples (Express, Cloud Functions) and error handling strategies.

### Improvements

- Clear validation flow using `validateOrReject` prior to writes.
- Transformation pipeline with `plainToInstance`, `@Transform`, and `@Type`.
- Guidance for queries with `where`, `orderBy`, `limit`, and index considerations.

### Breaking Changes

- None.

### Upgrade Notes

- No code changes required. Install the package and follow the `README.md` for usage.
- Ensure peer libraries align:
  - `firebase-admin@^13.6.0`
  - `class-validator@^0.14.3`
  - `class-transformer@^0.5.1`

### Known Issues

- Complex `where + orderBy` combos may require Firestore composite indexes.
