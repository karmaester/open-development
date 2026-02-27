/**
 * Normalize various year formats to a numeric year.
 *
 * Handles:
 *   - Plain year: "2023" → 2023
 *   - ISO date: "2023-01-15" → 2023
 *   - ISO datetime: "2023-01-15T00:00:00Z" → 2023
 *   - Fiscal year: "FY2023" → 2023
 *   - Range: "2022/2023" → 2023 (end year)
 *   - Range with dash: "2022-23" → 2023
 *
 * @param input - Year string in various formats
 * @returns Numeric year, or null if unparseable
 */
export function normalizeYear(input: string | number): number | null {
  if (typeof input === 'number') {
    return input >= 1900 && input <= 2100 ? input : null;
  }

  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // Plain 4-digit year
  const plainMatch = trimmed.match(/^(\d{4})$/);
  if (plainMatch) {
    const year = parseInt(plainMatch[1]!, 10);
    return year >= 1900 && year <= 2100 ? year : null;
  }

  // ISO date or datetime: "2023-01-15" or "2023-01-15T..."
  const isoMatch = trimmed.match(/^(\d{4})-\d{2}-\d{2}/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]!, 10);
    return year >= 1900 && year <= 2100 ? year : null;
  }

  // Fiscal year: "FY2023" or "FY 2023"
  const fyMatch = trimmed.match(/^FY\s*(\d{4})$/i);
  if (fyMatch) {
    const year = parseInt(fyMatch[1]!, 10);
    return year >= 1900 && year <= 2100 ? year : null;
  }

  // Range with slash: "2022/2023" (return end year)
  const slashMatch = trimmed.match(/^\d{4}\/(\d{4})$/);
  if (slashMatch) {
    const year = parseInt(slashMatch[1]!, 10);
    return year >= 1900 && year <= 2100 ? year : null;
  }

  // Range with dash: "2022-23" (return end year, inferring century)
  const dashMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (dashMatch) {
    const century = dashMatch[1]!.slice(0, 2);
    const year = parseInt(`${century}${dashMatch[2]}`, 10);
    return year >= 1900 && year <= 2100 ? year : null;
  }

  return null;
}
