import type { Food, LogEntry, Macros, Meal } from '../types';
import { addMacros, emptyMacros, logEntryMacros, macroPercentages, type MacroPercentages } from './macros';

export interface TopMeal {
  meal: Meal;
  count: number;
}

export interface MonthSummary {
  topMeals: TopMeal[];
  totals: Macros;
  avgPct: MacroPercentages;
  daysLogged: number;
  entryCount: number;
}

/** Aggregates a calendar month's log entries: most-logged meals and the overall macro split. */
export function getMonthSummary(
  log: LogEntry[],
  foodsById: Map<string, Food>,
  mealsById: Map<string, Meal>,
  year: number,
  month: number // 0-indexed
): MonthSummary {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEntries = log.filter((e) => e.date.startsWith(prefix));

  const mealCounts = new Map<string, number>();
  for (const entry of monthEntries) {
    if (entry.source.type === 'meal') {
      mealCounts.set(entry.source.mealId, (mealCounts.get(entry.source.mealId) ?? 0) + 1);
    }
  }
  const topMeals: TopMeal[] = [...mealCounts.entries()]
    .map(([mealId, count]) => {
      const meal = mealsById.get(mealId);
      return meal ? { meal, count } : null;
    })
    .filter((x): x is TopMeal => !!x)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totals = monthEntries.reduce<Macros>((acc, e) => addMacros(acc, logEntryMacros(e, foodsById, mealsById)), emptyMacros());

  return {
    topMeals,
    totals,
    avgPct: macroPercentages(totals),
    daysLogged: new Set(monthEntries.map((e) => e.date)).size,
    entryCount: monthEntries.length,
  };
}
