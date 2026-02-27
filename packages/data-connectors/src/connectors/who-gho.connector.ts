import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * WHO Global Health Observatory (GHO) API Connector
 *
 * API Documentation: https://www.who.int/data/gho/info/gho-odata-api
 * Base URL: https://ghoapi.azurewebsites.net/api
 *
 * Example endpoints:
 *   - Indicators: /Indicator
 *   - Data: /{IndicatorCode}?$filter=SpatialDim eq 'USA'
 */
export class WhoGhoConnector extends BaseConnector {
  readonly name = 'WHO Global Health Observatory';
  readonly sourceType = DataSourceType.WHO_GHO;
  readonly baseUrl = 'https://ghoapi.azurewebsites.net/api';

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement OData-based fetch using http-client
    throw new Error('WhoGhoConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // TODO: Transform GHO OData response format
    throw new Error('WhoGhoConnector.transform() not yet implemented');
  }
}
