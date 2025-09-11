import { mockData, emojiLibrary } from "./mockData";
import { HomeData } from "../graphql/types";

// Mock user database - in a real app, this would be a proper database
const mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}> = [];

export const resolvers = {
  Query: {
    getInsightsData: () => {
      return mockData.insights;
    },
    getRecommendations: () => {
      return mockData.recommendations;
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
        recommendations: mockData.recommendations.slice(offset, offset + limit),
        upcoming: mockData.bucketItems
          .slice(offset, offset + limit)
          .map((item) => ({
            ...item,
            category:
              mockData.bucketCategories.find(
                (cat) => cat.id === item.categoryId
              ) || mockData.bucketCategories[0],
          })),
      };
    },
    getBucketItems: (
      _: any,
      {
        categoryId,
        offset = 0,
        limit = 100,
      }: { categoryId?: string; offset?: number; limit?: number }
    ) => {
      let items = mockData.bucketItems;

      // Filter by category if provided
      if (categoryId) {
        items = items.filter((item) => item.categoryId === categoryId);
      }

      return items.slice(offset, offset + limit).map((item) => ({
        ...item,
        category:
          mockData.bucketCategories.find((cat) => cat.id === item.categoryId) ||
          mockData.bucketCategories[0],
      }));
    },
    getEmojiLibrary: () => {
      return emojiLibrary;
    },
    getBucketCategories: () => {
      return mockData.bucketCategories;
    },
  },
  Mutation: {
    signIn: (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      // Mock authentication - in a real app, use proper password hashing
      const user = mockUsers.find((u) => u.email === email);

      if (!user || password.length < 6) {
        throw new Error("Invalid credentials");
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token: `mock-token-${user.id}`, // In a real app, use JWT
      };
    },

    signUp: (
      _: any,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      // Check if user already exists
      if (mockUsers.find((u) => u.email === email)) {
        throw new Error("User already exists with this email");
      }

      if (!name || !email || password.length < 6) {
        throw new Error("Invalid input data");
      }

      const newUser = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        password, // In a real app, hash this password
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      };

      mockUsers.push(newUser);

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        },
        token: `mock-token-${newUser.id}`, // In a real app, use JWT
      };
    },
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
        amount,
        image,
        categoryId,
        newCategoryName,
        newCategoryEmoji,
      }: {
        title: string;
        description?: string;
        amount?: number;
        image?: string;
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

      // Ensure we have a categoryId - use first category as default if none provided
      if (!finalCategoryId) {
        finalCategoryId = mockData.bucketCategories[0]?.id || "1";
      }

      const newItemId = (mockData.bucketItems.length + 1).toString();
      const defaultImage =
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800"; // Adventure placeholder
      const newItem = {
        id: newItemId,
        title,
        description: description || "",
        amount: amount || undefined,
        image: image || defaultImage,
        completed: false,
        categoryId: finalCategoryId,
      };

      mockData.bucketItems.push(newItem);
      return {
        ...newItem,
        category:
          mockData.bucketCategories.find((cat) => cat.id === finalCategoryId) ||
          mockData.bucketCategories[0],
      };
    },
  },
  BucketItem: {
    category: (parent: any) => {
      if (!parent.categoryId) return null;
      return mockData.bucketCategories.find(
        (cat) => cat.id === parent.categoryId
      );
    },
  },
};
