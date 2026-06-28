export interface Interest {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export const INTERESTS: Interest[] = [
  // Adventure & Travel
  { id: "travel", name: "Travel", emoji: "✈️", category: "Adventure" },
  { id: "hiking", name: "Hiking", emoji: "🥾", category: "Adventure" },
  { id: "camping", name: "Camping", emoji: "🏕️", category: "Adventure" },
  {
    id: "scuba-diving",
    name: "Scuba Diving",
    emoji: "🤿",
    category: "Adventure",
  },
  { id: "skydiving", name: "Skydiving", emoji: "🪂", category: "Adventure" },
  {
    id: "rock-climbing",
    name: "Rock Climbing",
    emoji: "🧗",
    category: "Adventure",
  },

  // Arts & Culture
  { id: "photography", name: "Photography", emoji: "📸", category: "Arts" },
  { id: "painting", name: "Painting", emoji: "🎨", category: "Arts" },
  { id: "music", name: "Music", emoji: "🎵", category: "Arts" },
  { id: "theater", name: "Theater", emoji: "🎭", category: "Arts" },
  { id: "museums", name: "Museums", emoji: "🏛️", category: "Arts" },
  { id: "concerts", name: "Concerts", emoji: "🎤", category: "Arts" },

  // Sports & Fitness
  { id: "running", name: "Running", emoji: "🏃", category: "Fitness" },
  { id: "yoga", name: "Yoga", emoji: "🧘", category: "Fitness" },
  { id: "swimming", name: "Swimming", emoji: "🏊", category: "Fitness" },
  { id: "cycling", name: "Cycling", emoji: "🚴", category: "Fitness" },
  {
    id: "martial-arts",
    name: "Martial Arts",
    emoji: "🥋",
    category: "Fitness",
  },
  { id: "surfing", name: "Surfing", emoji: "🏄", category: "Fitness" },

  // Food & Lifestyle
  { id: "cooking", name: "Cooking", emoji: "👨‍🍳", category: "Lifestyle" },
  {
    id: "wine-tasting",
    name: "Wine Tasting",
    emoji: "🍷",
    category: "Lifestyle",
  },
  { id: "coffee", name: "Coffee Culture", emoji: "☕", category: "Lifestyle" },
  { id: "gardening", name: "Gardening", emoji: "🌱", category: "Lifestyle" },
  {
    id: "volunteering",
    name: "Volunteering",
    emoji: "🤝",
    category: "Lifestyle",
  },
  { id: "reading", name: "Reading", emoji: "📚", category: "Lifestyle" },

  // Learning & Skills
  {
    id: "languages",
    name: "Learn Languages",
    emoji: "🗣️",
    category: "Learning",
  },
  { id: "coding", name: "Programming", emoji: "💻", category: "Learning" },
  { id: "writing", name: "Writing", emoji: "✍️", category: "Learning" },
  { id: "dancing", name: "Dancing", emoji: "💃", category: "Learning" },
  {
    id: "instruments",
    name: "Musical Instruments",
    emoji: "🎸",
    category: "Learning",
  },
  { id: "crafting", name: "Arts & Crafts", emoji: "🧵", category: "Learning" },
];

/**
 * Helper function to group interests by category
 */
export const getGroupedInterests = (): Record<string, Interest[]> => {
  return INTERESTS.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);
};
