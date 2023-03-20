var key = 'efb078ba60c7b8c3d3a1c4131546c390';

var date = dayjs().format('MM/DD/YYYY');
var dateTime = dayjs().format ('MM/DD/YYYY HH:mm:ss')

let city; // global city value
var cityHist = [];

// search for city name on click
$('.search').on("click", function (event) {
    event.preventDefault(); // prevents refresh
    
    city = document.getElementById("cityName").value // gets city input as value

    if (city === ""){ // makes sure there is something in city name
        return;
    };
    cityHist.push(city); // adds city value to history

    localStorage.setItem('city',JSON.stringify(cityHist)); // sets city in local storage
    fiveForecastEl.empty(); // clears five forcast for new incoming data
    getHistory(); // executes get history
    getWeatherToday(); // executes get weather
});

var constHistEl = $('.cityHist');

function getHistory() {
    constHistEl.empty();
    for (let i = 0; i < cityHist.length; i++) { // adds cities listed in history on the side of the screen as buttons
        var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHist[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		constHistEl.prepend(rowEl);
		rowEl.append(btnEl);
    } if (!city) { // stops if no more cities are available
        return;
    }

    $(".histBtn").on("click", function (event) { // allows older cities to be clicked and have data on the displayed
        event.preventDefault();
        city = $this.text();
        fiveForecastEl.empty();
        getWeatherToday();
    })
};

var cardTodayBody = $(".cardBodyToday")

function getWeatherToday() {
    var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`; // gets data for new city value

    $(cardTodayBody).empty(); // empties it for new incoming data

    $.ajax({
        url: getUrlCurrent,
        method: "GET",
    }).then(function (response){
        $('.cardTodayCityName').text(response.name); // inserts city name in html
		$('.cardTodayDate').text(date); // inserts date in placeholder
		
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`); // adds weather image
		
        // adds temp, wind, and humidity to html
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
    var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`; // search for 5 day forecast for data

    $.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) { // displays data in array
		var fiveDayArray = response.list;
		var myWeather = [];

		$.each(fiveDayArray, function (index, value) {
			testObj = { // sorts desired data into values and then each value is given a name to be called
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity,
                wind: value.wind.speed
			}
            if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
        })
        
        // for loop to create the 5 day forecast using the stored data
        for (let i = 0; i < myWeather.length; i++) { 
            var divElCard = $('<div>');

			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne'); // setting styling
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');

			divElHeader.attr('class', 'card-header')

			var m = dayjs(`${myWeather[i].date}`).format('MM/DD/YYYY'); // adding date to header of card

			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');

			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>'); // adding image from data to be displayed in card

			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`); // adding temperature to be displayed in card

			divElBody.append(pElTemp);

            var pElWind = $('<p>').text(`Wind Speed: ${myWeather[i].wind} MPH`); // adding wind to be displayed in card

			divElBody.append(pElWind);

			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`); // adding humidity to be displayed in card

			divElBody.append(pElHumid);
        }
    });
};

function initLoad() { // on initial load
    var cityHistStore = JSON.parse(localStorage.getItem("city")); // add stored cities to oage

    if(cityHistStore !== null) {
        cityHist = cityHistStore
    }

    getHistory(); // gets history
    getWeatherToday(); // gets weather today
};

// executes initial load
initLoad(); 