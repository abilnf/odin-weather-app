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

function displayWeather(data) {
  const content = document.querySelector(".content");
  if (content.classList.contains("content--hidden")) {
    content.style.maxHeight = `${content.scrollHeight * 2}px`;
    content.classList.toggle("content--hidden");
  }

  document.querySelector(".current-temp").textContent =
    data.temperature.current;
  document.querySelector(
    ".min-temp"
  ).textContent = `Minimum: ${data.temperature.min}`;
  document.querySelector(
    ".max-temp"
  ).textContent = `Maximum: ${data.temperature.max}`;
  document.querySelector(".icon").setAttribute("src", data.icon);
}

document.querySelector("#search").addEventListener("click", async () => {
  const place = document.querySelector("#place").value;
  if (place) {
    const data = await getWeatherData(place, localStorage.temperatureFormat);
    console.log(data);
    displayWeather(data);
  }
});

if (!localStorage.temperatureFormat) {
  localStorage.temperatureFormat = "celcius";
}

function updateTempFormatButton() {
  document.querySelector("#tempFormat").textContent =
    localStorage.temperatureFormat === "celcius" ? "°C" : "°F";
}
document.querySelector("#tempFormat").addEventListener("click", () => {
  localStorage.temperatureFormat =
    localStorage.temperatureFormat === "celcius" ? "fahrenheit" : "celcius";
  updateTempFormatButton();
});
updateTempFormatButton();
