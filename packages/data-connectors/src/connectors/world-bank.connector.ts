import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * World Bank Open Data API v2 Connector
 *
 * API Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 * Base URL: https://api.worldbank.org/v2
 *
 * Example endpoints:
 *   - Countries: /country?format=json
 *   - Indicator data: /country/{code}/indicator/{indicator}?format=json&date=2010:2023
 *   - Indicator list: /indicator?format=json
 */
export class WorldBankConnector extends BaseConnector {
  readonly name = 'World Bank Open Data';
  readonly sourceType = DataSourceType.WORLD_BANK;
  readonly baseUrl = 'https://api.worldbank.org/v2';

  // Common World Bank indicator codes
  static readonly INDICATORS = {
    GDP: 'NY.GDP.MKTP.CD',
    GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',
    POPULATION: 'SP.POP.TOTL',
    LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',
    LITERACY_RATE: 'SE.ADT.LITR.ZS',
    UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
    POVERTY: 'SI.POV.DDAY',
    CO2_EMISSIONS: 'EN.ATM.CO2E.PC',
  } as const;

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement fetch logic using http-client
    // const url = `${this.baseUrl}/country/${countryCode}/indicator/${indicatorCode}?format=json&date=${startYear}:${endYear}`;
    throw new Error('WorldBankConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // TODO: Transform World Bank API response format
    // Response format: [metadata, [{indicator: {...}, country: {...}, value: "123.45", date: "2020"}, ...]]
    throw new Error('WorldBankConnector.transform() not yet implemented');
  }
}
