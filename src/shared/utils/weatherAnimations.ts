/**
 * Maps OpenWeatherMap icon codes to local Lottie animation files.
 * Icon codes: https://openweathermap.org/weather-conditions
 */

const animations = {
  "clear-day": require("assets/animations/weather/clear-day.json"),
  "clear-night": require("assets/animations/weather/clear-night.json"),
  "partly-cloudy-day": require("assets/animations/weather/partly-cloudy-day.json"),
  "partly-cloudy-night": require("assets/animations/weather/partly-cloudy-night.json"),
  cloudy: require("assets/animations/weather/cloudy.json"),
  rain: require("assets/animations/weather/rain.json"),
  thunderstorm: require("assets/animations/weather/thunderstorm.json"),
  snow: require("assets/animations/weather/snow.json"),
  mist: require("assets/animations/weather/mist.json"),
} as const;

type AnimationKey = keyof typeof animations;

/**
 * Map an OpenWeatherMap icon code (e.g. "01d", "10n") to a Lottie source.
 * Falls back to clear-day if the code is unrecognized.
 */
const iconCodeToKey: Record<string, AnimationKey> = {
  // Clear sky
  "01d": "clear-day",
  "01n": "clear-night",
  // Few clouds
  "02d": "partly-cloudy-day",
  "02n": "partly-cloudy-night",
  // Scattered / broken clouds
  "03d": "cloudy",
  "03n": "cloudy",
  "04d": "cloudy",
  "04n": "cloudy",
  // Rain (shower + regular)
  "09d": "rain",
  "09n": "rain",
  "10d": "rain",
  "10n": "rain",
  // Thunderstorm
  "11d": "thunderstorm",
  "11n": "thunderstorm",
  // Snow
  "13d": "snow",
  "13n": "snow",
  // Mist / fog / haze / smoke / dust
  "50d": "mist",
  "50n": "mist",
};

export function getWeatherAnimation(iconCode?: string | null) {
  const key = iconCode ? iconCodeToKey[iconCode] : undefined;
  return animations[key ?? "clear-day"];
}
