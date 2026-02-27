import type { DataSourceType } from '@opendevelopment/shared-types';
import type { BaseConnector } from './base-connector.js';

class ConnectorRegistry {
  private connectors = new Map<DataSourceType, BaseConnector>();

  register(connector: BaseConnector): void {
    this.connectors.set(connector.sourceType, connector);
  }

  get(sourceType: DataSourceType): BaseConnector | undefined {
    return this.connectors.get(sourceType);
  }

  getAll(): BaseConnector[] {
    return Array.from(this.connectors.values());
  }

  has(sourceType: DataSourceType): boolean {
    return this.connectors.has(sourceType);
  }

  getRegisteredTypes(): DataSourceType[] {
    return Array.from(this.connectors.keys());
  }
}

export const connectorRegistry = new ConnectorRegistry();
