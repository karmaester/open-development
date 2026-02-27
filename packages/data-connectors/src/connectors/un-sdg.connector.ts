import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * UN SDG Indicators API Connector
 *
 * API Documentation: https://unstats.un.org/sdgapi/swagger/
 * Base URL: https://unstats.un.org/sdgapi
 *
 * Example endpoints:
 *   - Goals: /v1/sdg/Goal/List
 *   - Targets: /v1/sdg/Target/List
 *   - Data: /v1/sdg/Indicator/Data?indicator={code}&areaCode={country}
 */
export class UnSdgConnector extends BaseConnector {
  readonly name = 'UN SDG Indicators';
  readonly sourceType = DataSourceType.UN_SDG;
  readonly baseUrl = 'https://unstats.un.org/sdgapi';

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement REST-based fetch using http-client
    throw new Error('UnSdgConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // TODO: Transform UN SDG API response format
    throw new Error('UnSdgConnector.transform() not yet implemented');
  }
}
