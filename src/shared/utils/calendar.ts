/**
 * Calendar utilities for date selection
 */

/**
 * Check if two dates are on the same day
 */
export const isSameDay = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

/**
 * Format a date for display in filter chip
 */
export const formatDateLabel = (date: Date | null): string => {
  if (!date) return "Pick a date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Get month title for calendar header
 */
export const getMonthTitle = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

/**
 * Generate calendar days for a given month
 * Returns array with null for empty leading days
 */
export const getCalendarDays = (monthDate: Date): Array<Date | null> => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();

  const days: Array<Date | null> = Array.from(
    { length: leadingEmptyDays },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
};
