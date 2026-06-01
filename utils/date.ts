/**
 * Format an event date string for display.
 *
 * @param dateStr  – ISO / parseable date string
 * @param options  – Intl.DateTimeFormat options (defaults to month, day, year)
 */
export function formatEventDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): { formattedDate: string; formattedTime: string } | string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return {
    formattedDate: date.toLocaleDateString("en-US", options),
    formattedTime: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * Calculate the duration between two dates in days.
 * Returns null if the duration is 1 day or less.
 *
 * @param startDate – Start date string
 * @param endDate – End date string
 * @returns Duration string (e.g., "2 days") or null
 */
export function calculateEventDuration(
  startDate: string,
  endDate?: string | null,
): number | null {
  if (!endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return days > 1 ? days : null;
}
