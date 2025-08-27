import { gql } from "@apollo/client";

export const GET_INSIGHTS_DATA = gql`
  query GetInsightsData {
    getInsightsData {
      id
      weather {
        city
        condition
        temperature
      }
      nextDestination {
        location
        daysAway
      }
      progress {
        completed
        yearlyGoal
        percentage
      }
      recentAchievement
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    getEvents {
      id
      image
      title
      date
      location
    }
  }
`;
