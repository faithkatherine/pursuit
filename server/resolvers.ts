import { mockData, emojiLibrary } from "./mockData";
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
    getEmojiLibrary: () => {
      return emojiLibrary;
    },
    getBucketCategories: () => {
      return mockData.bucketCategories;
    },
  },
  Mutation: {
    addBucketCategory: (
      _: any,
      { name, emoji }: { name: string; emoji: string }
    ) => {
      const newId = (mockData.bucketCategories.length + 1).toString();
      const newCategory = {
        id: newId,
        name,
        emoji,
      };
      mockData.bucketCategories.push(newCategory);
      return newCategory;
    },
    addBucketItem: (
      _: any,
      {
        title,
        description,
        categoryId,
        newCategoryName,
        newCategoryEmoji,
      }: {
        title: string;
        description?: string;
        categoryId?: string;
        newCategoryName?: string;
        newCategoryEmoji?: string;
      }
    ) => {
      let finalCategoryId = categoryId;

      // If creating a new category
      if (newCategoryName && newCategoryEmoji && !categoryId) {
        const newCategoryId = (mockData.bucketCategories.length + 1).toString();
        const newCategory = {
          id: newCategoryId,
          name: newCategoryName,
          emoji: newCategoryEmoji,
        };
        mockData.bucketCategories.push(newCategory);
        finalCategoryId = newCategoryId;
      }

      const newItemId = (mockData.bucketItems.length + 1).toString();
      const newItem = {
        id: newItemId,
        title,
        description: description || "",
        completed: false,
        categoryId: finalCategoryId,
      };

      mockData.bucketItems.push(newItem);
      return newItem;
    },
  },
  BucketItem: {
    category: (parent: any) => {
      if (!parent.categoryId) return null;
      return mockData.bucketCategories.find(cat => cat.id === parent.categoryId);
    },
  },
};
