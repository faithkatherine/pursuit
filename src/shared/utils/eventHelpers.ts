import colors from "@shared/constants/tokens/colors";

/**
 * Get scarcity badge data based on available tickets.
 * Returns badge text and color for low inventory warnings.
 *
 * @param availableTickets - Number of tickets available (or null/undefined)
 * @returns Badge object with text and color, or null if no badge needed
 */
export function getScarcityBadge(
  availableTickets: number | null | undefined,
): { text: string; color: string } | null {
  if (availableTickets === null || availableTickets === undefined) return null;
  if (availableTickets === 0) return { text: "Sold out", color: colors.shilo };
  if (availableTickets <= 5)
    return {
      text: `${availableTickets} spots left`,
      color: colors.shilo,
    };
  return null;
}

/**
 * Get the appropriate CTA button text based on event ticketing state.
 *
 * @param isSoldOut - Whether the event is sold out
 * @param isFree - Whether the event is free
 * @param price - Event price (0 or null also treated as free)
 * @returns Button text string
 */
export function getTicketButtonText(
  isSoldOut: boolean,
  isFree: boolean,
  price?: number | null,
): string {
  if (isSoldOut) return "Sold out";
  if (isFree || price === 0) return "Register";
  return "Buy ticket";
}
