import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getMonthGrid, monthLabel, WEEKDAY_LABELS } from '../utils/calendar';
import { formatDisplayDate, todayStr } from '../utils/date';
import { addMacros, emptyMacros, logEntryMacros } from '../utils/macros';
import { describeLogEntry } from '../utils/logEntry';
import { currentMealType } from '../utils/mealTime';
import PlannerDayCell from '../components/PlannerDayCell';
import Modal from '../components/Modal';
import AddLogEntryForm from '../components/AddLogEntryForm';
import DayPlan from '../components/DayPlan';
import TargetsModal from '../components/TargetsModal';

export default function PlannerPage() {
  const today = todayStr();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);
  const [quickAddDate, setQuickAddDate] = useState<string | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [editingTargets, setEditingTargets] = useState(false);

  const log = useAppStore((s) => s.log);
  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);
  const addLogEntry = useAppStore((s) => s.addLogEntry);
  const macroTargets = useAppStore((s) => s.macroTargets);
  const setMacroTargets = useAppStore((s) => s.setMacroTargets);

  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const mealsById = useMemo(() => new Map(meals.map((m) => [m.id, m])), [meals]);

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, typeof log>();
    for (const entry of log) {
      const list = map.get(entry.date);
      if (list) list.push(entry);
      else map.set(entry.date, [entry]);
    }
    return map;
  }, [log]);

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function goToThisMonth() {
    setYear(Number(today.slice(0, 4)));
    setMonth(Number(today.slice(5, 7)) - 1);
  }

  const isCurrentMonth = year === Number(today.slice(0, 4)) && month === Number(today.slice(5, 7)) - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="w-44 text-center text-lg font-semibold">{monthLabel(year, month)}</h1>
          <button
            onClick={goToNextMonth}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
          {!isCurrentMonth && (
            <button onClick={goToThisMonth} className="ml-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              This month
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-stone-400 sm:block">Click a day to view/edit · use + to quick-add</p>
          <button
            onClick={() => setEditingTargets(true)}
            className="flex items-center gap-1.5 rounded-md border border-stone-200 px-2.5 py-1.5 text-sm text-stone-500 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
          >
            <Settings2 size={15} /> Goals
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-stone-400 sm:gap-2">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell) => {
          const entries = entriesByDate.get(cell.date) ?? [];
          const totals = entries.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros());
          const entryLabels = entries.map((e) => describeLogEntry(e, foodsById, mealsById));
          return (
            <PlannerDayCell
              key={cell.date}
              dayNumber={Number(cell.date.slice(8, 10))}
              isToday={cell.date === today}
              inCurrentMonth={cell.inCurrentMonth}
              entryLabels={entryLabels}
              totals={totals}
              onAdd={() => setQuickAddDate(cell.date)}
              onOpen={() => setDetailDate(cell.date)}
            />
          );
        })}
      </div>

      {quickAddDate && (
        <Modal title={`Add to ${formatDisplayDate(quickAddDate)}`} onClose={() => setQuickAddDate(null)}>
          <AddLogEntryForm
            date={quickAddDate}
            defaultMealType={currentMealType()}
            onSubmit={(entry) => {
              addLogEntry(entry);
              setQuickAddDate(null);
            }}
            onCancel={() => setQuickAddDate(null)}
          />
        </Modal>
      )}

      {detailDate && (
        <Modal title={formatDisplayDate(detailDate)} onClose={() => setDetailDate(null)}>
          <DayPlan date={detailDate} />
        </Modal>
      )}

      {editingTargets && (
        <TargetsModal
          initial={macroTargets}
          onSave={(t) => {
            setMacroTargets(t);
            setEditingTargets(false);
          }}
          onClose={() => setEditingTargets(false)}
        />
      )}
    </div>
  );
}
