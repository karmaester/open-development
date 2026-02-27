/**
 * Country name normalizer: maps common country name aliases to ISO 3166-1 alpha-3 codes.
 *
 * This is a critical utility used across all data connectors to normalize
 * the wildly varying country name formats from different data sources.
 */

const COUNTRY_ALIASES: Record<string, string> = {
  // United States
  'united states': 'USA',
  'united states of america': 'USA',
  'us': 'USA',
  'usa': 'USA',
  'u.s.a.': 'USA',
  'u.s.': 'USA',
  'america': 'USA',

  // United Kingdom
  'united kingdom': 'GBR',
  'united kingdom of great britain and northern ireland': 'GBR',
  'uk': 'GBR',
  'great britain': 'GBR',
  'britain': 'GBR',
  'england': 'GBR',

  // China
  'china': 'CHN',
  'peoples republic of china': 'CHN',
  "people's republic of china": 'CHN',
  'prc': 'CHN',
  'china, people\'s republic of': 'CHN',

  // India
  'india': 'IND',
  'republic of india': 'IND',
  'bharat': 'IND',

  // Germany
  'germany': 'DEU',
  'deutschland': 'DEU',
  'federal republic of germany': 'DEU',

  // France
  'france': 'FRA',
  'french republic': 'FRA',

  // Japan
  'japan': 'JPN',
  'nippon': 'JPN',

  // Brazil
  'brazil': 'BRA',
  'brasil': 'BRA',
  'federative republic of brazil': 'BRA',

  // Russia
  'russia': 'RUS',
  'russian federation': 'RUS',

  // Canada
  'canada': 'CAN',

  // Australia
  'australia': 'AUS',

  // South Korea
  'south korea': 'KOR',
  'republic of korea': 'KOR',
  'korea': 'KOR',
  'korea, rep.': 'KOR',
  'korea, republic of': 'KOR',

  // North Korea
  'north korea': 'PRK',
  'dprk': 'PRK',
  "korea, dem. people's rep.": 'PRK',
  'democratic peoples republic of korea': 'PRK',

  // Mexico
  'mexico': 'MEX',
  'méxico': 'MEX',

  // Indonesia
  'indonesia': 'IDN',

  // Turkey
  'turkey': 'TUR',
  'türkiye': 'TUR',
  'turkiye': 'TUR',

  // Saudi Arabia
  'saudi arabia': 'SAU',

  // South Africa
  'south africa': 'ZAF',

  // Nigeria
  'nigeria': 'NGA',

  // Egypt
  'egypt': 'EGY',
  'egypt, arab rep.': 'EGY',
  'arab republic of egypt': 'EGY',

  // Argentina
  'argentina': 'ARG',

  // Italy
  'italy': 'ITA',
  'italia': 'ITA',

  // Spain
  'spain': 'ESP',
  'españa': 'ESP',

  // Netherlands
  'netherlands': 'NLD',
  'holland': 'NLD',
  'the netherlands': 'NLD',

  // Switzerland
  'switzerland': 'CHE',
  'schweiz': 'CHE',

  // Sweden
  'sweden': 'SWE',
  'sverige': 'SWE',

  // Norway
  'norway': 'NOR',
  'norge': 'NOR',

  // Denmark
  'denmark': 'DNK',
  'danmark': 'DNK',

  // Finland
  'finland': 'FIN',
  'suomi': 'FIN',

  // Poland
  'poland': 'POL',
  'polska': 'POL',

  // Kenya
  'kenya': 'KEN',

  // Ethiopia
  'ethiopia': 'ETH',

  // Tanzania
  'tanzania': 'TZA',
  'united republic of tanzania': 'TZA',
  'tanzania, united republic of': 'TZA',

  // Vietnam
  'vietnam': 'VNM',
  'viet nam': 'VNM',

  // Thailand
  'thailand': 'THA',

  // Philippines
  'philippines': 'PHL',

  // Malaysia
  'malaysia': 'MYS',

  // Singapore
  'singapore': 'SGP',

  // New Zealand
  'new zealand': 'NZL',

  // Colombia
  'colombia': 'COL',

  // Chile
  'chile': 'CHL',

  // Peru
  'peru': 'PER',

  // Iran
  'iran': 'IRN',
  'islamic republic of iran': 'IRN',
  'iran, islamic rep.': 'IRN',

  // Iraq
  'iraq': 'IRQ',

  // Pakistan
  'pakistan': 'PAK',

  // Bangladesh
  'bangladesh': 'BGD',

  // Sri Lanka
  'sri lanka': 'LKA',
  'ceylon': 'LKA',

  // Myanmar
  'myanmar': 'MMR',
  'burma': 'MMR',

  // Côte d'Ivoire
  "côte d'ivoire": 'CIV',
  "cote d'ivoire": 'CIV',
  'ivory coast': 'CIV',

  // Congo
  'congo, dem. rep.': 'COD',
  'democratic republic of the congo': 'COD',
  'dr congo': 'COD',
  'drc': 'COD',
  'congo, rep.': 'COG',
  'republic of the congo': 'COG',

  // Ghana
  'ghana': 'GHA',

  // Morocco
  'morocco': 'MAR',
  'maroc': 'MAR',

  // Uganda
  'uganda': 'UGA',

  // Mozambique
  'mozambique': 'MOZ',

  // Zambia
  'zambia': 'ZMB',

  // Afghanistan
  'afghanistan': 'AFG',

  // Angola
  'angola': 'AGO',

  // Venezuela
  'venezuela': 'VEN',
  'venezuela, rb': 'VEN',

  // Ukraine
  'ukraine': 'UKR',

  // Czech Republic
  'czech republic': 'CZE',
  'czechia': 'CZE',

  // Portugal
  'portugal': 'PRT',

  // Greece
  'greece': 'GRC',
  'hellas': 'GRC',

  // Ireland
  'ireland': 'IRL',
  'éire': 'IRL',

  // Austria
  'austria': 'AUT',
  'österreich': 'AUT',

  // Belgium
  'belgium': 'BEL',
  'belgique': 'BEL',

  // Israel
  'israel': 'ISR',

  // Nepal
  'nepal': 'NPL',

  // Cambodia
  'cambodia': 'KHM',
  'kampuchea': 'KHM',
};

