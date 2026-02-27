export const DataSourceType = {
  WORLD_BANK: 'WORLD_BANK',
  WHO_GHO: 'WHO_GHO',
  UNICEF_SDMX: 'UNICEF_SDMX',
  UN_SDG: 'UN_SDG',
  FAOSTAT: 'FAOSTAT',
  RSS_FEED: 'RSS_FEED',
} as const;

export type DataSourceType = (typeof DataSourceType)[keyof typeof DataSourceType];

export const DATA_SOURCE_TYPES = Object.values(DataSourceType);
