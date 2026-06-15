import { useMemo, useState } from "react";
import type { EventInfoFragment } from "graphql/generated/graphql";
import type { TimeFilter } from "types/time";
import { filterByCategory, filterByDate, filterByLocation } from "utils/eventFilters";
import { TIME_FILTERS } from "utils/timeFilter";

export const HOME_CATEGORY_FILTERS = [
  "All",
  "Concerts & Nightlife",
  "Outdoors & Active",
  "Arts & Culture",
  "Food & Drink",
  "Markets",
  "Wellness",
  "Talks & Workshops",
] as const;

export const HOME_LOCATION_FILTERS = [
  "All areas",
  "Westlands",
  "Kilimani",
  "Karen",
  "CBD",
  "Gigiri",
] as const;

export type HomeCategoryFilter = (typeof HOME_CATEGORY_FILTERS)[number];
export type HomeLocationFilter = (typeof HOME_LOCATION_FILTERS)[number];
export type HomeDateFilter = TimeFilter;

export type HomeFilters = {
  date: HomeDateFilter | null;
  categories: HomeCategoryFilter[];
  locations: HomeLocationFilter[];
};

const DEFAULT_FILTERS: HomeFilters = {
  date: null,
  categories: [],
  locations: [],
};

const toggleValue = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];

const DATE_FILTER_LABELS: Record<HomeDateFilter, string> = {
  tonight: "Today",
  weekend: "This weekend",
  next_week: "Next week",
};

export const useHomeFilters = () => {
  const [filters, setFilters] = useState<HomeFilters>(DEFAULT_FILTERS);

  const dateFilters = useMemo(() => TIME_FILTERS, []);

  const toggleDate = (date: HomeDateFilter) => {
    setFilters((current) => ({
      ...current,
      date: current.date === date ? null : date,
    }));
  };

  const toggleCategory = (category: HomeCategoryFilter) => {
    setFilters((current) => ({
      ...current,
      categories:
        category === "All" ? [] : toggleValue(current.categories, category),
    }));
  };

  const toggleLocation = (location: HomeLocationFilter) => {
    setFilters((current) => ({
      ...current,
      locations:
        location === "All areas" ? [] : toggleValue(current.locations, location),
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filterEvents = (events: EventInfoFragment[]) => {
    let filtered = filters.date
      ? filterByDate(events, DATE_FILTER_LABELS[filters.date])
      : events;
    filters.categories.forEach((category) => {
      filtered = filterByCategory(filtered, category);
    });
    filters.locations.forEach((location) => {
      filtered = filterByLocation(filtered, location);
    });
    return filtered;
  };

  return {
    filters,
    dateFilters,
    categoryFilters: HOME_CATEGORY_FILTERS,
    locationFilters: HOME_LOCATION_FILTERS,
    toggleDate,
    toggleCategory,
    toggleLocation,
    resetFilters,
    filterEvents,
  };
};
