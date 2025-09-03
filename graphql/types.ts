export interface Weather {
  city: string;
  condition: string;
  temperature: number;
}

export interface Destination {
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
  nextDestination: Destination;
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

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Activity {
  id: string;
  activity: string;
  image: string;
  category: string;
  date: string;
  location: string;
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface HomeData {
  id: string;
  greeting: string;
  timeOfDay: string;
  weather: Weather;
  insights: InsightsData;
  bucketCategories: Category[];
  recommendations: Event[];
  upcoming: Activity[];
}

export interface GetHomeQuery {
  getHome: HomeData;
}

export interface Emoji {
  symbol: string;
  description: string;
}

export interface BucketCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface GetBucketCategoriesQuery {
  getBucketCategories: BucketCategory[];
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: BucketCategory;
}

export interface GetEmojiLibraryQuery {
  getEmojiLibrary: Emoji[];
}

export interface AddBucketCategoryMutation {
  addBucketCategory: Category;
}
