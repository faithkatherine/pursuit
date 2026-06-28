import { InMemoryCache } from "@apollo/client";

export const createApolloCache = () =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getHome: {
            keyArgs: ["neighborhoodId", "timeFilter"],
            merge(_existing, incoming) {
              return incoming;
            },
          },
          getEvents: {
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              const { offset = 0 } = args || {};
              const merged = existing ? existing.slice() : [];

              for (let index = 0; index < incoming.length; ++index) {
                merged[offset + index] = incoming[index];
              }

              return merged;
            },
          },
          getBucketCategories: {
            merge(existing = [], incoming) {
              const existingIds = new Set(existing.map((item: { id: string }) => item.id));
              const newItems = incoming.filter(
                (item: { id: string }) => !existingIds.has(item.id),
              );
              return [...existing, ...newItems];
            },
          },
          getCategories: {
            merge(existing = [], incoming) {
              const existingIds = new Set(existing.map((item: { id: string }) => item.id));
              const newItems = incoming.filter(
                (item: { id: string }) => !existingIds.has(item.id),
              );
              return [...existing, ...newItems];
            },
          },
          getBucketItems: {
            keyArgs: ["categoryId"],
            merge(existing = [], incoming, { args }) {
              const { offset = 0 } = args || {};
              const merged = existing ? existing.slice() : [];

              for (let index = 0; index < incoming.length; ++index) {
                merged[offset + index] = incoming[index];
              }

              return merged;
            },
          },
          getEmojiLibrary: {
            merge(_existing = [], incoming) {
              return incoming;
            },
          },
          upcomingPlans: {
            keyArgs: ["offset", "limit"],
            merge(_existing, incoming) {
              return incoming;
            },
          },
          pastPlans: {
            keyArgs: ["offset", "limit"],
            merge(_existing, incoming) {
              return incoming;
            },
          },
          savedEvents: {
            keyArgs: ["offset", "limit"],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Category: {
        fields: {
          name: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          emoji: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      BucketItem: {
        fields: {
          completed: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          amount: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          title: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          description: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      HomeData: {
        fields: {
          greeting: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          timeOfDay: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          weather: {
            merge(existing, incoming) {
              return { ...existing, ...incoming };
            },
          },
          categories: {
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              const { offset = 0 } = args || {};
              const merged = existing ? existing.slice() : [];

              for (let index = 0; index < incoming.length; ++index) {
                merged[offset + index] = incoming[index];
              }

              return merged;
            },
          },
          recommendations: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });
