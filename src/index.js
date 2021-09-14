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

function weatherOnPageLoad() {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${
    document.querySelector("#city-name-element").innerHTML
  }&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}

function getCityName(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#city-search-input").value;
  getCelciusTemperature(citySearchInput);
}

function getCelciusTemperature(citySearchInput) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}
function showWeatherConditions(response) {
  document.querySelector("#city-name-element").innerHTML = response.data.name;
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
    `http://www.openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);
  showHighLow(response);
}
function showHighLow(response) {
  document.querySelector("#today-high").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#today-low").innerHTML = Math.round(
    response.data.main.temp_min
  );
}
function getFahrenheitTemperature() {
  let cityName = document.querySelector("#city-name-element").innerHTML;
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}
function goBackToCelcius() {
  let cityName = document.querySelector("#city-name-element").innerHTML;
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}

function getCurrentTemperature(position) {
  let apiKey = "b278ff04a20f686b021e62fb800cae6e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showWeatherConditions);
}
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentTemperature);
}

let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", getCityName);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", getFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", goBackToCelcius);
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

weatherOnPageLoad();
