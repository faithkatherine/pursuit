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



export interface HomeData {
  id: string;
  greeting: string;
  timeOfDay: string;
  weather: Weather;
  insights: InsightsData;
  bucketCategories: Category[];
  recommendations: Event[];
  upcoming: BucketItem[];
}

export interface GetHomeQuery {
  getHome: HomeData;
}

export interface GetBucketItemsQuery {
  getBucketItems: BucketItem[];
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
  amount?: number;
  image: string;
  completed: boolean;
  categoryId?: string;
  category: BucketCategory;
}

export interface BucketItemRaw {
  id: string;
  title: string;
  description: string;
  amount?: number;
  image: string;
  completed: boolean;
  categoryId: string;
}

export interface GetEmojiLibraryQuery {
  getEmojiLibrary: Emoji[];
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

export interface SignInMutation {
  signIn: AuthPayload;
}

export interface SignUpMutation {
  signUp: AuthPayload;
}

export interface AddBucketCategoryMutation {
  addBucketCategory: Category;
}
