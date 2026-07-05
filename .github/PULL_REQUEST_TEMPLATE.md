## Description

<!-- Provide a concise description of the changes in this PR. -->

## Type of Change

<!-- Select the type that best describes this PR -->

- [ ] 🚀 **Feature** - New functionality
- [ ] 🐛 **Bug Fix** - Fixes an issue
- [ ] ♻️ **Refactor** - Code restructuring without behavior change
- [ ] 📚 **Documentation** - Documentation updates only
- [ ] 🗄️ **Schema Change** - Database migration or schema modification
- [ ] 🎨 **UI/UX** - Visual or user experience changes
- [ ] ⚡ **Performance** - Performance improvements
- [ ] 🔒 **Security** - Security fixes or improvements
- [ ] 🧪 **Tests** - Adding or updating tests
- [ ] 🔧 **Configuration** - Build, CI/CD, or tooling changes
- [ ] 📦 **Dependencies** - Dependency updates

## Related Issues

<!-- Link related issues using GitHub keywords -->

Closes #
Related to #

## Changes Made

<!-- Provide a detailed list of changes -->

- 
- 
- 

## Screenshots / Videos

<!-- If this includes UI changes, add screenshots or recordings -->

| Before | After |
|--------|-------|
| <!-- screenshot --> | <!-- screenshot --> |

## Database Migration Notes

<!-- Complete this section if the PR includes schema changes -->

- **Migration file(s)**: <!-- e.g., `packages/database/migrations/20240101_add_column.sql` -->
- **Rollback tested**: Yes / No / N/A
- **Requires backfill**: Yes / No
- **Estimated migration time**: <!-- for production data -->
- **Downtime required**: Yes / No

## Checklist

### General

- [ ] My code follows the project's coding standards and conventions
- [ ] I have performed a self-review of my code
- [ ] I have commented my code in hard-to-understand areas
- [ ] My changes generate no new warnings or errors

### Testing

- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested edge cases and error scenarios
- [ ] Integration tests pass (if applicable)

### Documentation

- [ ] I have updated relevant documentation
- [ ] I have updated API documentation / OpenAPI specs (if applicable)
- [ ] I have added/updated JSDoc comments for public APIs

### Database & Security

- [ ] Database migrations are backward compatible
- [ ] RLS (Row Level Security) policies are verified for new/modified tables
- [ ] No cross-tenant data leakage is possible
- [ ] Sensitive data is properly handled (no PII in logs, etc.)

### Standards Compliance

- [ ] Changes align with ISO 55000/55001/55002 (Asset Management)
- [ ] Changes align with ISO 19650 (Information Management) if applicable
- [ ] Changes align with ISO 14224 (Reliability Data) if applicable
- [ ] N/A - Changes don't affect standards compliance

### Build & Deploy

- [ ] Lint passes (`pnpm turbo run lint`)
- [ ] Type check passes (`pnpm turbo run type-check`)
- [ ] Build succeeds (`pnpm turbo run build`)
- [ ] No breaking changes to public APIs (or documented in description)

## Reviewer Notes

<!-- Any specific areas you'd like reviewers to focus on? -->

## Post-Merge Tasks

<!-- Any tasks that need to happen after this PR is merged -->

- [ ] N/A
