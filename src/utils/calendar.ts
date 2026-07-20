import { addDays, toDateStr } from './date';

export interface CalendarDay {
  date: string; // yyyy-mm-dd
  inCurrentMonth: boolean;
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Builds a Sun-Sat grid of weeks covering the given month, padded with adjacent-month days so every week is full. */
export function getMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = toDateStr(new Date(year, month, 1));
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7;

  const cells: CalendarDay[] = [];
  let cursor = addDays(firstOfMonth, -startOffset);
  for (let i = 0; i < totalCells; i++) {
    const cursorMonth = Number(cursor.split('-')[1]) - 1;
    cells.push({ date: cursor, inCurrentMonth: cursorMonth === month });
    cursor = addDays(cursor, 1);
  }
  return cells;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
