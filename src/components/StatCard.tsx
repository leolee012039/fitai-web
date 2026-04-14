import { Card } from './ui/Card';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  delta?: { value: string; trend: 'up' | 'down' | 'neutral' };
  note?: string;
}

const trendColor: Record<NonNullable<StatCardProps['delta']>['trend'], string> = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-slate-500',
};

const trendArrow: Record<NonNullable<StatCardProps['delta']>['trend'], string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function StatCard({ icon, label, value, unit, delta, note }: StatCardProps) {
  return (
    <Card accentTop className="flex flex-col gap-3 pt-6">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg">
          {icon}
        </div>
        <div className="text-sm text-text-secondary font-medium">{label}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {unit && <div className="text-sm text-text-secondary">{unit}</div>}
      </div>
      {delta ? (
        <div className={`text-xs font-semibold ${trendColor[delta.trend]}`}>
          {delta.value} {trendArrow[delta.trend]}
        </div>
      ) : note ? (
        <div className="text-xs text-text-secondary">{note}</div>
      ) : null}
    </Card>
  );
}
