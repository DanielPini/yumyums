import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { addDays, formatDisplayDate, todayStr } from '../utils/date';
import { addMacros, emptyMacros, logEntryMacros } from '../utils/macros';
import { describeLogEntry } from '../utils/logEntry';
import { currentMealType } from '../utils/mealTime';
import { getWeekDates, weekRangeLabel } from '../utils/week';
import WeekDayCard from '../components/WeekDayCard';
import Modal from '../components/Modal';
import AddLogEntryForm from '../components/AddLogEntryForm';
import DayPlan from '../components/DayPlan';
import TargetsModal from '../components/TargetsModal';

export default function PlannerPage() {
  const today = todayStr();
  const [weekAnchor, setWeekAnchor] = useState(today);
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

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const isCurrentWeek = weekDates.includes(today);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, typeof log>();
    for (const entry of log) {
      const list = map.get(entry.date);
      if (list) list.push(entry);
      else map.set(entry.date, [entry]);
    }
    return map;
  }, [log]);

  function goToPrevWeek() {
    setWeekAnchor((d) => addDays(d, -7));
  }

  function goToNextWeek() {
    setWeekAnchor((d) => addDays(d, 7));
  }

  function goToThisWeek() {
    setWeekAnchor(today);
  }

  // 3-column desktop split: Mon-Wed / Thu-Fri / Sat-Sun. 2-column tablet split: weekdays / weekend.
  const desktopColumns = [weekDates.slice(0, 3), weekDates.slice(3, 5), weekDates.slice(5, 7)];
  const tabletColumns = [weekDates.slice(0, 5), weekDates.slice(5, 7)];

  function renderCard(date: string) {
    const entries = entriesByDate.get(date) ?? [];
    const totals = entries.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros());
    const entryLabels = entries.map((e) => describeLogEntry(e, foodsById, mealsById));
    return (
      <WeekDayCard
        key={date}
        date={date}
        isToday={date === today}
        entryLabels={entryLabels}
        totals={totals}
        onAdd={() => setQuickAddDate(date)}
        onOpen={() => setDetailDate(date)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1800px] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="rounded-md p-1.5 text-muted hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-center text-lg font-semibold">{weekRangeLabel(weekDates)}</h1>
          <button
            onClick={goToNextWeek}
            className="rounded-md p-1.5 text-muted hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
          {!isCurrentWeek && (
            <button onClick={goToThisWeek} className="ml-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              This week
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-subtle sm:block">Click a day to view/edit · use + to quick-add</p>
          <button
            onClick={() => setEditingTargets(true)}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <Settings2 size={15} /> Goals
          </button>
        </div>
      </div>

      {/* Mobile: single column, all 7 days stacked. */}
      <div className="flex flex-col gap-3 sm:hidden">{weekDates.map(renderCard)}</div>

      {/* Tablet: 2 columns — weekdays, weekend. */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:hidden">
        {tabletColumns.map((col, i) => (
          <div key={i} className="flex flex-col gap-3">
            {col.map(renderCard)}
          </div>
        ))}
      </div>

      {/* Desktop: 3 columns — Mon-Wed, Thu-Fri, Sat-Sun. */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-3">
        {desktopColumns.map((col, i) => (
          <div key={i} className="flex flex-col gap-3">
            {col.map(renderCard)}
          </div>
        ))}
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
