var searchFormEl = $(`#search-form`);
var resultContentEl = $(`#result-content`);
var msgEl = $(`#msg`);

const defaultLcoation = {lat:32.779167, lon:-96.808891};
const apiKey = 'efb078ba60c7b8c3d3a1c4131546c390';

$(function () {
    function displayWeather(weatherObj, cityName) {
        resultContentEl.empty();

        var currentWeatherEl = $(`<div>`).addClass(`current-content w-100`);
        var forecastWeatherEl = $(`<div>`).addClass(`current-content w-100`);

        for (var i = 0; i < weatherObj.length; i+=8) {          
            var cardEl = $(`<div>`).addClass(`card col-md-2 col-12`);
           
            var d = new Date(weatherObj[i].dt * 1000);
            var timeStamp = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;

            var iconID = weatherObj[i].weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/wn/${iconID}@2x.png`;
            var iconEl = $('<img>').attr(`src`, iconUrl).addClass(`icon img-fluid`);

            var TempEl = $('<div>').addClass(`py-2`).text(`Temp: ${weatherObj[i].main.temp} \u2109`);
            var windEl = $('<div>').addClass(`py-2`).text(`Wind: ${weatherObj[i].wind.speed} MPH`);
            var HumEl = $('<div>').addClass(`py-2`).text(`Humidity: ${weatherObj[i].main.humidity} %`);

            if (!i) {
                var currentTitleEl = $('<div>').addClass(`h2 align-items-center`);
                currentTitleEl.text(`${cityName} (${timeStamp})`);
                currentTitleEl.append(iconEl);
                currentWeatherEl.append(currentTitleEl, TempEl, windEl, HumEl);
            } else {
                var forecastDateEl = $('<div>').text(`${timeStamp}`);
                cardEl.append(forecastDateEl, iconEl, TempEl, windEl, HumEl);
                forecastWeatherEl.append(cardEl);
            }
        }

        var textEl = $('<div>').addClass(`h3`).text(`5-Day Forecast:`);
        resultContentEl.append(currentWeatherEl, textEl, forecastWeatherEl);
    }

});