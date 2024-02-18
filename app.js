
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weatherContainear = document.querySelector(".weather-containear");
const grantAccessContainear = document.querySelector(".grant-location-containear");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-containear");
const userInfoContainear = document.querySelector(".user-info-containear")


let currentTab = userTab;
const API_KEY = "529c45b013dc5df55f915ffc65961c9a";
currentTab.classList.add("current-tab")
getFromSessionStroage();

function switchTab(clickedTab) {
     if (clickedTab != currentTab) {
          currentTab.classList.remove("current-tab");
          currentTab = clickedTab;
          currentTab.classList.add("current-tab");

          if (!searchForm.classList.contains("active")) {
               userInfoContainear.classList.remove("active")
               grantAccessContainear.classList.remove("active")
               searchForm.classList.add("active")
          }
          else {
               searchForm.classList.remove("active")
               userInfoContainear.classList.remove("active")
               getFromSessionStroage();
          }

     }
}


userTab.addEventListener("click", () => {
     switchTab(userTab);
});


searchTab.addEventListener("click", () => {
     switchTab(searchTab);
});

function getFromSessionStroage() {
     const localCoordinate = sessionStorage.getItem("user-coordinate");
     if (!localCoordinate) {
          grantAccessContainear.classList.add("active");
     }
     else {
          const coordinate = JSON.parse(localCoordinate);
          fetchUserWeatherInfo(coordinate);
     }
}

async function fetchUserWeatherInfo(coordinate) {
     const { lat, lon } = coordinate;
     grantAccessContainear.classList.remove("active");
     loadingScreen.classList.add("active");

     //     making api call

     try {
          const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

          const data = await responce.json();

          loadingScreen.classList.remove("active");
          userInfoContainear.classList.add("active");
          renderWeatherInfo(data);

          
     }
     catch (err) {
          loadingScreen.classList.remove("active");
          console.log("elemnt not get")
     }
}

function renderWeatherInfo(weatherInfo) {
     //  fetching elemnt

     const cityName = document.querySelector("[data-cityName]");
     const countryIcon = document.querySelector("[data-countyIcon]");
     const desc = document.querySelector("[data-weatherDescription]");
     const weatherIcon = document.querySelector("[data-weatherIcon]");
     const temp = document.querySelector("[data-temp]");
     const windSpeed = document.querySelector("[data-windSpeed]");
     const humadity = document.querySelector("[data-humidaty]");
     const cloudiness = document.querySelector("[data-cloudiness]");

     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = `${weatherInfo?.main?.temp}  °C` ;
     windSpeed.innerText = `${weatherInfo?.wind?.speed}  m/s` ;
     humadity.innerText = `${weatherInfo?.main?.humidity} %`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {
     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition)
     }

     else {

          alert("Gelocation is not support avalabe for  your system");
     }
}

function showPosition(position) {
     const userCoordnates = {

          lat: position.coords.latitude,
          lon: position.coords.longitude

     }
     sessionStorage.setItem("user-coordinate", JSON.stringify(userCoordnates));
     fetchUserWeatherInfo(userCoordnates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
     e.preventDefault();
     let cityName = searchInput.value

     if (cityName === "")
          return;
     else
          fetchSearchWeatherInfo(cityName);
     // fetchWeatherInfo(cityName);

});

async function fetchSearchWeatherInfo(city) {
     loadingScreen.classList.add("active");
     userInfoContainear.classList.remove("active");
     grantAccessContainear.classList.remove("active");

     try {
          const response = await fetch(
               `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );

          const data = await response.json();
          loadingScreen.classList.remove("active");
          userInfoContainear.classList.add("active");
          renderWeatherInfo(data);
     }



     catch (err) {


     }
}