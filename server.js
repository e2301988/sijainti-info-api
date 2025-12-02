const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Sijainti-info-API toimii!");
});

app.get("/location-info", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({
      error:
        "Anna lat ja lon query-parametrit, esim. /location-info?lat=63.096&lon=21.616",
    });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const nominatimResponse = await fetch(nominatimUrl);

    if (!nominatimResponse.ok) {
      throw new Error("Nominatim-haku epäonnistui");
    }

    const nominatimData = await nominatimResponse.json();

    const address = nominatimData.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      "Tuntematon kaupunki";

    const country = address.country || "Tuntematon maa";

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

    const weatherResponse = await fetch(openMeteoUrl);

    if (!weatherResponse.ok) {
      throw new Error("Open-Meteo-haku epäonnistui");
    }

    const weatherData = await weatherResponse.json();

    const currentWeather = weatherData.current || {};
    const temperature = currentWeather.temperature_2m;
    const weatherCode = currentWeather.weather_code;

    return res.json({
      city,
      country,
      temperature,
      weatherCode,
      coordinates: {
        lat: Number(lat),
        lon: Number(lon),
      },
    });
  } catch (error) {
    console.error("Virhe /location-info -reitillä:", error);
    return res.status(500).json({
      error: "Virhe haettaessa dataa",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
