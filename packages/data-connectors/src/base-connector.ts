import type { DataSourceType } from '@opendevelopment/shared-types';

export interface ConnectorMetadata {
  name: string;
  sourceType: DataSourceType;
  baseUrl: string;
  description: string;
  supportedIndicators?: string[];
}

export interface RawDataRecord {
  indicatorCode: string;
  countryCode: string;
  year: number;
  value: number | null;
  metadata?: Record<string, unknown>;
}

export interface ExtractOptions {
  indicatorCodes?: string[];
  countryCodes?: string[];
  startYear?: number;
  endYear?: number;
}

export abstract class BaseConnector {
  abstract readonly name: string;
  abstract readonly sourceType: DataSourceType;
  abstract readonly baseUrl: string;

  /**
   * Extract raw data from the external source.
   */
  abstract extract(options: ExtractOptions): Promise<unknown[]>;

  /**
   * Transform raw API responses into normalized data records.
   */
  abstract transform(rawData: unknown[]): RawDataRecord[];

  /**
   * Validate transformed records, filtering out invalid entries.
   */
  validate(records: RawDataRecord[]): RawDataRecord[] {
    return records.filter(
      (record) =>
        record.indicatorCode &&
        record.countryCode &&
        record.countryCode.length === 3 &&
        record.year >= 1900 &&
        record.year <= 2100 &&
        record.value !== null &&
        record.value !== undefined &&
        !isNaN(record.value),
    );
  }

  /**
   * Return metadata about this connector.
   */
  getMetadata(): ConnectorMetadata {
    return {
      name: this.name,
      sourceType: this.sourceType,
      baseUrl: this.baseUrl,
      description: `Connector for ${this.name}`,
    };
  }
}
