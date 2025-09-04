export const mockData = {
  user: {
    id: "1",
    name: "Faith",
    email: "faith@pursuit.com",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  insights: {
    id: "1",
    weather: {
      city: "San Francisco",
      condition: "Sunny",
      temperature: 14,
    },
    nextDestination: {
      location: "Tokyo, Japan",
      daysAway: 14,
    },
    progress: {
      completed: 15,
      yearlyGoal: 25,
      percentage: 60,
    },
    recentAchievement: "Completed hiking challenge",
  },
  upcomingEvents: [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww",
      title: "Beach Cleanup",
      date: "2023-10-15",
      location: "Santa Monica Beach",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
      title: "Tech Conference",
      date: "2023-11-20",
      location: "Los Angeles Convention Center",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
      title: "Art Exhibition",
      date: "2023-12-05",
      location: "Downtown Art Gallery",
    },
  ],
  bucketCategories: [
    { id: "1", name: "Movies", emoji: "🎬" },
    { id: "2", name: "Books", emoji: "📚" },
    { id: "3", name: "Cooking", emoji: "🍳" },
    { id: "4", name: "Travelling", emoji: "✈️" },
    { id: "5", name: "Sports & Fitness", emoji: "⚽" },
    { id: "6", name: "Arts & Creativity", emoji: "🎨" },
    { id: "7", name: "Music", emoji: "🎵" },
    { id: "8", name: "Nature", emoji: "🌿" },
  ],
  bucketItems: [
    // Travel Items
    {
      id: "1",
      title: "Learn to surf in Bali",
      description: "Take surfing lessons at Bondi Beach",
      amount: 2800,
      image:
        "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "4",
    },
    {
      id: "4",
      title: "Skydiving in Dubai",
      description: "Experience the thrill of skydiving with amazing city views",
      amount: 1450,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "4",
    },
    {
      id: "5",
      title: "Visit the Grand Canyon",
      description: "Explore one of the world's natural wonders",
      amount: 1800,
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "4",
    },
    {
      id: "7",
      title: "Visit the Eiffel Tower",
      description: "See the iconic landmark in Paris",
      amount: 3200,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "4",
    },
    {
      id: "8",
      title: "Visit the Taj Mahal",
      description: "Experience this architectural marvel in India",
      amount: 2950,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "4",
    },

    // Books Items
    {
      id: "2",
      title: "Read 24 books this year",
      description: "Focus on personal development and fiction",
      amount: 480,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "2",
    },
    {
      id: "12",
      title: "Read Dune Series",
      description: "Complete Frank Herbert's epic sci-fi series",
      amount: 120,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "2",
    },

    // Movies Items
    {
      id: "3",
      title: "Watch Inception",
      description: "Finally watch this mind-bending movie",
      image:
        "https://images.unsplash.com/photo-1489599316546-1c5d71201ae8?auto=format&fit=crop&q=80&w=800",
      completed: true,
      categoryId: "1",
    },
    {
      id: "11",
      title: "Watch Studio Ghibli Collection",
      description: "Experience all of Miyazaki's masterpieces",
      amount: 150,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "1",
    },

    // Sports & Fitness Items
    {
      id: "13",
      title: "Complete a Marathon",
      description: "Train for and finish a full 26.2 mile marathon",
      amount: 300,
      image:
        "https://images.unsplash.com/photo-1571019613540-996a8cfeb0d0?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "5",
    },
    {
      id: "14",
      title: "Learn Rock Climbing",
      description: "Master indoor and outdoor climbing techniques",
      amount: 800,
      image:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "5",
    },

    // Arts & Creativity Items
    {
      id: "15",
      title: "Paint a Self-Portrait",
      description: "Create an oil painting self-portrait",
      amount: 200,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "6",
    },
    {
      id: "16",
      title: "Photography Exhibition",
      description: "Have my photos displayed in a local gallery",
      amount: 500,
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "6",
    },

    // Music Items
    {
      id: "6",
      title: "Learn to play the guitar",
      description: "Master basic guitar chords and songs",
      amount: 650,
      image:
        "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "7",
    },
    {
      id: "17",
      title: "Attend Coachella",
      description: "Experience the iconic music festival",
      amount: 1200,
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "7",
    },

    // Cooking Items
    {
      id: "18",
      title: "Master French Cuisine",
      description: "Learn to cook classic French dishes",
      amount: 400,
      image:
        "https://images.unsplash.com/photo-1556909114-4a2b031db544?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "3",
    },
    {
      id: "19",
      title: "Learn Sushi Making",
      description: "Take professional sushi making classes",
      amount: 350,
      image:
        "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "3",
    },

    // Nature Items
    {
      id: "20",
      title: "Hike Machu Picchu",
      description: "Complete the Inca Trail to Machu Picchu",
      amount: 2500,
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "8",
    },
    {
      id: "21",
      title: "Northern Lights in Iceland",
      description: "Witness the aurora borealis in Iceland",
      amount: 3500,
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800",
      completed: false,
      categoryId: "8",
    },
  ],
};
export const emojiLibrary = [
  // Travel & Adventure
  { symbol: "🎯", description: "Target/Goals" },
  { symbol: "✈️", description: "Airplane/Travel" },
  { symbol: "🏔️", description: "Mountains" },
  { symbol: "🏖️", description: "Beach" },
  { symbol: "🏕️", description: "Camping" },
  { symbol: "🗺️", description: "World Map" },
  { symbol: "🧳", description: "Luggage" },
  { symbol: "🎒", description: "Backpack" },
  { symbol: "🚗", description: "Car" },
  { symbol: "🚢", description: "Ship" },
  { symbol: "🏰", description: "Castle" },
  { symbol: "🗽", description: "Statue of Liberty" },
  { symbol: "🎡", description: "Ferris Wheel" },
  { symbol: "🎢", description: "Roller Coaster" },
  { symbol: "🎠", description: "Carousel" },
  { symbol: "🌋", description: "Volcano" },
  { symbol: "🏜️", description: "Desert" },
  { symbol: "🏞️", description: "National Park" },
  { symbol: "🌊", description: "Ocean Wave" },
  { symbol: "🌅", description: "Sunrise" },

  // Arts & Creativity
  { symbol: "🎨", description: "Art Palette" },
  { symbol: "🎭", description: "Theater Masks" },
  { symbol: "🎪", description: "Circus" },
  { symbol: "🖼️", description: "Framed Picture" },
  { symbol: "✏️", description: "Pencil" },
  { symbol: "🖌️", description: "Paintbrush" },
  { symbol: "📸", description: "Camera" },
  { symbol: "🎬", description: "Movie Camera" },
  { symbol: "📹", description: "Video Camera" },
  { symbol: "🎤", description: "Microphone" },
  { symbol: "🎵", description: "Musical Note" },
  { symbol: "🎶", description: "Musical Notes" },
  { symbol: "🎸", description: "Guitar" },
  { symbol: "🎹", description: "Piano" },
  { symbol: "🎺", description: "Trumpet" },
  { symbol: "🥁", description: "Drums" },
  { symbol: "🎼", description: "Musical Score" },
  { symbol: "🎧", description: "Headphones" },
  { symbol: "📚", description: "Books" },
  { symbol: "✍️", description: "Writing" },

  // Sports & Fitness
  { symbol: "⚽", description: "Soccer Ball" },
  { symbol: "🏀", description: "Basketball" },
  { symbol: "🏈", description: "Football" },
  { symbol: "⚾", description: "Baseball" },
  { symbol: "🎾", description: "Tennis" },
  { symbol: "🏐", description: "Volleyball" },
  { symbol: "🏓", description: "Ping Pong" },
  { symbol: "🏸", description: "Badminton" },
  { symbol: "🥊", description: "Boxing" },
  { symbol: "🏋️", description: "Weightlifting" },
  { symbol: "🏃", description: "Running" },
  { symbol: "🚴", description: "Cycling" },
  { symbol: "🏊", description: "Swimming" },
  { symbol: "🏄", description: "Surfing" },
  { symbol: "⛷️", description: "Skiing" },
  { symbol: "🏇", description: "Horse Racing" },
  { symbol: "🧗", description: "Rock Climbing" },
  { symbol: "🤸", description: "Gymnastics" },
  { symbol: "🧘", description: "Meditation/Yoga" },
  { symbol: "💪", description: "Strength" },

  // Food & Dining
  { symbol: "🍕", description: "Pizza" },
  { symbol: "🍔", description: "Hamburger" },
  { symbol: "🌮", description: "Taco" },
  { symbol: "🍜", description: "Noodles" },
  { symbol: "🍣", description: "Sushi" },
  { symbol: "🍰", description: "Cake" },
  { symbol: "🧁", description: "Cupcake" },
  { symbol: "🍷", description: "Wine" },
  { symbol: "☕", description: "Coffee" },
  { symbol: "🍎", description: "Apple" },
  { symbol: "🥗", description: "Salad" },
  { symbol: "🍝", description: "Pasta" },
  { symbol: "🍲", description: "Hot Pot" },
  { symbol: "🥘", description: "Paella" },
  { symbol: "🍳", description: "Cooking" },
  { symbol: "🥞", description: "Pancakes" },
  { symbol: "🧀", description: "Cheese" },
  { symbol: "🍓", description: "Strawberry" },
  { symbol: "🥑", description: "Avocado" },
  { symbol: "🌶️", description: "Hot Pepper" },

  // Technology & Gaming
  { symbol: "🚀", description: "Rocket" },
  { symbol: "🎮", description: "Gaming" },
  { symbol: "🖥️", description: "Desktop Computer" },
  { symbol: "📱", description: "Mobile Phone" },
  { symbol: "⌚", description: "Smartwatch" },
  { symbol: "🔬", description: "Microscope" },
  { symbol: "🧪", description: "Test Tube" },
  { symbol: "⚡", description: "Lightning" },
  { symbol: "🔋", description: "Battery" },
  { symbol: "🛸", description: "UFO" },
  { symbol: "🤖", description: "Robot" },
  { symbol: "💻", description: "Laptop" },
  { symbol: "🖱️", description: "Computer Mouse" },
  { symbol: "⌨️", description: "Keyboard" },
  { symbol: "🕹️", description: "Joystick" },
  { symbol: "🎲", description: "Dice" },
  { symbol: "🧩", description: "Puzzle Piece" },
  { symbol: "🔭", description: "Telescope" },
  { symbol: "📡", description: "Satellite" },

  // Nature & Animals
  { symbol: "🌟", description: "Star" },
  { symbol: "🌺", description: "Hibiscus" },
  { symbol: "🌸", description: "Cherry Blossom" },
  { symbol: "🌷", description: "Tulip" },
  { symbol: "🌻", description: "Sunflower" },
  { symbol: "🌳", description: "Tree" },
  { symbol: "🍃", description: "Leaves" },
  { symbol: "🐝", description: "Bee" },
  { symbol: "🦋", description: "Butterfly" },
  { symbol: "🐢", description: "Turtle" },
  { symbol: "🦅", description: "Eagle" },
  { symbol: "🐺", description: "Wolf" },
  { symbol: "🦁", description: "Lion" },
  { symbol: "🐼", description: "Panda" },
  { symbol: "🐧", description: "Penguin" },
  { symbol: "🦉", description: "Owl" },
  { symbol: "🌙", description: "Crescent Moon" },
  { symbol: "☀️", description: "Sun" },
  { symbol: "⭐", description: "Star" },
  { symbol: "🌈", description: "Rainbow" },
];
