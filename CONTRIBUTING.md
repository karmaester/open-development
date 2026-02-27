# Contributing to OpenDevelopment

Thank you for your interest in contributing to OpenDevelopment! This guide will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env`
4. Start infrastructure: `./infrastructure/scripts/setup.sh`
5. Build all packages: `pnpm turbo build`

## Project Structure

```
opendevelopment/
├── apps/           # Application code (backend, frontend)
├── packages/       # Shared packages
│   ├── shared-types/       # Zod schemas, types, enums, constants
│   ├── db/                 # Database schema and migrations
│   ├── data-connectors/    # ETL connectors for external APIs
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
└── infrastructure/         # Docker, scripts
```

## How to Contribute

### Adding a New Data Source Connector

1. Create a new file in `packages/data-connectors/src/connectors/`
2. Extend `BaseConnector` and implement `extract()`, `transform()`, and `validate()`
3. Register the connector in `connector-registry.ts`
4. Add tests in `__tests__/`
5. Update the `DataSourceType` enum in `packages/shared-types/`

### Proposing a Cross-Dataset Correlation

1. Open a [Correlation Proposal](../../issues/new?template=correlation_proposal.yml) issue
2. Describe the indicators, hypothesis, and expected relationship
3. The community will review and discuss before implementation

### Code Style

- **TypeScript**: Strict mode, no `any` unless unavoidable
- **Formatting**: Prettier (run `pnpm format`)
- **Linting**: ESLint (run `pnpm turbo lint`)
- **Naming**: camelCase for variables/functions, PascalCase for types/classes
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

Examples:
```
feat(data-connectors): add UNESCO connector
fix(db): correct indicator_data index order
docs(readme): update quick start instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Ensure all checks pass: `pnpm turbo build lint type-check test`
4. Open a PR using the provided template
5. Address any review feedback
6. A maintainer will merge once approved

## Reporting Issues

- **Bugs**: Use the [Bug Report](../../issues/new?template=bug_report.yml) template
- **Features**: Use the [Feature Request](../../issues/new?template=feature_request.yml) template
- **Data Sources**: Use the [Data Source Request](../../issues/new?template=data_source_request.yml) template

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.
