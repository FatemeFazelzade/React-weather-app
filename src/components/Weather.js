import { useState } from "react";
import "../Styles/Style.css";
import CitySearchBar from "./CitySearchBar";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    const city = cityName.trim();
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: city,
        units: "metric",
        appid: API_KEY,
      });

      const response = await fetch(`${API_URL}?${params}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please try another city.");
        }
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.");
        }
        throw new Error("Unable to load weather. Please try again.");
      }

      const result = await response.json();
      setWeather(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const getWeatherIcon = (main) => {
    const icons = {
      Clear: "☀️",
      Clouds: "⛅",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Fog: "🌫️",
      Dust: "🌫️",
      Sand: "🌫️",
      Ash: "🌫️",
      Squall: "💨",
      Tornado: "🌪️",
    };

    return icons[main] || "🌤️";
  };

  const temperature = weather?.main?.temp;

  const appClass =
    temperature > 32 ? "app hot" : temperature > 24 ? "app warm" : "app";

  return (
    <div className={appClass}>
      <main>
        <div className="weather-container">
          <div className="search-box">
            <CitySearchBar onSelectCity={fetchWeather} />
          </div>
          {loading && (
            <p className="status-message" role="status">
              Getting the latest weather...
            </p>
          )}

          {error && (
            <p className="status-message" role="alert">
              {error}
            </p>
          )}

          {weather && (
            <>
              <section className="location-box">
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="date">{date}</div>
              </section>

              <section className="weather-box">
                <div className="weather-icon" aria-hidden="true">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>

                <div className="temp">{Math.round(weather.main.temp)}°</div>

                <div className="weather">{weather.weather[0].description}</div>
              </section>

              <section className="weather-details" aria-label="Weather details">
                <div className="detail-card">
                  <div className="detail-icon" aria-hidden="true">
                    🌡️
                  </div>
                  <div className="detail-label">Feels like</div>
                  <div className="detail-value">
                    {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon" aria-hidden="true">
                    💧
                  </div>
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{weather.main.humidity}%</div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon" aria-hidden="true">
                    💨
                  </div>
                  <div className="detail-label">Wind</div>
                  <div className="detail-value">
                    {Math.round(weather.wind.speed * 3.6)} km/h
                  </div>
                </div>
              </section>
            </>
          )}

          {!weather && !loading && !error && (
            <p className="status-message">
              Search for a city to discover its weather.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Weather;
