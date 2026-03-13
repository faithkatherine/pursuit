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

export interface Recommendation {
  id: string;
  image: string;
  title: string;
  date: string;
  locationName: string;
  amount?: number;
}

// Unified Category interface
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Unified BucketItem interface
export interface BucketItem {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  image: string;
  completed: boolean;
  categoryId: string;
  category?: Category;
}

export interface HomeData {
  id: string;
  greeting: string;
  timeOfDay: string;
  weather: Weather;
  insights: InsightsData;
  bucketCategories: Category[];
  recommendations: Recommendation[];
  upcoming: BucketItem[];
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  image?: string;
  date: string;
  endDate?: string;
  locationName?: string;
  isFree: boolean;
  isSaved: boolean;
  category: Category[];
}

export interface EventsListPayload {
  ok: boolean;
  events: Event[];
}

export interface Emoji {
  symbol: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthPayload {
  user: User;
  token?: string;
}

// Query response types
export interface GetInsightsDataQuery {
  getInsightsData: InsightsData;
}

export interface GetRecommendationsQuery {
  getRecommendations: Recommendation[];
}

export interface GetHomeQuery {
  getHome: HomeData;
}

export interface GetBucketItemsQuery {
  getBucketItems: BucketItem[];
}

export interface GetBucketCategoriesQuery {
  getBucketCategories: Category[];
}

export interface GetEventsQuery {
  events: EventsListPayload;
}

export interface GetSavedEventsQuery {
  savedEvents: EventsListPayload;
}

export interface GetEmojiLibraryQuery {
  getEmojiLibrary: Emoji[];
}

// Mutation response types
export interface SignInMutation {
  signIn: AuthPayload;
}

export interface SignUpMutation {
  signUp: AuthPayload;
}

export interface AddBucketCategoryMutation {
  addBucketCategory: Category;
}

export interface AddBucketItemMutation {
  addBucketItem: BucketItem;
}
