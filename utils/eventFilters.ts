import type { EventInfoFragment } from "graphql/generated/graphql";

/**
 * Filter events by category
 */
export const filterByCategory = (
  events: EventInfoFragment[],
  category: string,
): EventInfoFragment[] => {
  if (category === "All") return events;

  return events.filter((event) =>
    event.category?.some(
      (cat) => cat?.name?.toLowerCase() === category.toLowerCase(),
    ),
  );
};

/**
 * Filter events by date
 */
export const filterByDate = (
  events: EventInfoFragment[],
  dateFilter: string,
): EventInfoFragment[] => {
  if (dateFilter === "Any date") return events;

  const now = new Date();
  const today = now.toDateString();

  switch (dateFilter) {
    case "Today":
      return events.filter(
        (event) => new Date(event.date).toDateString() === today,
      );

    case "This weekend": {
      const dayOfWeek = now.getDay();
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + daysUntilSaturday);
      saturday.setHours(0, 0, 0, 0);

      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      sunday.setHours(23, 59, 59, 999);

      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= saturday && eventDate <= sunday;
      });
    }

    case "This week": {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= endOfWeek;
      });
    }

    case "Next week": {
      const startOfNextWeek = new Date(now);
      startOfNextWeek.setDate(now.getDate() + (7 - now.getDay() + 1));
      startOfNextWeek.setHours(0, 0, 0, 0);

      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      endOfNextWeek.setHours(23, 59, 59, 999);

      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;
      });
    }

    default:
      return events;
  }
};

/**
 * Filter events by location
 */
export const filterByLocation = (
  events: EventInfoFragment[],
  location: string,
): EventInfoFragment[] => {
  if (location === "All areas") return events;

  return events.filter((event) =>
    event.locationName?.toLowerCase().includes(location.toLowerCase()),
  );
};

/**
 * Determine if an event should be featured
 * Featured: first event in list OR has 200+ going
 */
export const isFeaturedEvent = (
  event: EventInfoFragment,
  index: number,
): boolean => {
  return index === 0 || (event.goingCount || 0) >= 200;
};

/**
 * Filter events by specific date
 */
export const filterBySpecificDate = (
  events: EventInfoFragment[],
  date: Date | null,
): EventInfoFragment[] => {
  if (!date) return events;

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
};
