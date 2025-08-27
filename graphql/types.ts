export interface Weather {
  city: string;
  condition: string;
  temperature: number;
}

export interface NextDestination {
  location: string;
  daysAway: number;
}

export interface Progress {
  remaining?: number;
  completed: number;
  yearlyGoal: number;
  percentage: number;
}

export interface InsightsData {
  id: string;
  weather: Weather;
  nextDestination: NextDestination;
  progress: Progress;
  recentAchievement: string;
}

export interface GetInsightsDataQuery {
  getInsightsData: InsightsData;
}

export interface GetEventsQuery {
  getEvents: Event[];
}

export interface Event {
  id: string;
  image: string;
  title: string;
  date: string;
  location: string;
}
