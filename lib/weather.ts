export interface WeatherContext {
  temp: number;
  humidity: number;
  condition: string;
  city?: string;
}

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Slight showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail',
};

export async function getWeatherContext(): Promise<WeatherContext | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
          );
          const data = await res.json();
          resolve({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            condition: WEATHER_CODES[data.current.weather_code] ?? 'Unknown',
          });
        } catch {
          resolve(null);
        }
      },
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

export function weatherSummary(w: WeatherContext | null): string {
  if (!w) return '';
  return `${w.condition}, ${w.temp}°C, ${w.humidity}% humidity`;
}
