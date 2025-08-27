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

  type NextDestination {
    location: String!
    daysAway: Int!
  }

  type Progress {
    completed: Int!
    yearlyGoal: Int!
    percentage: Float!
  }

  type InsightsData {
    id: ID!
    weather: Weather!
    nextDestination: NextDestination!
    progress: Progress!
    recentAchievement: String!
  }

  type Query {
    getInsightsData: InsightsData!
    getEvents: [Event!]!
  }

  type Mutation {
    updateProgress(completed: Int!): Progress!
    addAchievement(achievement: String!): InsightsData!
  }
`;
