# CLAUDE.md — OpenDevelopment

## Project Overview

OpenDevelopment is a global, open-source platform for aggregating, visualizing, and cross-correlating development data from authoritative sources (World Bank, WHO, UNICEF, FAO, UN SDG, RSS feeds).

**Current status: Phase 1 scaffold complete. No running application yet.** Both `apps/backend` and `apps/frontend` are empty stubs. The shared packages (types, db schemas, data connectors) are implemented but the actual backend API and frontend UI do not exist.

## Architecture

Turborepo + pnpm monorepo. Node 22, pnpm 9.15.4.

**Package dependency graph:**
```
apps/backend  ──→  packages/db  ──→  packages/shared-types
     │              packages/data-connectors ──→  packages/shared-types
     ▼
apps/frontend ──→  packages/shared-types
```

All packages extend `packages/typescript-config` and `packages/eslint-config`.

**Key tech:** TypeScript (strict), Drizzle ORM, PostgreSQL 16 + TimescaleDB, Redis 7, Zod, Vitest.

## Workspace Structure

```
apps/
  backend/          # NestJS API — EMPTY STUB (package.json only)
  frontend/         # Next.js UI — EMPTY STUB (package.json only)

packages/
  shared-types/     # Zod schemas, enums, constants — COMPLETE
  db/               # Drizzle schemas, TimescaleDB init, seed — COMPLETE
  data-connectors/  # Base class + 6 connector stubs + utilities — PARTIAL
  typescript-config/ # 4 tsconfig presets (base, library, nestjs, nextjs)
  eslint-config/    # 4 ESLint flat configs (base, nestjs, nextjs, react)

infrastructure/
  docker/           # docker-compose.yml (PG16+TimescaleDB, Redis 7)
  scripts/          # setup.sh, reset-db.sh
```

## Development Commands

```bash
pnpm install                    # Install all dependencies
pnpm turbo build                # Build all packages
pnpm turbo type-check           # TypeScript check (zero errors as of Phase 1)
pnpm turbo test                 # Run vitest (30 tests pass)
pnpm turbo lint                 # ESLint (NOTE: missing eslint.config.js in packages, see Known Issues)
pnpm format                     # Prettier format all files
pnpm format:check               # Prettier check

# Database commands (ordering matters — turbo.json enforces dependencies)
pnpm turbo db:push              # Push Drizzle schema to database
pnpm turbo db:init-timescale    # Initialize TimescaleDB hypertables (depends on db:push)
pnpm turbo db:seed              # Seed sample data (depends on db:init-timescale)
pnpm turbo db:reset             # Drop everything and re-create

# Infrastructure
./infrastructure/scripts/setup.sh    # Docker up + wait for health + db:push + init + seed
./infrastructure/scripts/reset-db.sh # Destroy volumes and re-run setup (interactive confirmation)
```

Docker Compose file: `infrastructure/docker/docker-compose.yml`

## Code Conventions

### Zod-first schemas
Define Zod schema first, infer TypeScript type. All domain types live in `packages/shared-types/src/schemas/`.
```typescript
export const IndicatorSchema = z.object({ ... });
export type Indicator = z.infer<typeof IndicatorSchema>;
```

### Barrel exports
Every package has `src/index.ts` re-exporting all public API. Use `.js` extensions in import paths (ES modules).

### ESLint
Flat config format (ESLint 9+). Config files are CJS `.js` files in `packages/eslint-config/`. Consuming packages need a local `eslint.config.js` that imports and spreads the shared config.

### TypeScript
- Strict mode enabled (`strict: true`, `noUncheckedIndexedAccess: true`)
- Target: ES2022, module: ESNext, moduleResolution: bundler
- Library packages extend `library.json` (emits declarations + composite)

### Commits
Conventional commits enforced by commitlint + husky. Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

### Testing
- Vitest with `globals: true`
- Test files in `__tests__/` directory with `.test.ts` suffix
- `packages/data-connectors` has 30 passing tests (normalize-country: 21, rate-limiter: 9)
- `packages/shared-types` has no tests yet (passWithNoTests enabled)

