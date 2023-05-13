//day
let now = new Date();

let currentDay = document.getElementById("day");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];

currentDay.innerHTML = `${day}, `;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

//forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.getElementById("forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}
      </div>
        <img src=https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png alt="" width="54" class=""/>
      <div class="weather-forecast-temperature">
        <span class="weather-forecast-temperature-max">${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temp.min
        )}° </span>
      </div>
    </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//time in other cities (GPT helped :)  )
function timeWithTimezone(timezone) {
  const date = new Date();
  const localTimezoneOffsetSeconds = date.getTimezoneOffset() * 60;
  const targetTimezoneOffsetSeconds = -timezone;
  const timezoneOffsetSecondsDiff =
    localTimezoneOffsetSeconds - targetTimezoneOffsetSeconds;
  const targetTime = date.getTime() + timezoneOffsetSecondsDiff * 1000;
  const targetDate = new Date(targetTime);
  return targetDate;
}

function updateTime(current) {
  let currentTime = document.getElementById("time");

  let hours = current.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = current.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  currentTime.innerHTML = `${hours}:${minutes}`;

  let currentDate = document.getElementById("date");

  let months = [
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
  let month = months[current.getMonth()];
  let year = current.getFullYear();
  let date = current.getDate();

  currentDate.innerHTML = `${month}, ${date} ${year}`;
}

updateTime(now);
// navigator.geolocation.getCurrentPosition(searchCurrentLocation);
//-------------------------------------------

function search(event) {
  event.preventDefault();
  //let cityElement = document.getElementById("city");
  let cityInput = document.getElementById("city-input");
  //cityElement.innerHTML = `${cityInput.value}`;
  showCity(cityInput.value);
}

let searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", search);

//-------------------------------------------

function showCity(city) {
  //let cityInput = document.getElementById("city-input");
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = `fa5c04fcd52f60b7d8fbbddf71d60ae5`;
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function searchCurrentLocation(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = `cf6b50b908fa2e0baca3eed8a569a5f6`;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

let currentLocationButton = document.getElementById("current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `57b2c40fdae71a6ba41d72685e3226e2`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

//-------------------------------------------

function showTemperature(response) {
  console.log(response.data);
  document.getElementById("city").innerHTML = response.data.name;

  document.getElementById("temp").innerHTML = Math.round(
    response.data.main.temp
  );

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  //document.querySelector(`#temperature-description`).innerHTML = response.data.weather[0].main;
  document.getElementById("humidity").innerHTML = response.data.main.humidity;
  document.getElementById("wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  updateTime(timeWithTimezone(response.data.timezone));
  document.getElementById("city-input").value = "";
  let iconElement = document.getElementById("icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

//change unit
function CtoF(C) {
  return (9 / 5) * C + 32;
}
function FtoC(F) {
  return (5 / 9) * (F - 32);
}

//thanks to my Mentor!
function updateTemperatureValue(func) {
  let temperatureElement = document.getElementById("temp");
  let v = parseFloat(temperatureElement.innerHTML);
  console.log(v);
  temperatureElement.innerHTML = Math.round(func(v));
}

//MATTa
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  updateTemperatureValue(CtoF);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  updateTemperatureValue(FtoC);
}

let fahrenheitLink = document.getElementById("fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.getElementById("celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

showCity("Warszawa");
