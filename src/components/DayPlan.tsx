import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { LogEntry, MealType } from '../types';
import { addMacros, emptyMacros, logEntryMacros } from '../utils/macros';
import { describeLogEntry } from '../utils/logEntry';
import { MEAL_TYPE_ORDER } from '../utils/mealTime';
import MacroSummary from './MacroSummary';
import MacroBadges from './MacroBadges';
import Modal from './Modal';
import AddLogEntryForm from './AddLogEntryForm';

/** Renders the macro summary + per-meal-time entries (with add/remove) for a single date. Shared by the daily Log and the calendar Planner's day-detail view. */
export default function DayPlan({ date, showSummary = true }: { date: string; showSummary?: boolean }) {
  const [addingFor, setAddingFor] = useState<MealType | null>(null);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);

  const log = useAppStore((s) => s.log);
  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);
  const macroTargets = useAppStore((s) => s.macroTargets);
  const addLogEntry = useAppStore((s) => s.addLogEntry);
  const updateLogEntry = useAppStore((s) => s.updateLogEntry);
  const removeLogEntry = useAppStore((s) => s.removeLogEntry);

  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const mealsById = useMemo(() => new Map(meals.map((m) => [m.id, m])), [meals]);

  const entriesForDay = useMemo(() => log.filter((l) => l.date === date), [log, date]);

  const dayTotals = useMemo(
    () => entriesForDay.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros()),
    [entriesForDay, foodsById, mealsById]
  );

  return (
    <div className="space-y-4">
      {showSummary && <MacroSummary totals={dayTotals} targets={macroTargets} />}

      <div className="space-y-4">
        {MEAL_TYPE_ORDER.map((mealType) => {
          const entries = entriesForDay.filter((e) => e.mealType === mealType);
          const mealTotals = entries.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros());
          return (
            <div key={mealType} className="rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{mealType}</h3>
                  {entries.length > 0 && <span className="text-xs text-subtle">{Math.round(mealTotals.calories)} kcal</span>}
                </div>
                <button
                  onClick={() => setAddingFor(mealType)}
                  className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {entries.length === 0 ? (
                <p className="px-4 py-3 text-sm text-subtle">Nothing logged yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {entries.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingEntry(entry)}
                        className="min-w-0 flex-1 rounded text-left hover:opacity-70"
                      >
                        <p className="truncate text-sm">{describeLogEntry(entry, foodsById, mealsById)}</p>
                        <div className="mt-1">
                          <MacroBadges macros={logEntryMacros(entry, foodsById, mealsById)} />
                        </div>
                      </button>
                      <button
                        onClick={() => removeLogEntry(entry.id)}
                        className="shrink-0 rounded p-1 text-stone-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                        aria-label="Remove entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {addingFor && (
        <Modal title={`Add to ${addingFor}`} onClose={() => setAddingFor(null)}>
          <AddLogEntryForm
            date={date}
            defaultMealType={addingFor}
            onSubmit={(entry) => {
              addLogEntry(entry);
              setAddingFor(null);
            }}
            onCancel={() => setAddingFor(null)}
          />
        </Modal>
      )}

      {editingEntry && (
        <Modal title="Edit entry" onClose={() => setEditingEntry(null)}>
          <AddLogEntryForm
            date={date}
            defaultMealType={editingEntry.mealType}
            initial={editingEntry}
            onSubmit={(entry) => {
              updateLogEntry(editingEntry.id, entry);
              setEditingEntry(null);
            }}
            onCancel={() => setEditingEntry(null)}
          />
        </Modal>
      )}
    </div>
  );
}
