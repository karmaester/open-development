'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/lib/format';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];

interface DataPoint {
  year: number;
  [country: string]: number;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  countries: string[];
  unit?: string;
}

export function TimeSeriesChart({ data, countries, unit }: TimeSeriesChartProps) {
  if (data.length === 0) return <p className="py-8 text-center text-muted-foreground">No data</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(v: number) => formatNumber(v, 0)} />
        <Tooltip
          formatter={(value: number) => [
            `${formatNumber(value)}${unit ? ` ${unit}` : ''}`,
            undefined,
          ]}
        />
        <Legend />
        {countries.map((country, i) => (
          <Line
            key={country}
            type="monotone"
            dataKey={country}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
