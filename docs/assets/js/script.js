var searchBtn = document.getElementById("searchCityBtn");
var searchText = document.getElementById("searchText");
var cityBtnsContainer = document.getElementById("cityBtns");
var apiKey = "8aac30548a10c42cfdce3d2468c126cf";
var searchUnits = "imperial";
var searchedCity;
var savedSearches = [];

if (localStorage.getItem("weatherSearchHistory")) {
  savedSearches = JSON.parse(localStorage.getItem("weatherSearchHistory"));
  console.log(savedSearches);
}

createSearchButtons(savedSearches);

// Event listener for search history buttons
$(".btn-secondary").each(function () {
  $(this).on("click", function () {
    searchText.value = $(this).attr("id");
    // searchedCity = $(this).attr("id");
    searchCity();
  });
});

searchBtn.addEventListener("click", searchCity);

// +++++++++++++++++++++++++
// Generates the geocoding URL and calls the getCoordinates function. Saves the search to local storage
// *************************
function searchCity() {
  var searchedCity = searchText.value;

  //   Add the most recent search to the array of savedSearches
  savedSearches.unshift(searchedCity);

  //   Get unique values and create new array so there aren't duplicate searches
  var uniqueSearches = [...new Set(savedSearches)];

  //   Keep the list of saved searches to 10
  if (uniqueSearches.length > 10) {
    uniqueSearches.pop();
  }

  localStorage.setItem("weatherSearchHistory", JSON.stringify(uniqueSearches));

  var geocodingURL = `http://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&q=${searchedCity}`;
  getCoordinates(geocodingURL);

  if (event) {
    event.preventDefault();
  }
}

// +++++++++++++++++++++++++
// Makes a call to the geocoding API and retrieves the Latitude/Longitude for the getCurrentWeather and getForecast urls
// Then calls getCurrentWeath and getForecast Functions
// *************************
function getCoordinates(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (coordinateData) {
      var cityLongitude = coordinateData[0].lon;
      var cityLatitude = coordinateData[0].lat;
      var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLatitude}&lon=${cityLongitude}&units=${searchUnits}&appid=${apiKey}`;
      var forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLatitude}&lon=${cityLongitude}&units=${searchUnits}&appid=${apiKey}`;
      getCurrentWeather(currentWeatherURL);
      getForecast(forecastWeatherURL);
    });
}

// *************************
// Makes call to Current Weather API and populates the web page
// *************************
function getCurrentWeather(url) {
  var searchedCity = searchText.value;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentWeatherData) {
      var currentDate = dayjs.unix(currentWeatherData.dt).format("M/D/YYYY");
      var currentWeather = currentWeatherData.weather[0].main;
      var currentTemp = currentWeatherData.main.temp;
      var currentWind = currentWeatherData.wind.speed;
      var currentHumidity = currentWeatherData.main.humidity;
      var currentWeatherEmoji = getWeatherEmoji(currentWeather);
      $("#currentWeather")
        .children("h2")
        .text(`${searchedCity} (${currentDate})  ${currentWeatherEmoji}`);
      $("#currentTemp").text(`Temp: ${currentTemp} °F`);
      $("#currentWind").text(`Wind: ${currentWind} MPH`);
      $("#currentHumidity").text(`Humidity: ${currentHumidity} %`);
    });
}

// *************************
// Makes call to 5 day forecast API and populates the web page
// *************************
function getForecast(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (forecastWeatherData) {
      for (let i = 0, j = 4; i < 5; i++, j += 8) {
        var forecastDate = dayjs
          .unix(forecastWeatherData.list[j].dt)
          .format("M/D/YYYY");
        var forecastWeather = forecastWeatherData.list[j].weather[0].main;
        var forecastTemp = forecastWeatherData.list[j].main.temp;
        var forecastWind = forecastWeatherData.list[j].wind.speed;
        var forecastHumidity = forecastWeatherData.list[j].main.humidity;
        $("#futureWeather")
          .children()
          .eq(i)
          .children()
          .eq(0)
          .text(forecastDate);
        $("#futureWeather")
          .children()
          .eq(i)
          .children()
          .eq(1)
          .text(getWeatherEmoji(forecastWeather));
        $("#futureWeather")
          .children()
          .eq(i)
          .children()
          .eq(2)
          .text(`Temp: ${forecastTemp} °F`);
        $("#futureWeather")
          .children()
          .eq(i)
          .children()
          .eq(3)
          .text(`Wind: ${forecastWind} MPH`);
        $("#futureWeather")
          .children()
          .eq(i)
          .children()
          .eq(4)
          .text(`Humidity: ${forecastHumidity} %`);
      }
    });
}

function createSearchButtons(searchArray) {
  cityBtnsContainer.innerHTML = "";
  for (let i = 0; i < searchArray.length; i++) {
    var newButton = document.createElement("button");
    newButton.setAttribute("class", "btn btn-secondary");
    newButton.setAttribute("id", searchArray[i]);
    newButton.textContent = searchArray[i];
    cityBtnsContainer.append(newButton);
  }
}

// Returns the weather icon to be displayed
function getWeatherEmoji(weatherMain) {
  if (weatherMain === "Clear") {
    return "☀️";
  } else if (weatherMain === "Clouds") {
    return "☁️";
  } else if (weatherMain === "Rain") {
    return "🌧";
  } else if (weatherMain === "Snow") {
    return "❄️";
  } else if (weatherMain === "Mist") {
    return "🌫";
  } else if (weatherMain === "Fog") {
    return "🌫";
  } else if (weatherMain === "Haze") {
    return "🌫";
  }
}
