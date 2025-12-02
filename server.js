const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Sijainti-info API toimii!");
});

app.get("/location-info", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({
      error: "Anna lat ja lon query-parametrit, esim. /location-info?lat=63.096&lon=21.616",
    });
  }

  try {
    
    return res.json({
      message: "location-info reitti toimii",
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
