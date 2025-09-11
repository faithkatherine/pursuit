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
  location: string;
  amount?: number;
}

// Unified Category interface
export interface Category {
  id: string;
  name: string;
  emoji: string;
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
