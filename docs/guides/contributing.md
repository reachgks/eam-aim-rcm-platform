# Contributing Guide

## Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/module-name`
3. Make changes following the coding standards
4. Write tests for new functionality
5. Submit a Pull Request

## Coding Standards

### TypeScript
- Strict mode enabled
- Use Drizzle ORM for all database operations
- All tables must include `tenant_id`, `id` (UUID), `created_at`
- Use `pgEnum` for enumerated types

### Schema Conventions
- Table names: `snake_case` (plural)
- Column names: `snake_case`
- Enum names: `UPPER_SNAKE_CASE` values
- Index names: `tablename_column_idx`
- Foreign keys reference parent table `.id`

### API Conventions
- RESTful endpoints under `/api/v1/`
- JSON request/response bodies
- Pagination: `{ data: [], pagination: { page, limit, total } }`
- Error format: `{ error: string, message: string, statusCode: number }`

## Pull Request Checklist

- [ ] Code follows project conventions
- [ ] Schema changes include migration files
- [ ] New endpoints have Zod validation
- [ ] Tests pass locally
- [ ] No `any` types (use proper typing)
- [ ] Audit logging for mutations
