import type { TimeBucket } from "types/time";

export function getTimeBucket(now: Date): TimeBucket {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "late";
}

const SUBTITLE_SETS: Record<TimeBucket, string[]> = {
  morning: [
    "What\u2019s on your radar today?",
    "Pick something for later",
    "Make today count",
  ],
  afternoon: [
    "Got plans tonight?",
    "Find something for the evening",
    "What\u2019s the move?",
  ],
  evening: [
    "Where to tonight?",
    "Pick your next adventure",
    "Something fun ahead?",
  ],
  late: ["Anything calling you?", "Quiet plans for tomorrow?"],
};

export function getGreeting(
  bucket: TimeBucket,
  firstName?: string | null,
): string {
  const name = firstName ? `, ${firstName}` : "";
  switch (bucket) {
    case "morning":
      return `Good morning${name}`;
    case "afternoon":
      return `Good afternoon${name}`;
    case "evening":
      return `Good evening${name}`;
    case "late":
      return firstName ? `Still up, ${firstName}?` : "Still up?";
  }
}

/**
 * Deterministic daily rotation: hash date string + userId into an index.
 * Stable within a day, changes day-to-day.
 */
export function getGreetingPrompt(now: Date, userId?: string | null): string {
  const bucket = getTimeBucket(now);
  const set = SUBTITLE_SETS[bucket];
  const dateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const seed = `${dateStr}:${userId ?? "anon"}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % set.length;
  return set[index];
}
