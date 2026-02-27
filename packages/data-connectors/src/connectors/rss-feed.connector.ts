import { DataSourceType } from '@opendevelopment/shared-types';
import { BaseConnector, type ExtractOptions, type RawDataRecord } from '../base-connector.js';

/**
 * RSS Feed Connector
 *
 * Generic connector for pulling development news from RSS/Atom feeds.
 * Used for aggregating news from organizations like:
 *   - Devex: https://feeds.devex.com/news.xml
 *   - ReliefWeb: https://reliefweb.int/updates/rss.xml
 *   - World Bank Blogs: https://blogs.worldbank.org/feed
 */
export class RssFeedConnector extends BaseConnector {
  readonly name = 'RSS Feed';
  readonly sourceType = DataSourceType.RSS_FEED;
  readonly baseUrl = 'https://feeds.devex.com/news.xml';

  async extract(_options: ExtractOptions): Promise<unknown[]> {
    // TODO: Implement RSS/Atom feed parsing
    throw new Error('RssFeedConnector.extract() not yet implemented');
  }

  transform(_rawData: unknown[]): RawDataRecord[] {
    // RSS feeds produce news items, not data records.
    // This connector returns empty records and handles news separately.
    return [];
  }
}