### Database
- Drizzle ORM for schema definition and queries
- UUID primary keys via `gen_random_uuid()`
- TimescaleDB for time-series data (hypertable on `indicator_data.recorded_at`)
- Seed script uses real indicator codes (e.g., NY.GDP.MKTP.CD, SP.POP.TOTL)

## What's Implemented vs. Stubbed

### Fully implemented
- **All Zod schemas** (7 schema files): user, indicator, correlation, proposal, data-source, news, common
- **All enums** (4 files): DataSourceType, CorrelationMethod/Status, ProposalStatus, UserRole
- **All constants** (3 files): 17 SDG goals, 56 countries with regions/income groups, 7 indicator categories
- **All DB schemas** (9 tables): users, data_sources, indicators, indicator_data, correlations, proposals, proposal_comments, news_items, etl_runs
- **TimescaleDB init SQL**: hypertable conversion, continuous aggregates (yearly rollup), optimized indexes
- **Seed script**: 6 data sources, 20 real indicators, 150 data points (3 countries x 10 years), 2 proposals, 10 news items, 1 admin user
- **normalize-country transformer**: 100+ country aliases with Levenshtein fuzzy matching fallback
- **Rate limiter**: Token bucket algorithm (lazy refill, no background timers)
- **Retry utility**: Exponential backoff with jitter, retryable error classification (429, 5xx, network errors)
- **HTTP client**: fetch wrapper with timeout (AbortController), rate limiting, retry integration

### Stubs (not yet implemented)
- **All 6 data connector extract/transform methods** throw "not yet implemented":
  - WorldBankConnector, WhoGhoConnector, UnicefSdmxConnector, UnSdgConnector, FaostatConnector, RssFeedConnector
  - Each has correct API URLs and documentation comments ready for implementation
- **apps/backend** — empty package.json, no NestJS app
- **apps/frontend** — empty package.json, no Next.js app

### Not yet created
- No Drizzle migrations generated (schema exists but `db:generate` hasn't been run)
- Connector registry is never populated (connectors exist but nothing calls `registry.register()`)
- No `eslint.config.js` in consuming packages (shared-types, db, data-connectors)

## Known Issues

1. **Lint won't work**: Packages have `"lint": "eslint src/"` scripts but no local `eslint.config.js` files. Each consuming package needs an `eslint.config.js` that imports from `@opendevelopment/eslint-config`.

2. **No UNIQUE constraint on indicator_data**: The `indicator_data` table lacks a `UNIQUE(indicatorId, countryCode, year)` constraint, allowing duplicate data points for the same indicator/country/year combination.

3. **news-items relationship design**: `relatedIndicatorIds` is stored as a `text[]` array instead of a proper junction table. No referential integrity enforcement.

4. **ESLint react/nextjs configs incomplete**: `packages/eslint-config/nextjs.js` and `react.js` reference React rules (e.g., `react/react-in-jsx-scope`) but don't import the React ESLint plugin. They will fail at runtime.

5. **Test coverage gaps**: No tests for `normalize-year`, `validate-data-point`, or `http-client`. Rate limiter test has a time-advancement test that uses `vi.useRealTimers` incorrectly.

6. **Docker credentials**: docker-compose uses default `postgres:postgres` credentials (fine for local dev, not for staging/prod).

## Key Files Reference

| Purpose | Path |
|---------|------|
| Root package.json | `package.json` |
| Turbo config | `turbo.json` |
| Workspace config | `pnpm-workspace.yaml` |
| Docker Compose | `infrastructure/docker/docker-compose.yml` |
| DB schema index | `packages/db/src/schema/index.ts` |
| TimescaleDB init | `packages/db/scripts/init-timescaledb.sql` |
| Seed script | `packages/db/scripts/seed.ts` |
| Base connector | `packages/data-connectors/src/base-connector.ts` |
| Country normalizer | `packages/data-connectors/src/transformers/normalize-country.ts` |
| Rate limiter | `packages/data-connectors/src/utils/rate-limiter.ts` |
| Shared types index | `packages/shared-types/src/index.ts` |
| CI workflow | `.github/workflows/ci.yml` |
| Env template | `.env.example` |
