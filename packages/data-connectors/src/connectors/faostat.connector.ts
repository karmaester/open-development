import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * FAOSTAT API Connector
 *
 * API Documentation: https://www.fao.org/faostat/en/#data
 * Base URL: https://www.fao.org/faostat/api/v1
 *
 * Example endpoints:
 *   - Domains: /en/definitions/domain
 *   - Data: /en/data/{domain}?area={code}&year={year}
 */
export class FaostatConnector extends BaseConnector {
  readonly name = 'FAOSTAT';
  readonly sourceType = DataSourceType.FAOSTAT;
  readonly baseUrl = 'https://www.fao.org/faostat/api/v1';

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement REST-based fetch using http-client
    throw new Error('FaostatConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // TODO: Transform FAOSTAT API response format
    throw new Error('FaostatConnector.transform() not yet implemented');
  }
}
