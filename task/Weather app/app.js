const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  const cities = ["London", "New York", "Toronto","Gujarat"];

  const geocodeData = async (city) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=7160fb3ce67a4856a5da571356af77d8&language=en&pretty=1`;
      const { data } = await axios.get(url);
      const { lat, lng } = data.results[0].geometry;
      return { city, lat, lng };
    } catch (error) {
      console.error(`Error fetching data for ${city}:`, error);
      throw error;
    }
  };

  try {
    const locationData = await Promise.all(cities.map(geocodeData));
    res.render("index", { locations: locationData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch data.");
  }
});

app.listen(port, () => {
  console.log(`Server is connected on port ${port}`);
});
