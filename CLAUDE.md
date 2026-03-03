# CLAUDE.md -- OpenDevelopment

## Project Overview

OpenDevelopment is a global, open-source platform for aggregating, visualizing, and cross-correlating development data from authoritative sources (World Bank, WHO, UNICEF, FAO, UN SDG, RSS feeds).

The platform vision is an interface where:

- **Data sources** from international organizations are ingested, normalized, and displayed
- **Users and organizations** can browse indicators, explore time-series visualizations, and discover cross-dataset patterns
- **Community proposals** allow anyone to propose new data source correlations, forming hypotheses about relationships between indicators (e.g., "Does GDP growth correlate with life expectancy improvements?")
- **Correlation analysis** runs statistical methods (Pearson, Spearman, etc.) to validate or refute proposed hypotheses
- **Conversations** happen through proposal comments, enabling collaborative data analysis

**Current status: Phase 1 scaffold complete. No running application yet.** Both `apps/backend` and `apps/frontend` are empty stubs. The shared packages (types, db schemas, data connectors) are implemented but the actual backend API and frontend UI do not exist.

## Architecture

Turborepo + pnpm monorepo. Node 22, pnpm 9.15.4.

**Package dependency graph:**

```
apps/backend  -->  packages/db  -->  packages/shared-types
     |              packages/data-connectors  -->  packages/shared-types
     v
apps/frontend  -->  packages/shared-types
```

All packages extend `packages/typescript-config` and `packages/eslint-config`.

**Key tech:** TypeScript (strict), Drizzle ORM, PostgreSQL 16 + TimescaleDB, Redis 7, Zod, Vitest.

## Workspace Structure

