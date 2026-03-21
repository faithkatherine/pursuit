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
): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", options);
}
