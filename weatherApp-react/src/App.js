import React, { useState } from "react";

/**
 * Map weather codes to emoji and text.
 */
const WEATHER_MAP = {
  0: { icon: "☀️", label: "Clear sky" },
  1: { icon: "🌤️", label: "Mainly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Rime fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Moderate drizzle" },
  55: { icon: "🌧️", label: "Dense drizzle" },
  61: { icon: "🌧️", label: "Light rain" },
  63: { icon: "🌧️", label: "Moderate rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "🌨️", label: "Moderate snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  80: { icon: "🌦️", label: "Rain showers" },
  81: { icon: "🌧️", label: "Moderate showers" },
  82: { icon: "⛈️", label: "Heavy showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm + hail" },
  99: { icon: "⛈️", label: "Severe thunderstorm" },
};
const getWeatherMeta = (code) =>
  WEATHER_MAP[code] || { icon: "🌈", label: "Unknown" };

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    const q = city.trim();
    if (!q) {
      setError("Please enter a city name or coordinates.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      let latitude, longitude, placeName;

      // ✅ Case 1: user entered coordinates
      if (q.includes(",")) {
        const parts = q.split(",").map((x) => x.trim());
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
          throw new Error(
            "Invalid coordinates. Use: lat,lon (e.g., 28.61,77.21)"
          );
        }
        latitude = parseFloat(parts[0]);
        longitude = parseFloat(parts[1]);

        // ✅ Reverse geocoding with Nominatim (OpenStreetMap)
        const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const revRes = await fetch(reverseUrl, {
          headers: { "User-Agent": "weather-now-demo" }, // required by OSM
        });
        if (!revRes.ok) throw new Error("Reverse geocoding failed.");
        const revJson = await revRes.json();

        if (revJson && revJson.address) {
          placeName =
            revJson.address.city ||
            revJson.address.town ||
            revJson.address.village ||
            revJson.display_name;
        } else {
          placeName = `Lat: ${latitude}, Lon: ${longitude}`;
        }
      } else {
        // ✅ Case 2: user entered a city name → forward geocoding with Open-Meteo
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          q
        )}&count=1`;
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) throw new Error("Geocoding failed.");
        const geoJson = await geoRes.json();

        if (!geoJson.results || geoJson.results.length === 0) {
          throw new Error("City not found. Try another.");
        }

        const place = geoJson.results[0];
        latitude = place.latitude;
        longitude = place.longitude;
        placeName = `${place.name}${place.country ? ", " + place.country : ""}`;
      }

      // ✅ Fetch weather
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const wRes = await fetch(weatherUrl);
      if (!wRes.ok) throw new Error("Weather fetch failed.");
      const wJson = await wRes.json();

      setWeather({
        placeName,
        current: wJson.current_weather || null,
        daily: wJson.daily || null,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") getWeather();
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-br from-blue-200 to-blue-500">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🌤️ Weather Now
        </h1>

        {/* Input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="City or lat,lon (e.g., Delhi OR 28.61,77.21)"
            className="flex-1 px-4 py-2 rounded-lg shadow border border-gray-300 focus:outline-none"
          />
          <button
            onClick={getWeather}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-60"
          >
            Get Weather
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-white mb-4">
            <svg
              className="animate-spin h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
              <path
                d="M2 12a10 10 0 0010 10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <span>Fetching weather...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-100 bg-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* Current Weather */}
        {weather && weather.current && (
          <section className="bg-white rounded-lg shadow p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{weather.placeName}</h2>
                <p className="text-sm text-gray-600">Current conditions</p>
              </div>

              <div className="text-right">
                <div className="text-4xl">
                  {getWeatherMeta(weather.current.weathercode).icon}
                </div>
                <div className="text-sm text-gray-500">
                  {getWeatherMeta(weather.current.weathercode).label}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-500">Temperature</div>
                <div className="text-2xl font-bold">
                  {weather.current.temperature}°C
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Wind speed</div>
                <div className="text-2xl font-bold">
                  {weather.current.windspeed} km/h
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Forecast */}
        {weather && weather.daily && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weather.daily.time.slice(0, 3).map((dateStr, idx) => {
              const max = weather.daily.temperature_2m_max[idx];
              const min = weather.daily.temperature_2m_min[idx];
              const code = weather.daily.weathercode[idx];
              const meta = getWeatherMeta(code);
              const d = new Date(dateStr);
              const dayLabel = d.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              return (
                <div
                  key={dateStr}
                  className="bg-white rounded-lg p-4 shadow text-center"
                >
                  <div className="text-xl">{meta.icon}</div>
                  <div className="font-medium mt-2">{dayLabel}</div>
                  <div className="text-sm text-gray-500">{meta.label}</div>
                  <div className="mt-2">
                    <span className="font-bold">{Math.round(max)}°</span>
                    <span className="text-gray-500"> / {Math.round(min)}°</span>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
