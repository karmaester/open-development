export interface IndicatorCategory {
  id: string;
  label: string;
  description: string;
  relatedSdgGoals: number[];
}

export const INDICATOR_CATEGORIES: readonly IndicatorCategory[] = [
  {
    id: 'health',
    label: 'Health',
    description: 'Health outcomes, healthcare access, and disease prevalence indicators',
    relatedSdgGoals: [3, 6],
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Literacy, enrollment, educational attainment, and learning outcomes',
    relatedSdgGoals: [4],
  },
  {
    id: 'economy',
    label: 'Economy',
    description: 'GDP, trade, employment, poverty, and economic growth indicators',
    relatedSdgGoals: [1, 8, 10],
  },
  {
    id: 'environment',
    label: 'Environment',
    description: 'Climate, emissions, biodiversity, and natural resource indicators',
    relatedSdgGoals: [6, 7, 13, 14, 15],
  },
  {
    id: 'governance',
    label: 'Governance',
    description: 'Rule of law, corruption, political stability, and institutional quality',
    relatedSdgGoals: [16],
  },
  {
    id: 'demographics',
    label: 'Demographics',
    description: 'Population, migration, urbanization, and demographic transition indicators',
    relatedSdgGoals: [5, 11],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    description: 'Transport, energy access, internet connectivity, and built environment',
    relatedSdgGoals: [7, 9, 11],
  },
] as const;

export const getCategoryById = (id: string): IndicatorCategory | undefined =>
  INDICATOR_CATEGORIES.find((c) => c.id === id);
