import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
  users,
  dataSources,
  indicators,
  indicatorData,
  proposals,
  newsItems,
} from '../src/schema/index.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function seed() {
  console.log('Seeding database...');

  // 1. Create test user
  const [testUser] = await db
    .insert(users)
    .values({
      email: 'admin@opendevelopment.org',
      displayName: 'Admin User',
      role: 'ADMIN',
    })
    .returning();
  console.log('  Created 1 test user');

  // 2. Create 6 data sources
  const sourceValues = [
    {
      name: 'World Bank Open Data',
      type: 'WORLD_BANK',
      baseUrl: 'https://api.worldbank.org/v2',
      apiVersion: 'v2',
      description: 'World Bank development indicators and statistics',
    },
    {
      name: 'WHO Global Health Observatory',
      type: 'WHO_GHO',
      baseUrl: 'https://ghoapi.azurewebsites.net/api',
      description: 'WHO health statistics and indicators',
    },
    {
      name: 'UNICEF Data',
      type: 'UNICEF_SDMX',
      baseUrl: 'https://sdmx.data.unicef.org/ws/public/sdmxapi/rest',
      description: 'UNICEF statistics on children and women worldwide',
    },
    {
      name: 'UN SDG Indicators',
      type: 'UN_SDG',
      baseUrl: 'https://unstats.un.org/sdgapi',
      description: 'United Nations Sustainable Development Goals indicator data',
    },
    {
      name: 'FAOSTAT',
      type: 'FAOSTAT',
      baseUrl: 'https://www.fao.org/faostat/api/v1',
      apiVersion: 'v1',
      description: 'FAO food and agriculture statistics',
    },
    {
      name: 'Development News RSS',
      type: 'RSS_FEED',
      baseUrl: 'https://feeds.devex.com/news.xml',
      description: 'Aggregated development news from RSS feeds',
    },
  ];
  const insertedSources = await db.insert(dataSources).values(sourceValues).returning();
  console.log('  Created 6 data sources');

  const worldBankId = insertedSources[0]!.id;
  const whoId = insertedSources[1]!.id;
  const unicefId = insertedSources[2]!.id;
  const unSdgId = insertedSources[3]!.id;
  const faoId = insertedSources[4]!.id;

  // 3. Create 20 indicators with real codes
  const indicatorValues = [
    // World Bank indicators
    { code: 'NY.GDP.MKTP.CD', name: 'GDP (current US$)', unit: 'US$', sourceId: worldBankId, category: 'economy', sdgGoal: 8 },
    { code: 'NY.GDP.PCAP.CD', name: 'GDP per capita (current US$)', unit: 'US$', sourceId: worldBankId, category: 'economy', sdgGoal: 8 },
    { code: 'SP.POP.TOTL', name: 'Population, total', unit: 'people', sourceId: worldBankId, category: 'demographics' },
    { code: 'SP.DYN.LE00.IN', name: 'Life expectancy at birth, total (years)', unit: 'years', sourceId: worldBankId, category: 'health', sdgGoal: 3 },
    { code: 'SE.ADT.LITR.ZS', name: 'Literacy rate, adult total (% of people ages 15+)', unit: '%', sourceId: worldBankId, category: 'education', sdgGoal: 4 },
    { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment, total (% of total labor force)', unit: '%', sourceId: worldBankId, category: 'economy', sdgGoal: 8 },
    { code: 'SI.POV.DDAY', name: 'Poverty headcount ratio at $2.15 a day', unit: '%', sourceId: worldBankId, category: 'economy', sdgGoal: 1 },
    { code: 'EN.ATM.CO2E.PC', name: 'CO2 emissions (metric tons per capita)', unit: 'metric tons', sourceId: worldBankId, category: 'environment', sdgGoal: 13 },

    // WHO indicators
    { code: 'WHOSIS_000001', name: 'Life expectancy at birth (years)', unit: 'years', sourceId: whoId, category: 'health', sdgGoal: 3 },
    { code: 'MDG_0000000001', name: 'Infant mortality rate (per 1000 live births)', unit: 'per 1000', sourceId: whoId, category: 'health', sdgGoal: 3 },
    { code: 'NCD_BMI_30A', name: 'Prevalence of obesity among adults', unit: '%', sourceId: whoId, category: 'health', sdgGoal: 3 },
    { code: 'WHS4_100', name: 'Physicians density (per 10000 population)', unit: 'per 10000', sourceId: whoId, category: 'health', sdgGoal: 3 },

    // UNICEF indicators
    { code: 'CME_MRY0', name: 'Under-five mortality rate', unit: 'per 1000', sourceId: unicefId, category: 'health', sdgGoal: 3 },
    { code: 'EDU_CR_L1', name: 'Primary school completion rate', unit: '%', sourceId: unicefId, category: 'education', sdgGoal: 4 },

    // UN SDG indicators
    { code: 'SG_GEN_PARL', name: 'Proportion of seats held by women in national parliaments', unit: '%', sourceId: unSdgId, category: 'governance', sdgGoal: 5 },
    { code: 'EG_ELC_ACCS', name: 'Proportion of population with access to electricity', unit: '%', sourceId: unSdgId, category: 'infrastructure', sdgGoal: 7 },
    { code: 'EN_LND_SLUM', name: 'Proportion of urban population living in slums', unit: '%', sourceId: unSdgId, category: 'demographics', sdgGoal: 11 },

    // FAO indicators
    { code: 'FAOSTAT_FBS_FP', name: 'Prevalence of undernourishment', unit: '%', sourceId: faoId, category: 'health', sdgGoal: 2 },
    { code: 'FAOSTAT_RL_AL', name: 'Agricultural land (% of land area)', unit: '%', sourceId: faoId, category: 'environment', sdgGoal: 15 },
    { code: 'FAOSTAT_FT_FI', name: 'Food production index', unit: 'index', sourceId: faoId, category: 'economy', sdgGoal: 2 },
  ];
  const insertedIndicators = await db.insert(indicators).values(indicatorValues).returning();
  console.log('  Created 20 indicators');

  // 4. Create indicator data: 3 countries x 10 years x 5 indicators = 150 data points
  const countries = ['USA', 'IND', 'BRA'];
  const years = Array.from({ length: 10 }, (_, i) => 2014 + i); // 2014-2023
  const selectedIndicators = insertedIndicators.slice(0, 5);

  // Realistic value ranges per indicator
  const valueRanges: Record<string, Record<string, { base: number; variance: number }>> = {
    'NY.GDP.MKTP.CD': {
      USA: { base: 17_000_000_000_000, variance: 2_000_000_000_000 },
      IND: { base: 2_000_000_000_000, variance: 500_000_000_000 },
      BRA: { base: 1_800_000_000_000, variance: 300_000_000_000 },
    },
    'NY.GDP.PCAP.CD': {
      USA: { base: 55000, variance: 10000 },
      IND: { base: 1800, variance: 500 },
      BRA: { base: 9000, variance: 2000 },
    },
    'SP.POP.TOTL': {
      USA: { base: 320_000_000, variance: 10_000_000 },
      IND: { base: 1_300_000_000, variance: 100_000_000 },
      BRA: { base: 205_000_000, variance: 10_000_000 },
    },
    'SP.DYN.LE00.IN': {
      USA: { base: 78, variance: 2 },
      IND: { base: 68, variance: 3 },
      BRA: { base: 74, variance: 2 },
    },
    'SE.ADT.LITR.ZS': {
      USA: { base: 99, variance: 0.5 },
      IND: { base: 72, variance: 5 },
      BRA: { base: 92, variance: 2 },
    },
  };

  const dataPoints: Array<{
    indicatorId: string;
    countryCode: string;
    year: number;
    value: number;
    recordedAt: Date;
  }> = [];

  for (const indicator of selectedIndicators) {
    const ranges = valueRanges[indicator.code];
    if (!ranges) continue;

    for (const country of countries) {
      const range = ranges[country];
      if (!range) continue;

      for (let i = 0; i < years.length; i++) {
        const yearVal = years[i]!;
        // Simulate growth trend with some noise
        const trend = (i / years.length) * range.variance * 0.5;
        const noise = (Math.random() - 0.5) * range.variance * 0.2;
        const value = Math.round((range.base + trend + noise) * 100) / 100;

        dataPoints.push({
          indicatorId: indicator.id,
          countryCode: country,
          year: yearVal,
          value,
          recordedAt: new Date(`${yearVal}-06-15T00:00:00Z`),
        });
      }
    }
  }

  await db.insert(indicatorData).values(dataPoints);
  console.log(`  Created ${dataPoints.length} indicator data points`);

  // 5. Create 2 proposals
  await db.insert(proposals).values([
    {
      title: 'GDP Growth vs Life Expectancy Correlation',
      description:
        'Investigate whether countries with higher GDP growth rates show corresponding improvements in life expectancy over the 2014-2023 period. This could validate the relationship between economic development and health outcomes.',
      indicatorAId: insertedIndicators[0]!.id,
      indicatorBId: insertedIndicators[3]!.id,
      hypothesis:
        'Countries with sustained GDP growth above 3% annually will show measurable increases in life expectancy within the same decade.',
      status: 'SUBMITTED',
      authorId: testUser!.id,
    },
    {
      title: 'Education Spending and Literacy Rates',
      description:
        'Analyze the relationship between adult literacy rates and GDP per capita to understand how economic prosperity translates into educational outcomes across different regions.',
      indicatorAId: insertedIndicators[1]!.id,
      indicatorBId: insertedIndicators[4]!.id,
      hypothesis:
        'Higher GDP per capita correlates positively with adult literacy rates, with a threshold effect above $5,000 per capita.',
      status: 'DRAFT',
      authorId: testUser!.id,
    },
  ]);
  console.log('  Created 2 proposals');

  // 6. Create 10 news items
  const newsValues = [
    {
      title: 'World Bank Reports Record Growth in Sub-Saharan Africa',
      url: 'https://example.com/news/wb-ssa-growth',
      source: 'World Bank',
      summary: 'Sub-Saharan Africa experienced its highest growth rates in a decade.',
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'WHO Launches New Global Health Initiative',
      url: 'https://example.com/news/who-health-initiative',
      source: 'WHO',
      summary: 'The World Health Organization announced a new initiative to improve healthcare access.',
      publishedAt: new Date('2024-02-01'),
    },
    {
      title: 'UNICEF Report: Progress on Child Mortality',
      url: 'https://example.com/news/unicef-child-mortality',
      source: 'UNICEF',
      summary: 'Child mortality rates have declined significantly over the past decade.',
      publishedAt: new Date('2024-02-15'),
    },
    {
      title: 'UN SDG Progress Report 2024 Released',
      url: 'https://example.com/news/un-sdg-2024',
      source: 'United Nations',
      summary: 'The annual progress report shows mixed results across the 17 SDGs.',
      publishedAt: new Date('2024-03-01'),
    },
    {
      title: 'FAO: Global Food Prices Stabilize',
      url: 'https://example.com/news/fao-food-prices',
      source: 'FAO',
      summary: 'Global food prices have stabilized after two years of volatility.',
      publishedAt: new Date('2024-03-15'),
    },
    {
      title: 'Climate Action: COP29 Commitments Analysis',
      url: 'https://example.com/news/cop29-analysis',
      source: 'Climate Analytics',
      summary: 'Analysis of climate commitments made at COP29 and their projected impact.',
      publishedAt: new Date('2024-04-01'),
    },
    {
      title: 'Global Literacy Rates Continue to Rise',
      url: 'https://example.com/news/literacy-rates',
      source: 'UNESCO',
      summary: 'Worldwide adult literacy rates have reached 87%, up from 83% a decade ago.',
      publishedAt: new Date('2024-04-15'),
    },
    {
      title: 'Renewable Energy Investment Hits Record High',
      url: 'https://example.com/news/renewable-investment',
      source: 'IRENA',
      summary: 'Global investment in renewable energy reached $500 billion in 2023.',
      publishedAt: new Date('2024-05-01'),
    },
    {
      title: 'Water Scarcity Threatens 2 Billion People',
      url: 'https://example.com/news/water-scarcity',
      source: 'UN Water',
      summary: 'A new report warns that water scarcity will affect over 2 billion people by 2030.',
      publishedAt: new Date('2024-05-15'),
    },
    {
      title: 'Digital Divide Narrowing in Developing Countries',
      url: 'https://example.com/news/digital-divide',
      source: 'ITU',
      summary: 'Internet penetration in developing countries has doubled in the last five years.',
      publishedAt: new Date('2024-06-01'),
    },
  ];
  await db.insert(newsItems).values(newsValues);
  console.log('  Created 10 news items');

  console.log('Seeding complete!');
  await pool.end();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
