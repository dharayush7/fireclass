# Changelog

All notable changes to this project will be documented in this file.

This project adheres to Keep a Changelog and Semantic Versioning.

## v0.2.12 - 2025-12-03

### Added

- Comprehensive example (`TurfBooking`) demonstrating all field types with proper `class-validator` decorators
- Documentation for optional fields with `@IsOptional()` decorator usage and best practices
- Contact & Support section with developer information, portfolio, and links
- Clear requirement documentation for `class-validator` and `class-transformer` dependencies

### Improved

- Updated all code examples to include required constructor pattern:
  ```typescript
  constructor(data?: Partial<ClassName>) {
    super(data);
    Object.assign(this, data);
  }
  ```
- Enhanced field type documentation with examples for:
  - `@IsDate()` for Date fields
  - `@IsString()` for string fields
  - `@IsArray()` for array fields
  - `@IsObject()` for object fields
  - `@IsBoolean()` for boolean fields
  - `@IsOptional()` for optional fields
- Improved dependency installation instructions with detailed explanations
- Updated all examples throughout documentation to follow consistent patterns

### Documentation

- Added portfolio link to contact section
- Clarified that every extended class must include the constructor pattern
- Enhanced examples in Basic Usage, Class-Transformer Integration, and all code samples

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
