import { mockData } from "./mockData";

export const resolvers = {
  Query: {
    getInsightsData: () => {
      return mockData.insights;
    },
    getEvents: () => {
      return mockData.upcomingEvents;
    },
  },
};
