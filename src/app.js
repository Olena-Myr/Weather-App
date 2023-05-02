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
    minutes = `0 ${minutes}`;
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

//-------------------------------------------

function search(event) {
  event.preventDefault();
  let cityElement = document.getElementById("city");
  let cityInput = document.getElementById("city-input");
  cityElement.innerHTML = `${cityInput.value}`;
  showCity();
}

let searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", search);

//-------------------------------------------

function showCity() {
  let cityElement = document.getElementById("city");
  let currentCity = cityElement.value;
  let cityInput = document.getElementById("city-input");
  cityElement.innerHTML = currentCity;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = `fa5c04fcd52f60b7d8fbbddf71d60ae5`;
  let apiUrl = `${apiEndpoint}?q=${cityInput.value}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function searchCurrentLocation(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = `fa5c04fcd52f60b7d8fbbddf71d60ae5`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

let currentLocationButton = document.getElementById("current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

//-------------------------------------------

function showTemperature(response) {
  console.log(response.data);
  document.getElementById("city").innerHTML = response.data.name;

  document.getElementById("temp").innerHTML = Math.round(
    response.data.main.temp
  );

  //document.querySelector(`#temperature-description`).innerHTML =
  //response.data.weather[0].main;

  document.getElementById("humidity").innerHTML = response.data.main.humidity;
  document.getElementById("wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  updateTime(timeWithTimezone(response.data.timezone));
  document.getElementById("city-input").value = "";
}