```
apps/
  backend/          # NestJS API -- EMPTY STUB (package.json only)
  frontend/         # Next.js UI -- EMPTY STUB (package.json only)

packages/
  shared-types/     # Zod schemas, enums, constants -- COMPLETE
  db/               # Drizzle schemas, TimescaleDB init, seed -- COMPLETE
  data-connectors/  # Base class + 6 connector stubs + utilities -- PARTIAL
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
pnpm turbo type-check           # TypeScript check (zero errors)
pnpm turbo test                 # Run vitest (30 tests pass)
pnpm turbo lint                 # ESLint all packages
pnpm format                     # Prettier format all files
pnpm format:check               # Prettier check

# Database commands (ordering matters -- turbo.json enforces dependencies)
pnpm turbo db:push              # Push Drizzle schema to database
pnpm turbo db:generate          # Generate Drizzle migrations (not yet run)
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

Flat config format (ESLint 9+). Shared configs are CJS `.js` files in `packages/eslint-config/`. Each consuming package has a local `eslint.config.cjs` (`.cjs` because packages use `"type": "module"`) that imports and spreads the shared config:

```javascript
const base = require('@opendevelopment/eslint-config/base');
module.exports = [...base];
```

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
- `packages/db` has no test script or tests

### Database

- Drizzle ORM for schema definition and queries
- UUID primary keys via `gen_random_uuid()`
- TimescaleDB for time-series data (hypertable on `indicator_data.recorded_at`)
- Composite unique index on `indicator_data(indicatorId, countryCode, year)` prevents duplicate data points
- Seed script uses real indicator codes (e.g., NY.GDP.MKTP.CD, SP.POP.TOTL)

### Formatting

- Prettier with: semicolons, single quotes, trailing commas, 100 char line width, LF line endings
- Config: `.prettierrc`, ignore: `.prettierignore`
- `lint-staged` runs Prettier + ESLint on pre-commit

## What's Implemented vs. Stubbed

### Fully implemented

- **All Zod schemas** (7 schema files): user, indicator, correlation, proposal, data-source, news, common
- **All enums** (4 files): DataSourceType, CorrelationMethod/Status, ProposalStatus, UserRole
- **All constants** (3 files): 17 SDG goals, 56 countries with regions/income groups, 7 indicator categories
- **All DB schemas** (9 tables): users, data_sources, indicators, indicator_data (with unique constraint), correlations, proposals, proposal_comments, news_items, etl_runs
- **TimescaleDB init SQL**: hypertable conversion, continuous aggregates (yearly rollup), optimized indexes
- **Seed script**: 6 data sources, 20 real indicators, 150 data points (3 countries x 10 years), 2 proposals, 10 news items, 1 admin user
- **normalize-country transformer**: 100+ country aliases with Levenshtein fuzzy matching fallback
- **normalize-year transformer**: handles plain years, ISO dates, fiscal years, range formats
- **validate-data-point transformer**: Zod-based validation against IndicatorDataPointSchema
- **Rate limiter**: Token bucket algorithm (lazy refill, no background timers)
- **Retry utility**: Exponential backoff with jitter, retryable error classification (429, 5xx, network errors)
- **HTTP client**: fetch wrapper with timeout (AbortController), rate limiting, retry integration
- **ESLint configs**: local `eslint.config.cjs` in shared-types, db, and data-connectors importing base config
- **Husky hooks**: pre-commit (lint-staged) and commit-msg (commitlint) enforced

### Stubs (not yet implemented)

- **All 6 data connector extract/transform methods** throw "not yet implemented":
  - WorldBankConnector, WhoGhoConnector, UnicefSdmxConnector, UnSdgConnector, FaostatConnector, RssFeedConnector
  - Each has correct API URLs and documentation comments ready for implementation
- **apps/backend** -- empty package.json, no NestJS app
- **apps/frontend** -- empty package.json, no Next.js app

### Not yet created

- No Drizzle migrations generated (schema exists but `db:generate` has not been run)
- Connector registry is never populated (connectors exist but nothing calls `registry.register()`)

## Known Issues

1. **ESLint react/nextjs configs incomplete**: `packages/eslint-config/nextjs.js` and `react.js` reference React rules (e.g., `react/react-in-jsx-scope`) but do not import the React ESLint plugin. They will fail at runtime. Not a problem until apps/frontend is implemented.

2. **news_items relationship design**: `relatedIndicatorIds` is stored as a `text[]` array instead of a proper junction table. No referential integrity enforcement.

3. **Test coverage gaps**: No tests for `normalize-year`, `validate-data-point`, or `http-client`.

4. **Docker credentials**: docker-compose uses default `postgres:postgres` credentials (fine for local dev, not for staging/prod).

5. **No Drizzle migrations**: The project uses `db:push` for development. Before deploying to staging/production, migrations should be generated with `db:generate` and applied with `db:migrate`.

## Key Files Reference

| Purpose                   | Path                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| Root package.json         | `package.json`                                                     |
| Turbo config              | `turbo.json`                                                       |
| Workspace config          | `pnpm-workspace.yaml`                                              |
| Prettier config           | `.prettierrc`                                                      |
| Commitlint config         | `commitlint.config.js`                                             |
| Docker Compose            | `infrastructure/docker/docker-compose.yml`                         |
| DB schema index           | `packages/db/src/schema/index.ts`                                  |
| Indicator data schema     | `packages/db/src/schema/indicator-data.ts`                         |
| TimescaleDB init          | `packages/db/scripts/init-timescaledb.sql`                         |
| Drizzle config            | `packages/db/drizzle.config.ts`                                    |
| Seed script               | `packages/db/scripts/seed.ts`                                      |
| Reset script              | `packages/db/scripts/reset.ts`                                     |
| Base connector            | `packages/data-connectors/src/base-connector.ts`                   |
| Connector registry        | `packages/data-connectors/src/connector-registry.ts`               |
| Country normalizer        | `packages/data-connectors/src/transformers/normalize-country.ts`   |
| Year normalizer           | `packages/data-connectors/src/transformers/normalize-year.ts`      |
| Data point validator      | `packages/data-connectors/src/transformers/validate-data-point.ts` |
| Rate limiter              | `packages/data-connectors/src/utils/rate-limiter.ts`               |
| Retry utility             | `packages/data-connectors/src/utils/retry.ts`                      |
| HTTP client               | `packages/data-connectors/src/utils/http-client.ts`                |
| Shared types index        | `packages/shared-types/src/index.ts`                               |
| ESLint base config        | `packages/eslint-config/base.js`                                   |
| TypeScript base config    | `packages/typescript-config/base.json`                             |
| TypeScript library config | `packages/typescript-config/library.json`                          |
| CI workflow               | `.github/workflows/ci.yml`                                         |
| Env template              | `.env.example`                                                     |

## Phase Roadmap

### Phase 1 (current) -- Scaffold

- Shared types, DB schemas, connector stubs, build tooling, CI

### Phase 2 -- Backend API

- NestJS app in `apps/backend` with REST API endpoints
- Indicator CRUD, data source management, proposal lifecycle
- Authentication and authorization (JWT)
- ETL orchestration using data connectors
- Redis caching layer

### Phase 3 -- Frontend UI

- Next.js app in `apps/frontend`
- Dashboard with indicator visualizations (charts, maps)
- Proposal submission and discussion interface
- Data source browser with filtering by SDG goal, category, country

### Phase 4 -- Correlation Engine

- Implement connector extract/transform methods
- Statistical analysis pipeline (Pearson, Spearman, etc.)
- Automated correlation discovery
- Background job processing with Redis queues
