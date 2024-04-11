const API = "6162788921311ac96f2bc331d5a652d5";

const inputValue = document.querySelector(".form__input");
const submitBtn = document.querySelector(".form__button");
const cityNameElement = document.querySelector(".main__city");
const cityDegreeElement = document.querySelector(".main__degree");
const cityMaxDegree = document.querySelector(".main__max-degree");
const cityMinDegree = document.querySelector(".main__min-degree");
const cityHumidity = document.querySelector(".main__humidity");
const cityWind = document.querySelector(".main__wind");
const cityImg = document.querySelector('.main__img-item')






// Запрашиваем разрешение на использование геолокации

window.onload = function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.log("Геолокация не поддерживается вашим браузером");
    }
}


function successCallback(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getCityByGeo(latitude,longitude)

}


function errorCallback(error) {
    console.error("Ошибка при получении геолокации:", error.message);

}


// Получаем данные геолокации при разрешении

async function getCityByGeo(lat,lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`
        );
        const cityData = await res.json();
        const cityName = cityData.name
        
        cityNameElement.innerHTML = cityData.name;
        cityDegreeElement.innerHTML = `${(cityData.main.temp - 273).toFixed()}°`;
        cityMaxDegree.innerHTML = `${cityData.main.temp_max.toFixed()}°C`;
        cityMinDegree.innerHTML = `${cityData.main.temp_min.toFixed()}°C`;
        cityHumidity.textContent = `${cityData.main.humidity}%`
        cityWind.textContent = `${cityData.wind.speed} km/h`
        cityImg.src = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`

        getWeeklyForcast(cityName);

    } catch (error) {
        console.log(error);
    }
}

// Получаем данные от пользователя введеные вручную

async function getCityWeather(cityName) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}`
        );
        const cityData = await res.json();

        cityNameElement.innerHTML = cityData.name;
        cityDegreeElement.innerHTML = `${(cityData.main.temp - 273).toFixed()}°`;
        cityMaxDegree.innerHTML = `${cityData.main.temp_max.toFixed()}°C`;
        cityMinDegree.innerHTML = `${cityData.main.temp_min.toFixed()}°C`;
        cityHumidity.textContent = `${cityData.main.humidity}%`
        cityWind.textContent = `${cityData.wind.speed} km/h`
        cityImg.src = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`


        getWeeklyForcast(cityName);
    } catch (error) {
        alert(error.message)
    }
}


// Получаем массив из прогнозов

async function getWeeklyForcast(cityName) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API}`
        );
        const cityData = await res.json();


        const dailyForecasts = filterDailyForecasts(cityData.list);

        // Отфильтрованный список прогнозов
        renderWeeklyForecast(dailyForecasts);
    } catch (error) {
        alert(error.message);
    }

}



// Фильтруем по дням

function filterDailyForecasts(list) {
    const dailyForecasts = {};
    list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]; 
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });

    return Object.values(dailyForecasts);
}


// Рендерим недельный прогноз

function renderWeeklyForecast(list) {
    const weeklyList = document.querySelector('.main__weekly-list');
    weeklyList.innerHTML = '';

    list.forEach(forecast => {
        const weeklyItem = document.createElement('li');
        weeklyItem.classList.add('main__weekly-item');

        const degree = document.createElement('p');
        degree.classList.add('main__weekly-degree');
        degree.textContent = `${(forecast.main.temp - 273).toFixed()}°C`;

        const icon = document.createElement('img');
        icon.classList.add('main__weekly-icon');
        icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        icon.alt = 'Weather Icon';

        const date = document.createElement('p');
        date.classList.add('main__weekly-date');
        date.textContent = new Date(forecast.dt_txt).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); // Форматируем дату

        weeklyItem.appendChild(degree);
        weeklyItem.appendChild(icon);
        weeklyItem.appendChild(date);

        weeklyList.appendChild(weeklyItem);
    });
}



// Отправка запроса

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cityName = inputValue.value.trim();
    if (cityName !== "") {
        getCityWeather(cityName);
    } else {
        alert("Please enter a city name");
    }
});



