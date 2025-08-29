import { gql } from "@apollo/client";

export const WEATHER_FRAGMENT = gql`
  fragment WeatherInfo on Weather {
    city
    condition
    temperature
  }
`;

export const UPCOMING_DESTINATION_FRAGMENT = gql`
  fragment DestinationInfo on Destination {
    location
    daysAway
  }
`;

export const BUCKET_LIST_PROGRESS_FRAGMENT = gql`
  fragment ProgressInfo on Progress {
    completed
    yearlyGoal
    percentage
  }
`;

export const BUCKET_CATEGORY_FRAGMENT = gql`
  fragment CategoryInfo on Category {
    id
    name
    emoji
  }
`;

export const BUCKET_CATEGORY_ITEMS_FRAGMENT = gql`
  fragment CategoryItemsInfo on Category {
    id
    name
    emoji
    items {
      id
      title
      description
      completed
    }
  }
`;

export const EVENT_RECOMMENDATION_FRAGMENT = gql`
  fragment RecommendationInfo on Event {
    id
    image
    title
    date
    location
  }
`;

export const ACTIVITY_FRAGMENT = gql`
  fragment ActivityInfo on Activity {
    id
    activity
    image
    category
    date
    location
  }
`;

export const INSIGHTS_FRAGMENT = gql`
  fragment InsightsInfo on InsightsData {
    id
    weather {
      ...WeatherInfo
    }
    nextDestination {
      ...DestinationInfo
    }
    progress {
      ...ProgressInfo
    }
    recentAchievement
  }
  ${WEATHER_FRAGMENT}
  ${UPCOMING_DESTINATION_FRAGMENT}
  ${BUCKET_LIST_PROGRESS_FRAGMENT}
`;
