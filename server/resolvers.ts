import { mockData } from "./mockData";
import { HomeData } from "../graphql/types";

export const resolvers = {
  Query: {
    getInsightsData: () => {
      return mockData.insights;
    },
    getEvents: () => {
      return mockData.upcomingEvents;
    },
    getHome: (
      _: any,
      { offset = 0, limit = 10 }: { offset: number; limit: number }
    ): HomeData => {
      const currentHour = new Date().getHours();
      let timeOfDay = "morning";
      let greeting = "Good morning";

      if (currentHour >= 12 && currentHour < 17) {
        timeOfDay = "afternoon";
        greeting = "Good afternoon";
      } else if (currentHour >= 17) {
        timeOfDay = "evening";
        greeting = "Good evening";
      }

      return {
        id: "home-1",
        greeting: `${greeting}, ${mockData.user.name}`,
        timeOfDay,
        weather: mockData.insights.weather,
        insights: mockData.insights,
        bucketCategories: mockData.bucketCategories.slice(
          offset,
          offset + limit
        ),
        recommendations: mockData.upcomingEvents.slice(offset, offset + limit),
        upcoming: mockData.upcomingActivities.slice(offset, offset + limit),
      };
    },
  },
};
