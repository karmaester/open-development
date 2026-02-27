// Schemas
export {
  PaginationSchema,
  SortSchema,
  DateRangeSchema,
  ApiResponseSchema,
} from './schemas/common.schema.js';
export { CreateUserSchema, UserResponseSchema } from './schemas/user.schema.js';
export {
  IndicatorSchema,
  IndicatorDataPointSchema,
  CreateIndicatorSchema,
} from './schemas/indicator.schema.js';
export { CorrelationSchema, CorrelationResultSchema } from './schemas/correlation.schema.js';
export { ProposalSchema, CreateProposalSchema } from './schemas/proposal.schema.js';
export { DataSourceSchema, CreateDataSourceSchema } from './schemas/data-source.schema.js';
export { NewsItemSchema, CreateNewsItemSchema } from './schemas/news.schema.js';

// Types
export type {
  Pagination,
  Sort,
  DateRange,
  CreateUser,
  UserResponse,
  Indicator,
  IndicatorDataPoint,
  CreateIndicator,
  Correlation,
  CorrelationResult,
  Proposal,
  CreateProposal,
  DataSource,
  CreateDataSource,
  NewsItem,
  CreateNewsItem,
} from './types/index.js';

// Enums
export { DataSourceType, DATA_SOURCE_TYPES } from './enums/data-source.enum.js';
export { CorrelationMethod, CorrelationStatus } from './enums/correlation.enum.js';
export { ProposalStatus } from './enums/proposal.enum.js';
export { UserRole } from './enums/user.enum.js';

// Constants
export { SDG_GOALS, getSdgGoal } from './constants/sdg-goals.js';
export type { SdgGoal } from './constants/sdg-goals.js';
export { COUNTRY_CODES, getCountryByCode, getAllCountryCodes } from './constants/country-codes.js';
export type { CountryInfo } from './constants/country-codes.js';
export {
  INDICATOR_CATEGORIES,
  getCategoryById,
} from './constants/indicator-categories.js';
export type { IndicatorCategory } from './constants/indicator-categories.js';
