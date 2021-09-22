function formatFullDate() {
  let now = new Date();
  let allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = allMonths[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();
  return `${date} ${month} ${year}`;
}
function formatDayAndTime() {
  let now = new Date();
  let allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeek = allDays[now.getDay()];
  let hour = ("0" + now.getHours()).slice(-2);
  let minutes = ("0" + now.getMinutes()).slice(-2);
  return `${dayOfWeek} ${hour}:${minutes}`;
}
let now = new Date();
let currentFullDate = document.querySelector("#date-month-year");
let currentDayAndTime = document.querySelector("#day-and-time");
currentFullDate.innerHTML = formatFullDate(now);
currentDayAndTime.innerHTML = formatDayAndTime(now);

function weatherOnPageLoad(city) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}
function getCityName(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#city-search-input").value;
  if (citySearchInput === "") {
    weatherOnPageLoad(document.querySelector("#city-name-element").innerHTML);
    celsiusActive();
  } else {
    getCelciusTemperature(citySearchInput);
    clearSearchInput();
  }
}
function clearSearchInput() {
  document.querySelector("#city-search-input").value = "";
}
function getCelciusTemperature(citySearchInput) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
  celsiusActive();
}
function showWeatherConditions(response) {
  document.querySelector(
    "#city-name-element"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#today-weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let weatherIconElement = document.querySelector("#weather-icon");
  weatherIconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord, "metric");
}
function getCurrentTemperature(position) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
  celsiusActive();
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentTemperature);
}
function getFahrenheitTemperature() {
  let cityName = document.querySelector("#city-name-element").innerHTML;
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
  axios.get(`${apiUrl}`).then(getCoordsForecast);
  fahrenheitActive();
}
function goBackToCelcius() {
  let cityName = document.querySelector("#city-name-element").innerHTML;
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
  celsiusActive();
}

function celsiusActive() {
  document.querySelector("#wind-units").innerHTML = " m/s";
  fahrenheitLink.classList.remove("active");
  fahrenheitLink.classList.add("inactive");
  celsiusLink.classList.add("active");
  celsiusLink.classList.remove("inactive");
}

function fahrenheitActive() {
  document.querySelector("#wind-units").innerHTML = " mph";
  celsiusLink.classList.remove("active");
  celsiusLink.classList.add("inactive");
  fahrenheitLink.classList.add("active");
  fahrenheitLink.classList.remove("inactive");
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let daysInWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysInWeek[day];
}
function getCoordsForecast(response) {
  getForecast(response.data.coord, "imperial");
}

function getForecast(coordinates, units) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude={part}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecastWrapper");
  let forecast = response.data.daily;
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 daily-forecast">
    <span class="day">${formatForecastDate(forecastDay.dt)}</span>
    <div class="col forecast-description">${
      forecastDay.weather[0].description
    }</div>
    <div class="col">
    <img src="images/${forecastDay.weather[0].icon}.png"
     alt="${
       forecastDay.weather[0].description
     }" width="60" height="70" class="forecast-icons"/>
        <div class="forecast-temperature">
        ${Math.round(
          forecastDay.temp.max
        )}° <span class="slash">/</span> ${Math.round(
          forecastDay.temp.min
        )}°</div>
    </div>
    </div>
    `;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}
let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", getCityName);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", getFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", goBackToCelcius);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

weatherOnPageLoad("Amsterdam");
