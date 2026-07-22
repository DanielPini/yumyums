import { addDays } from './date';

/** Monday..Sunday dates (yyyy-mm-dd) for the week containing `dateStr`. */
export function getWeekDates(dateStr: string): string[] {
  const [y, m, d] = dateStr.split('-').map(Number);
  const jsDay = new Date(y, m - 1, d).getDay(); // 0=Sun..6=Sat
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = addDays(dateStr, mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function partsOf(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { y, m, d, date: new Date(y, m - 1, d) };
}

/** A compact human range for a Monday..Sunday week, e.g. "Jul 20-26, 2026" or "Jul 28 - Aug 3, 2026". */
export function weekRangeLabel(weekDates: string[]): string {
  const start = partsOf(weekDates[0]);
  const end = partsOf(weekDates[6]);
  const startMonth = start.date.toLocaleDateString(undefined, { month: 'short' });
  const endMonth = end.date.toLocaleDateString(undefined, { month: 'short' });

  if (start.y !== end.y) {
    return `${startMonth} ${start.d}, ${start.y} - ${endMonth} ${end.d}, ${end.y}`;
  }
  if (start.m !== end.m) {
    return `${startMonth} ${start.d} - ${endMonth} ${end.d}, ${start.y}`;
  }
  return `${startMonth} ${start.d}-${end.d}, ${start.y}`;
}

export function dayLabel(dateStr: string): string {
  const { date } = partsOf(dateStr);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export function dayNumber(dateStr: string): number {
  return Number(dateStr.slice(8, 10));
}
