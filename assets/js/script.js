


var currentDay = dayjs().format('M/D/YYYY');
var userForm = $('#city-search');
var apiKey = 'c72e2abba2b2e0813146c0d98d482b45';
var openWeatherCoordinates = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
var cityInput = $('#city');
var searchHistory = $('#search-history');
const weatherIconUrl = 'https://openweathermap.org/img/wn/';
var searchHistoryArray;

searchHistoryArray = getSearchHistory();


function getSearchHistory () {
 
            return JSON.parse(localStorage.getItem('search history')) || { cities: [] };
    
    }
    


function keepSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
}


function getHistory(city) {
    var searchHistoryBtn = $('<button>')
    .addClass('btn')
    .text(city)
    .on('click', function () {
        $('#current-weather').remove();
        $('#five-day').empty();
        $('#five-day-header').remove();
        getWeather(city);
    })
    .attr({
        type: 'button'
    });
    searchHistory.append(searchHistoryBtn);
}


function updateHistory(cityName, searchHistory) {
    searchHistoryArray = searchHistoryArray || { cities: [] };
    searchHistoryArray.cities.push(cityName);
    getHistory(cityName, searchHistory);
    keepSearchHistory();
}




function citySearch(event) {
    event.preventDefault();
    let city = cityInput.val().trim();
    if (city !== '') {
        updateHistory(city, searchHistory);
        cityInput.val('');
    }

    if (searchHistoryArray.cities.includes(city)) {
        alert('Please click the ' + city + ' button to get the weather.');
        cityInput.val('');
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryArray.cities.push(city);
        keepSearchHistory();
        cityInput.val('');
    } else {
        alert('Please enter a city');
    }
}



userForm.on('submit', citySearch);

function getWeather (city) {
    
    var apiCoordinatesUrl = openWeatherCoordinates + city + '&appid=' + apiKey;
    fetch(apiCoordinatesUrl)
    .then(function(coordinateResponse) {
        if (coordinateResponse.ok) {
           return coordinateResponse.json()
           
            .then(function (data){
                var cityLatitude = data.coord.lat;
                var cityLongitude = data.coord.lon;
                var apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + apiKey + '&units=imperial';
            

                fetch(apiOneCallUrl)
                .then(function (weatherResponse) {
                    if (weatherResponse.ok) {
                        weatherResponse.json().then(function (weatherData) {
                            var currentWeather= $('<div>')
                            .attr({
                                id: 'current-weather'
                            })
                            var weatherIcon = weatherData.current.weather[0].icon;
                            var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';
                            var currentWeatherHeading = $('<h2>')
                            .text(city + ' (' + currentDay + ')');
                            var iconImg = $('<img>')
                            .attr({
                                id: 'current-weather-icon',
                                src: cityCurrentWeatherIcon, 
                                alt: 'Weather Icon'
                            })
                            var currentWeatherList = $('<ul>')
                            var currentWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%']


                            for (var i = 0; i < currentWeatherDetails.length; i++) {
                                var currentWeatherListItem = $('<li>')
                                    .text(currentWeatherDetails[i])
                                currentWeatherList.append(currentWeatherListItem);
                            }


                            $('#five-day').before(currentWeather);
                            currentWeather.append(currentWeatherHeading);
                            currentWeatherHeading.append(iconImg);
                            currentWeather.append(currentWeatherList);


                            var fiveDayHeader = $('<h2>')
                            .text('5-Day-Forecast:')
                            .attr({
                                id: 'five-day-header'
                            })
                            $('#current-weather').after(fiveDayHeader)

                            var fiveDayArray = [];

                            for (var i = 0; i < 5; i++) {
                                let forecastDate = dayjs().add (i + 1, 'days').format('M/DD/YYYY');
                                fiveDayArray.push(forecastDate);

                            }

                        for (var i = 0; i < fiveDayArray.length; i++) {
                         var listingBodyDiv = $('<div>').addClass('listing-body');

                         var listingTitle = $('<h3>').addClass('listing-title').text(fiveDayArray[i]);
                        var forecastIcon = weatherData.daily[i].weather[0].icon;

                        var forecastIcon = $('<img>').attr({
                        src: weatherIconUrl + forecastIcon + '.png',
                        alt: 'Weather Icon'
                         });

                        var currentWeatherDetails = [
                        'Temp: ' + weatherData.daily[i].temp.max + ' °F',
                        'Wind: ' + weatherData.daily[i].wind_speed + ' MPH',
                        'Humidity: ' + weatherData.daily[i].humidity + '%'
                        ];

                        var temp = $('<p>').addClass('listing-text').text(currentWeatherDetails[0]);
                        var wind = $('<p>').addClass('listing-text').text(currentWeatherDetails[1]);
                        var humidity = $('<p>').addClass('listing-text').text(currentWeatherDetails[2]);

                        listingBodyDiv.append(listingTitle);
                        listingBodyDiv.append(forecastIcon);
                        listingBodyDiv.append(temp);
                        listingBodyDiv.append(wind);
                        listingBodyDiv.append(humidity);
                       
                        

                        $('#five-day').append(listingBodyDiv);
                    }
                    })
                }
            })
        });
    }
});


$('#search-btn').on('click', function () {
    $('#current-weather').remove();
    $('#five-day').empty();
    $('#five-day-header').remove();
})}



