# Weather Now 🌤️

A simple React app that shows current weather and a 3-day forecast for a given city or given latitude & longitude. Built with the Open-Meteo APIs and styled using Tailwind CSS (via CDN).

---

## Demo

Live version: [Weather Now on StackBlitz](https://react-fmgqpvxe.stackblitz.io)

---

## Features

- Search by **city name** (e.g., “Delhi”, “London”)  
- Direct input of **latitude,longitude** (e.g., `28.61,77.21`) to get weather without needing city lookup  
- Shows **current weather**: temperature, wind speed, weather condition with emoji + description  
- **3-day forecast** (max/min temperature + description)  
- Responsive UI with loading spinner and error handling  
- Friendly messages for invalid inputs or missing data

---

## Tech Stack

| Layer | Technology |
| UI library | React |
| Styling | Tailwind CSS (via CDN) |
| APIs | Open-Meteo Geocoding & Forecast APIs |
| Hosting / Runner | StackBlitz (live playground) |

---

## How to Run / Use

1. Open the project in StackBlitz (or fork it).  
2. Type a city name or latitude,longitude in the input box.  
3. Press **Enter** or click the **Get Weather** button.  
4. View current weather & 3-day forecast.  

---

## Input Formats

You can use two formats in the search input:

| Format | Example | Behavior |
| **City name** | `Mumbai` or `New York` | Uses geocoding to get lat/lon, then fetches weather |
| **Latitude,Longitude** | `28.61,77.21` | Directly fetches weather for that coordinate pair |

If the input is invalid (e.g. wrong format or no results), you’ll see a friendly error message.

---

## Known Limitations & Possible Improvements

- Weather codes mapped through emoji & text only — real weather icons could improve look.  
- Only 3-day forecast is shown — could extend to 7-day or hourly.  
- No caching of API results — repeated requests make fresh API calls each time.  
- Styling could be polished further (animations, transitions, mobile optimizations, etc.).

---

## Submission Details

This project is submitted as part of the **Take-Home Challenge**. It includes:

- **chatgpt.txt** — conversation/work log with ChatGPT showing how the project was built.  
- **README.md** — this file.  
- Live link of the app (above).  
- Source code (on StackBlitz or downloadable export).

---

## APIs Used

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`  
- **Forecast / Weather Data**: `https://api.open-meteo.com/v1/forecast`

---

Thanks for checking out Weather Now! Feedback is welcome.  
