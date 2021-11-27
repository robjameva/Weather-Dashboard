var searchBoxEl = document.querySelector("#search")
var clearBtnEl = document.querySelector("#clear")
var cityInputEl = document.querySelector(".validate")
var btnContainerEl = document.querySelector(".btn-container")
var todayEl = document.querySelector("#today")
var fiveDayEl = document.querySelector(".five-day")
var cityDisplayEl = document.querySelector("#jumbotron");
var tempEl = document.querySelector("#main-temp");
var windEl = document.querySelector("#main-wind");
var humidEl = document.querySelector("#main-humid");
var uvEl = document.querySelector("#main-uv");
var lat;
var lon;


var today = moment().format("MMM Do");
var myAPIKey = 'b58b9f0f57c16a04f0ddb33fe7147ac6'
var recentSearch = [];
var currentCity = "";
var eachDay = fiveDayEl.children;

var setDates = function() {
    todayEl.closest("span").textContent = today;

    for (var i = 0; i < eachDay.length; i++) {
        var child = eachDay[i];
        child.children[0].textContent = moment().add(i + 1, 'days').format("MMM Do");
    }
}


var submitBtnHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if (city) {
        getWeather(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please Enter a City Name")
    }

}


var getWeather = function(cityName) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${myAPIKey}&units=imperial`
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    tempEl.textContent = data.list[2].main.temp;
                    windEl.textContent = data.list[2].wind.speed;
                    humidEl.textContent = data.list[2].main.humidity;
                    lat = data.city.coord.lat;
                    lon = data.city.coord.lon;
                    setUVIndex();
                    console.log(data)
                    // Editing each item in the 5 day forcast needs work
                    for (var i = 0; i < eachDay.length; i++) {
                        var child = eachDay[i];
                        child.children[2].textContent = data.list[2].main.temp;
                    }

                });
                generateRecentSearchBtn(cityName);
                localStorage.setItem("cities", JSON.stringify(recentSearch))
                currentCity = cityName;
                displayCity();
                loadRecentSearch();
            }
            else {
                alert("City Not Found")
            }
        })
}

var setUVIndex = function() {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${myAPIKey}`
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    uvEl.textContent = data.current.uvi;
                });
            }

        })
}

var generateRecentSearchBtn = function(city) {
    if (!recentSearch.includes(city) && recentSearch.length < 10) {
        var cityBtnEl = document.createElement("a");
        cityBtnEl.classList = "waves-effect waves-light btn-large search-btn";
        cityBtnEl.setAttribute("data-city", city)
        cityBtnEl.textContent = city;

        btnContainerEl.appendChild(cityBtnEl);
        recentSearch.push(city);

    }
    else if (recentSearch.length === 10) {
        recentSearch.shift()
        recentSearch.push(city);
        localStorage.setItem("cities", JSON.stringify(recentSearch))
        loadRecentSearch();
    }
}

var getWeatherFromBtn = function(event) {
    var city = event.target.getAttribute("data-city");
    getWeather(city);
}


var clearBtnHandler = function() {
    var loadedSearches = JSON.parse(localStorage.getItem("cities"))
    for (let i = 0; i < loadedSearches.length; i++) {
        var btnEl = document.querySelector(".search-btn");
        btnContainerEl.removeChild(btnEl);
    }
    recentSearch = [];
    localStorage.setItem("cities", "");
}


var loadRecentSearch = function() {
    var loadedSearches = JSON.parse(localStorage.getItem("cities"))

    for (let i = 0; i < loadedSearches.length; i++) {
        generateRecentSearchBtn(loadedSearches[i]);
    }
}

var displayCity = function() {
    var words = currentCity.split(' ');
    var result = "";
    for (var i = 0; i < words.length; i++) {
        var word = words[i]
        var firstLetter = word[0]
        var otherLetters = word.slice(1);
        var upper = firstLetter.toUpperCase();
        result += upper + otherLetters + " ";
    }
    currentCity = result.trim();
    cityDisplayEl.textContent = currentCity;
}














if (localStorage.getItem("cities")) {
    loadRecentSearch();
}

searchBoxEl.addEventListener("click", submitBtnHandler)
clearBtnEl.addEventListener("click", clearBtnHandler)
btnContainerEl.addEventListener("click", getWeatherFromBtn)

getWeather("New Jersey");
setDates();