import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * UNICEF SDMX Data API Connector
 *
 * API Documentation: https://data.unicef.org/resources/data-explorer/
 * Base URL: https://sdmx.data.unicef.org/ws/public/sdmxapi/rest
 *
 * Example endpoints:
 *   - Data: /data/{dataflow}/{key}?format=jsondata
 */
export class UnicefSdmxConnector extends BaseConnector {
  readonly name = 'UNICEF Data';
  readonly sourceType = DataSourceType.UNICEF_SDMX;
  readonly baseUrl = 'https://sdmx.data.unicef.org/ws/public/sdmxapi/rest';

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement SDMX-based fetch using http-client
    throw new Error('UnicefSdmxConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // TODO: Transform SDMX JSON response format
    throw new Error('UnicefSdmxConnector.transform() not yet implemented');
  }
}