/** Set of all valid ISO alpha-3 codes (derived from alias values). */
const VALID_CODES = new Set(Object.values(COUNTRY_ALIASES));

/** Precomputed alias entries for fuzzy matching. */
const ALIAS_ENTRIES = Object.entries(COUNTRY_ALIASES);

/**
 * Compute Levenshtein edit distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Use single-row optimization
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1, // deletion
        curr[j - 1]! + 1, // insertion
        prev[j - 1]! + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n]!;
}

/**
 * Attempt fuzzy match against known aliases using Levenshtein distance.
 * Returns the ISO alpha-3 code if a close match is found, null otherwise.
 */
function fuzzyMatch(input: string, maxDistance: number = 3): string | null {
  let bestMatch: string | null = null;
  let bestDistance = Infinity;

  for (const [alias, code] of ALIAS_ENTRIES) {
    // Skip aliases that are too different in length
    if (Math.abs(alias.length - input.length) > maxDistance) continue;

    const distance = levenshteinDistance(input, alias);
    if (distance < bestDistance && distance <= maxDistance) {
      bestDistance = distance;
      bestMatch = code;
    }
  }

  return bestMatch;
}

/**
 * Normalize a country name or code to ISO 3166-1 alpha-3.
 *
 * Performs three-stage resolution:
 * 1. Direct alias lookup (case-insensitive, trimmed)
 * 2. ISO alpha-3 passthrough (if already a valid 3-letter code)
 * 3. Fuzzy matching using Levenshtein distance (threshold: 3)
 *
 * @param input - Country name or code in any format
 * @returns ISO 3166-1 alpha-3 code, or null if unrecognized
 */
export function normalizeCountry(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  const cleaned = input.trim().toLowerCase();
  if (cleaned.length === 0) return null;

  // Stage 1: Direct alias lookup
  const directMatch = COUNTRY_ALIASES[cleaned];
  if (directMatch) return directMatch;

  // Stage 2: Check if already a valid ISO alpha-3 code
  const upper = cleaned.toUpperCase();
  if (upper.length === 3 && VALID_CODES.has(upper)) return upper;

  // Stage 3: Fuzzy matching fallback
  return fuzzyMatch(cleaned);
}
