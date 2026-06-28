import type { TimeFilter } from "@shared/types/time";

export const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "tonight", label: "Tonight" },
  { key: "weekend", label: "This weekend" },
  { key: "next_week", label: "Next week" },
];

export const FILTER_LABELS: Record<TimeFilter, string> = {
  tonight: "tonight",
  weekend: "this weekend",
  next_week: "next week",
};

export function getHoursUntil(dateStr: string): number | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  if (ms < 0) return null;
  return Math.round(ms / (1000 * 60 * 60));
}
