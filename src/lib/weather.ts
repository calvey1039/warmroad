// Open-Meteo Weather API integration

// Simple in-memory cache to avoid redundant API calls within a session
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface DayForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  icon: string;
}

export interface WeatherData {
  maxTemp: number; // Fahrenheit (today's high)
  minTemp: number;
  condition: string;
  icon: string;
  forecast: DayForecast[];
}

export type WeatherCondition = "any" | "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";

export const weatherConditionLabels: Record<WeatherCondition, string> = {
  any: "Any Weather",
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
  stormy: "Stormy",
};

export function getWeatherCategory(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "sunny";
  if ((code >= 2 && code <= 3) || (code >= 45 && code <= 48)) return "cloudy";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 85 && code <= 86) return "snowy";
  if (code >= 95) return "stormy";
  return "cloudy";
}

export async function getWeatherForLocation(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Check cache first
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=auto&forecast_days=10`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    const maxTemp = data.daily.temperature_2m_max[0];
    const minTemp = data.daily.temperature_2m_min[0];
    const weatherCode = data.daily.weather_code[0];

    // Build 10-day forecast
    const forecast: DayForecast[] = data.daily.time.map((date: string, i: number) => {
      const dateObj = new Date(date + "T12:00:00");
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dateObj.toLocaleDateString("en-US", { weekday: "short" });

      return {
        date,
        dayName,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        weatherCode: data.daily.weather_code[i],
        icon: getWeatherIcon(data.daily.weather_code[i]),
      };
    });

    const result: WeatherData = {
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      condition: getWeatherCondition(weatherCode),
      icon: getWeatherIcon(weatherCode),
      forecast,
    };

    // Store in cache
    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
}

export function getMatchingDaysCount(
  weather: WeatherData | null,
  minTemp: number | null,
  maxTemp: number | null,
  weatherCondition: WeatherCondition
): number {
  if (!weather || !weather.forecast) return 0;
  return weather.forecast.filter(day => {
    const meetsMin = minTemp === null || day.maxTemp >= minTemp;
    const meetsMax = maxTemp === null || day.maxTemp <= maxTemp;
    const meetsWeather = weatherCondition === "any" || getWeatherCategory(day.weatherCode) === weatherCondition;
    return meetsMin && meetsMax && meetsWeather;
  }).length;
}

export function hasGreatWeekend(
  weather: WeatherData | null,
  minTemp: number | null,
  maxTemp: number | null,
  weatherCondition: WeatherCondition
): boolean {
  if (!weather?.forecast) return false;
  const weekendGroups = new Map<string, number>();
  for (const day of weather.forecast) {
    const dateObj = new Date(day.date + "T12:00:00");
    const dow = dateObj.getDay();
    if (dow !== 0 && dow !== 5 && dow !== 6) continue;
    const fridayDate = new Date(dateObj);
    if (dow === 6) fridayDate.setDate(fridayDate.getDate() - 1);
    else if (dow === 0) fridayDate.setDate(fridayDate.getDate() - 2);
    const key = fridayDate.toISOString().split("T")[0];
    const meetsMin = minTemp === null || day.maxTemp >= minTemp;
    const meetsMax = maxTemp === null || day.maxTemp <= maxTemp;
    const meetsWeather = weatherCondition === "any" || getWeatherCategory(day.weatherCode) === weatherCondition;
    if (meetsMin && meetsMax && meetsWeather) {
      weekendGroups.set(key, (weekendGroups.get(key) || 0) + 1);
    }
  }
  for (const count of weekendGroups.values()) {
    if (count >= 2) return true;
  }
  return false;
}

export function getUpcomingWeekendDates(): string[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dow = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Find the next upcoming Saturday.
  // If today is Saturday (6), use today. Otherwise advance to next Saturday.
  // Sun=6d, Mon=5d, Tue=4d, Wed=3d, Thu=2d, Fri=1d, Sat=0d
  const daysUntilSaturday = (6 - dow) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return [fmt(saturday), fmt(sunday)];
}

export function meetsUpcomingWeekendCriteria(
  weather: WeatherData | null,
  minTemp: number | null,
  maxTemp: number | null,
  weatherCondition: WeatherCondition = "any"
): boolean {
  if (!weather?.forecast) return false;
  const weekendDates = getUpcomingWeekendDates();
  return weather.forecast.some(day => {
    if (!weekendDates.includes(day.date)) return false;
    const meetsMin = minTemp === null || day.maxTemp >= minTemp;
    const meetsMax = maxTemp === null || day.maxTemp <= maxTemp;
    const meetsWeather = weatherCondition === "any" || getWeatherCategory(day.weatherCode) === weatherCondition;
    return meetsMin && meetsMax && meetsWeather;
  });
}

export function meetsTodayCriteria(
  weather: WeatherData | null,
  minTemp: number | null,
  maxTemp: number | null,
  weatherCondition: WeatherCondition = "any"
): boolean {
  if (!weather?.forecast || weather.forecast.length === 0) return false;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];
  const todayForecast = weather.forecast.find(day => day.date === todayStr);
  if (!todayForecast) return false;
  const meetsMin = minTemp === null || todayForecast.maxTemp >= minTemp;
  const meetsMax = maxTemp === null || todayForecast.maxTemp <= maxTemp;
  const meetsWeather = weatherCondition === "any" || getWeatherCategory(todayForecast.weatherCode) === weatherCondition;
  return meetsMin && meetsMax && meetsWeather;
}

// Combined filter: check if destination meets temp and weather criteria
export function meetsTemperatureCriteria(
  weather: WeatherData | null,
  minTemp: number | null,
  maxTemp: number | null,
  weatherCondition: WeatherCondition = "any"
): boolean {
  if (!weather || !weather.forecast) return false;

  return weather.forecast.some(day => {
    const meetsMin = minTemp === null || day.maxTemp >= minTemp;
    const meetsMax = maxTemp === null || day.maxTemp <= maxTemp;
    const meetsWeather = weatherCondition === "any" || getWeatherCategory(day.weatherCode) === weatherCondition;
    return meetsMin && meetsMax && meetsWeather;
  });
}

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return conditions[code] || "Unknown";
}

function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌧️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

// Hourly weather for route forecasts
export interface HourlyForecast {
  time: string; // ISO datetime string
  temperature: number;
  weatherCode: number;
  icon: string;
  condition: string;
  windSpeed: number;
  humidity: number;
  precipitationProbability: number;
}

export async function getHourlyWeatherForLocation(
  lat: number,
  lon: number,
  forecastDays: number = 16
): Promise<HourlyForecast[] | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=${forecastDays}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();

    const hourly: HourlyForecast[] = data.hourly.time.map((time: string, i: number) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      weatherCode: data.hourly.weather_code[i],
      icon: getWeatherIcon(data.hourly.weather_code[i]),
      condition: getWeatherCondition(data.hourly.weather_code[i]),
      windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
      humidity: 0,
      precipitationProbability: Math.round(data.hourly.precipitation_probability?.[i] ?? 0),
    }));

    return hourly;
  } catch (error) {
    console.error("Hourly weather fetch error:", error);
    return null;
  }
}
