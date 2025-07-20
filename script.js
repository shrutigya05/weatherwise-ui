const apiKey = 'b206f62602d5ad29ca5515559997edff';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const input = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const locateBtn = document.getElementById('locate-btn');

const tempEl = document.querySelector('.temp');
const cityEl = document.querySelector('.city');
const datetimeEl = document.querySelector('.datetime');
const humidityEl = document.querySelector('.humidity');
const windEl = document.querySelector('.wind');
const iconEl = document.getElementById('weather-icon');
const body = document.body;

// Search on click or Enter
searchBtn.addEventListener('click', onClickSearch);
input.addEventListener('keydown', e => { if (e.key === 'Enter') onClickSearch(); });

function onClickSearch() {
  const val = input.value.trim();
  if (val) checkWeather(val);
}

locateBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    () => alert('Location access denied.')
  );
});

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    displayWeather(data);
  } catch {
    alert('Unable to find weather for your location.');
  }
}

async function checkWeather(city) {
  try {
    const res = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    displayWeather(data);
  } catch {
    alert('City not found. Please try again.');
  }
}

function displayWeather(data) {
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  cityEl.textContent = data.name;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} km/h`;

  const now = new Date();
  datetimeEl.textContent = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;

  const weatherMain = data.weather[0].main.toLowerCase();
  let icon = 'sun', bg = 'clear';
  if (weatherMain.includes('cloud')) { icon = 'cloud'; bg = 'cloudy'; }
  else if (weatherMain.includes('rain')) { icon = 'rain'; bg = 'rain'; }
  else if (weatherMain.includes('snow')) { icon = 'snow'; bg = 'snow'; }
  
  iconEl.src = `assets/icons/${icon}.png`;
  body.style.backgroundImage = `url('assets/bg/${bg}.jpg')`;
}
