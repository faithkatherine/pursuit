import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Event {
    id: ID!
    image: String!
    title: String!
    date: String!
    location: String!
  }
  type Weather {
    city: String!
    condition: String!
    temperature: Int!
  }

  type Destination {
    location: String!
    daysAway: Int!
  }

  type Progress {
    completed: Int!
    yearlyGoal: Int!
    percentage: Float!
  }

  type Category {
    id: ID!
    name: String!
    emoji: String!
  }

  type BucketItem {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    categoryId: String
    category: Category
  }

  type Activity {
    id: ID!
    activity: String!
    image: String!
    category: String!
    date: String!
    location: String!
  }

  type InsightsData {
    id: ID!
    weather: Weather!
    nextDestination: Destination!
    progress: Progress!
    recentAchievement: String!
  }

  type HomeData {
    id: ID!
    greeting: String!
    timeOfDay: String!
    weather: Weather!
    insights: InsightsData!
    bucketCategories(offset: Int = 0, limit: Int = 10): [Category!]!
    recommendations(offset: Int = 0, limit: Int = 10): [Event!]!
    upcoming(offset: Int = 0, limit: Int = 10): [Activity!]!
  }

  type Emoji {
    symbol: String!
    description: String!
  }

  type Query {
    getInsightsData: InsightsData!
    getEvents: [Event!]!
    getHome: HomeData!
    getCategories: [Category!]!
    getBucketCategories: [Category!]!
    getRecommendations(offset: Int = 0, limit: Int = 10): [Event!]!
    getEmojiLibrary: [Emoji!]!
  }

  type Mutation {
    updateProgress(completed: Int!): Progress!
    addAchievement(achievement: String!): InsightsData!
    addBucketCategory(name: String!, emoji: String!): Category!
    addBucketItem(
      title: String!
      description: String
      categoryId: String
      newCategoryName: String
      newCategoryEmoji: String
    ): BucketItem!
  }
`;
