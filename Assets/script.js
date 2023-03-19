var key = 'efb078ba60c7b8c3d3a1c4131546c390';
var city = "Dallas";

var date = dayjs().format('DD/MM/YYYY');
var dateTime = dayjs().format ('DD/MM/YYYY HH:mm:ss')

var cityHist = [];

$('.search').on("click", function (event) {
    event.preventDefault();
    city = $(this).parent('.textVal').val().trim(); // ERROR POPS UP HERE
    if (city === ""){
        return;
    };
    cityHist.push(city);

    localStorage.setItem('city',JSON.stringify(cityHist));
    fiveForecastEl.empty();
    getHistory();
    getWeatherToday();
});

var constHistEl = $(".cityHist");

function getHistory() {
    constHistEl.empty();
    for (let i = 0; i < cityHist.length; i++) {
        var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHist[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
    } if (!city) {
        return;
    }

    $(".histBtn").on("click", function (event) {
        event.preventDefault();
        city = $this.text();
        fiveForecastEl.empty();
        getWeatherToday();
    })
};

var cardTodayBody = $(".cardBodyToday")

function getWeatherToday() {
    var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

    $(cardTodayBody).empty();

    $.ajax({
        url: getUrlCurrent,
        method: "GET",
    }).then(function (response){
        $('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
		
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
    });

    getFiveDayForecast();
};

var fiveForecastEl = $(".fiveForecast");

function getFiveDayForecast(){
    var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

    $.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];

		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity,
                // adding changes
                wind: value.wind.speed
			}
            if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
        })

        for (let i = 0; i < myWeather.length; i++) {
            var divElCard = $('<div>');

			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');

			divElHeader.attr('class', 'card-header')

			var m = dayjs(`${myWeather[i].date}`).format('MM/DD/YYYY');

			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');

			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');

			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);

			divElBody.append(pElTemp);

            var pElWind = $('<p>').text(`Wind Speed: ${myWeather[i].wind} MPH`);

			divElBody.append(pElWind);

			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);

			divElBody.append(pElHumid);
        }
    });
};

function initLoad() {
    var cityHistStore = JSON.parse(localStorage.getItem("city"));

    if(cityHistStore !== null) {
        cityHist = cityHistStore
    }

    getHistory();
    getWeatherToday();
};

initLoad();