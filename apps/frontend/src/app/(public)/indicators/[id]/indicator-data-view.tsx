'use client';

import { useMemo } from 'react';
import { TimeSeriesChart } from '@/components/charts/time-series-chart';
import { formatCountryName, formatNumber } from '@/lib/format';

interface DataPoint {
  countryCode: string;
  year: number;
  value: number;
}

interface IndicatorDataViewProps {
  data: DataPoint[];
  unit?: string | null;
}

export function IndicatorDataView({ data, unit }: IndicatorDataViewProps) {
  const { chartData, countries } = useMemo(() => {
    const countrySet = new Set<string>();
    const yearMap = new Map<number, { year: number; [country: string]: number }>();

    for (const point of data) {
      countrySet.add(point.countryCode);
      const existing = yearMap.get(point.year) || { year: point.year };
      existing[point.countryCode] = point.value;
      yearMap.set(point.year, existing);
    }

    const sorted = Array.from(yearMap.values()).sort((a, b) => (a as any).year - (b as any).year);

    return {
      chartData: sorted,
      countries: Array.from(countrySet).map((code) => formatCountryName(code)),
    };
  }, [data]);

  if (data.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No data available</p>;
  }

  return (
    <div>
      <TimeSeriesChart data={chartData} countries={countries} unit={unit ?? undefined} />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((point, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2">{formatCountryName(point.countryCode)}</td>
                <td className="px-4 py-2">{point.year}</td>
                <td className="px-4 py-2 text-right">{formatNumber(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
