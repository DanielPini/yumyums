import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Macros, MacroTargets } from '../types';
import { macroPercentages } from '../utils/macros';

const RING_COLORS = { eaten: '#4c9a37', remaining: '#e7e5e4' };

function ProgressBar({
  label,
  value,
  target,
  unit,
  colorClass,
  pct,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  colorClass: string;
  pct: number | null;
}) {
  const barPct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-stone-600 dark:text-stone-300">{label}</span>
        <span className="text-subtle">
          {Math.round(value * 10) / 10}
          {unit} / {target}
          {unit}
          {pct !== null && <span className="ml-1.5 text-stone-500 dark:text-stone-400">· {pct}% of calories</span>}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${barPct}%` }} />
      </div>
    </div>
  );
}

export default function MacroSummary({ totals, targets }: { totals: Macros; targets: MacroTargets }) {
  const remaining = Math.max(0, targets.calories - totals.calories);
  const data =
    totals.calories === 0
      ? [{ name: 'remaining', value: 1 }]
      : [
          { name: 'eaten', value: totals.calories },
          { name: 'remaining', value: remaining },
        ];

  const pct = macroPercentages(totals);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius="72%" outerRadius="100%" startAngle={90} endAngle={-270} stroke="none">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.name === 'eaten' ? RING_COLORS.eaten : RING_COLORS.remaining} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold leading-none">{Math.round(totals.calories)}</span>
            <span className="text-[10px] text-subtle">of {targets.calories} kcal</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          <ProgressBar label="Protein" value={totals.protein} target={targets.protein} unit="g" colorClass="bg-blue-500" pct={pct.protein} />
          <ProgressBar label="Carbs" value={totals.carbs} target={targets.carbs} unit="g" colorClass="bg-amber-500" pct={pct.carbs} />
          <ProgressBar label="Fat" value={totals.fat} target={targets.fat} unit="g" colorClass="bg-rose-500" pct={pct.fat} />
        </div>
      </div>
    </div>
  );
}
