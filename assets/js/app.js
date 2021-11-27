var searchBoxEl = document.querySelector("#search")
var clearBtnEl = document.querySelector("#clear")
var cityInputEl = document.querySelector(".validate")
var btnContainerEl = document.querySelector(".btn-container")
var todayEl = document.querySelector("#today")
var fiveDayEl = document.querySelector(".five-day")

var today = moment().format("MMM Do");
var myAPIKey = 'b58b9f0f57c16a04f0ddb33fe7147ac6'
var recentSearch = [];

var setTodayDate = function() {
    todayEl.closest("span").textContent = today;
    var eachDay = fiveDayEl.children;

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
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${myAPIKey}`
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data)
                });
                generateRecentSearchBtn(cityName);
                localStorage.setItem("cities", JSON.stringify(recentSearch))
                loadRecentSearch();
            }
            else {
                alert("City Not Found")
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




if (localStorage.getItem("cities")) {
    loadRecentSearch();
}


searchBoxEl.addEventListener("click", submitBtnHandler)
clearBtnEl.addEventListener("click", clearBtnHandler)
btnContainerEl.addEventListener("click", getWeatherFromBtn)

setTodayDate();