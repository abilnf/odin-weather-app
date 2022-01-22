const WEATHER_API_KEY = "5f5a95fc13483f20d6fcf31ec586d9ca";

function kelvinToCelcius(kelvin) {
  return kelvin - 273.15;
}

function kelvinToFahrenheit(kelvin) {
  return kelvinToCelcius(kelvin) * 1.8 + 32;
}

function kelvinToSelected(kelvin, temperatureFormat) {
  if (temperatureFormat === "celcius")
    return `${kelvinToCelcius(kelvin).toFixed(1)}°C`;
  if (temperatureFormat === "fahrenheit")
    return `${kelvinToFahrenheit(kelvin).toFixed(1)}°F`;
  throw new Error(`Unknown temperature format '${temperatureFormat}'`);
}

async function fetchWeatherData(city) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city.replace(
      / /g,
      "+"
    )}&appid=${WEATHER_API_KEY}`
  );
  if (!data.ok) return {};
  const json = await data.json();
  return json;
}

async function processWeatherData(data, temperatureFormat) {
  return {
    temperature: {
      current: kelvinToSelected(data.main.temp, temperatureFormat),
      min: kelvinToSelected(data.main.temp_min, temperatureFormat),
      max: kelvinToSelected(data.main.temp_max, temperatureFormat),
    },
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
  };
}

async function getWeatherData(city, temperatureFormat) {
  const raw = await fetchWeatherData(city);
  const processed = await processWeatherData(raw, temperatureFormat);
  return processed;
}

document.querySelector("#search").addEventListener("click", async () => {
  const place = document.querySelector("#place").value;
  if (place) {
    const data = await getWeatherData(place, "celcius");
    console.log(data);
  }
});
