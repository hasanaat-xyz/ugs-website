const MS_PER_DAY = 86400000;

export function toDateOnly(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysBetween(start, end) {
  const s = toDateOnly(start);
  const e = toDateOnly(end);
  return Math.max(1, Math.round((e - s) / MS_PER_DAY) + 1);
}

export function datesOverlap(aStart, aEnd, bStart, bEnd) {
  return toDateOnly(aStart) <= toDateOnly(bEnd) && toDateOnly(bStart) <= toDateOnly(aEnd);
}

export function addDays(date, days) {
  const d = toDateOnly(date);
  d.setDate(d.getDate() + days);
  return d;
}
