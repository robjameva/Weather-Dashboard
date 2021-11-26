var searchBoxEl = document.querySelector("#search")
var cityInputEl = document.querySelector(".validate")



var submitBtnHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    console.log(city);
}







searchBoxEl.addEventListener("click", submitBtnHandler)
