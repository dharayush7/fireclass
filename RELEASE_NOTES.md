# Release Notes

## v0.2.11 (2025-12-03)

### Summary

- Enhanced documentation with comprehensive examples showing proper class-validator decorator usage for all field types.
- Added required constructor pattern documentation for all extended classes.
- Improved developer experience with optional fields documentation and contact information.

### What's New

- **Complete Field Type Examples**: Added comprehensive `TurfBooking` example demonstrating proper usage of:
  - `@IsDate()` for Date fields
  - `@IsString()` for string fields
  - `@IsArray()` for array fields
  - `@IsObject()` for object fields
  - `@IsBoolean()` for boolean fields
  - `@IsOptional()` for optional fields
- **Constructor Pattern Documentation**: All examples now clearly show the required constructor pattern:
  ```typescript
  constructor(data?: Partial<ClassName>) {
    super(data);
    Object.assign(this, data);
  }
  ```
- **Optional Fields Guide**: New section explaining how to properly mark and validate optional fields with `@IsOptional()` decorator.
- **Contact & Support Section**: Added developer contact information including portfolio, GitHub, and email.

### Improvements

- **Enhanced Code Examples**: All code examples throughout the documentation now follow consistent patterns with proper decorators.
- **Dependency Documentation**: Clarified requirements for `class-validator` and `class-transformer` with detailed explanations.
- **Better Developer Onboarding**: Improved documentation structure makes it easier for new users to understand proper usage patterns.

### Breaking Changes

- None.

### Upgrade Notes

- No code changes required. This is a documentation-only release.
- Ensure you're using the required constructor pattern in all your extended classes:
  ```typescript
  constructor(data?: Partial<YourClass>) {
    super(data);
    Object.assign(this, data);
  }
  ```
- Make sure all fields have appropriate `class-validator` decorators based on their types.
- For optional fields, always use `@IsOptional()` before other validation decorators.

### Known Issues

- Complex `where + orderBy` combos may require Firestore composite indexes.

---
