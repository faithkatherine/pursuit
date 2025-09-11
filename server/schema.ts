import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Recommendation {
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

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type AuthPayload {
    user: User!
    token: String
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
    amount: Float
    image: String!
    completed: Boolean!
    categoryId: String
    category: Category
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
    recommendations(offset: Int = 0, limit: Int = 10): [Recommendation!]!
    upcoming(offset: Int = 0, limit: Int = 10): [BucketItem!]!
  }

  type Emoji {
    symbol: String!
    description: String!
  }

  type Query {
    getInsightsData: InsightsData!
    getHome: HomeData!
    getCategories: [Category!]!
    getBucketCategories: [Category!]!
    getBucketItems(
      categoryId: String
      offset: Int = 0
      limit: Int = 100
    ): [BucketItem!]!
    getRecommendations(offset: Int = 0, limit: Int = 10): [Recommendation!]!
    getEmojiLibrary: [Emoji!]!
  }

  type Mutation {
    # Authentication mutations
    signIn(email: String!, password: String!): AuthPayload!
    signUp(name: String!, email: String!, password: String!): AuthPayload!

    # Existing mutations
    updateProgress(completed: Int!): Progress!
    addAchievement(achievement: String!): InsightsData!
    addBucketCategory(name: String!, emoji: String!): Category!
    addBucketItem(
      title: String!
      description: String
      amount: Float
      image: String
      categoryId: String
      newCategoryName: String
      newCategoryEmoji: String
    ): BucketItem!
  }
`;
