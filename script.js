var city = "";
var APIKey = "";
var forcastUrl = "";
var queryUrl = "";
var weatherUrl = "";
var searchCity = document.getElementById("previousSearches");
var differentCities = [];

init();
listClick();
searchClick();

function init() {
    var savedCity = JSON.parse(localStorage.getItem("differentCities"));
    if (savedCity != null) {
        differentCities = savedCity
    }
    renderButtons();
}

function saveSearches() {
    localStorage.setItem("differentCities", JSON.stringify(differentCities));
}

function renderButtons() {
    searchCity.innerHTML = "";
    if (differentCities == null) {
        return;
    }
    var previousCities = [...new Set(differentCities)];
    for (var i = 0; i < previousCities.length; i++) {
        var nameCity = previousCities[i];
        var buttonElement = document.createElement("button");
        buttonElement.textContent = nameCity;
        buttonElement.setAttribute("class", "listbtn");
        searchCity.appendChild(buttonElement);
        listClick();
    }

}
function listClick() {
    $(".listbtn").on("click", function (e) {
        event.preventDefault();
        city = $(this).text().trim();
        APIcalls();

    })
}
function searchClick() {
    $("#searchBtn").on("click", function (e) {
        event.preventDefault();
        city = $(this).prev().val().trim();
        differentCities.push(city);
        if (differentCities.length > 8) {
            differentCities.shift()
        }

        if (city == "") {
            return;
        }
        APIcalls();
        saveSearches();
        renderButtons();
    })
}

function APIcalls() {
    forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
    weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=ea42a1210d1c0c2d7b6990d0d1323fe7";
    queryUrl = forcastUrl + city + APIkey;
    currentWeatherUrl = weatherUrl + city + APIkey;

    $("#cityName").text("Today's Weather in " + city);
    $.ajax({
        url: queryUrl,
        method: "GET",
    })

        .then(function (response) {
            var dayNumber = 0;

            for (let i = 0; i < response.list.length; i++) {

                if (response.list[i].dt_txt.split(" ")[1] == "15:00:00") {
                    var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                    var month = response.list[i].dt_txt.split("-")[1];
                    var year = response.list[i].dt_txt.split("-")[0];
                    $("#" + "day" + dayNumber).text(month + "/" + day + "/" + year);
                    var temp = Math.round(((response.list[i].main.temp - 273.15) * 9 / 5 + 32));
                    $("#" + dayNumber + "fiveDayTemp").text("Temp: " + temp + String.fromCharCode(176) + "F");
                    $("#" + dayNumber + "fiveDayHumidity").text("Humidity: " + response.list[i].main.humidity);
                    $("#" + dayNumber + "fiveDayImg").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    console.log(response.list[i].dt_txt.split("-"));
                    console.log(dayNumber);
                    console.log(response.list[i].main.temp);
                    dayNumber++;


                }
            }
        });


    $.ajax({
        url: currentWeatherUrl,
        method: "GET",
    }).then(function (currentData) {
        console.log(currentData);
        var temp = Math.round(((currentData.main.temp - 273.15) * 9 / 5 + 32))
        console.log("The temperature in " + city + " is: " + temp);
        $("#todayTemp").text("Temperature: " + temp + String.fromCharCode(176) + "F");
        $("#todayHumidity").text("Humidity: " + currentData.main.humidity);
        $("#todayWindSpeed").text("Wind Speed: " + currentData.wind.speed);
        $("#todayImgSection").attr({
            "src": "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png",
            "height": "100px", "width": "100px"
        });
    })
}
