var searchBoxEl = document.querySelector("#search")
var cityInputEl = document.querySelector(".validate")
var btnContainerEl = document.querySelector(".btn-container")

var myAPIKey = 'b58b9f0f57c16a04f0ddb33fe7147ac6'
var recentSearch = [];


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

