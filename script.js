// ======================================
// WEATHER AI PREMIUM
// script.js - PART 1
// ======================================

// Element HTML
const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const dailyForecast = document.getElementById("dailyForecast");

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

// ==============================
// Jam Real-Time
// ==============================

function updateClock() {
    const now = new Date();

    dateTime.textContent = now.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

setInterval(updateClock, 1000);
updateClock();

// ==============================
// Ikon Cuaca
// ==============================

function weatherText(code) {

    if (code === 0) return "☀️ Cerah";
    if (code <= 2) return "🌤️ Cerah Berawan";
    if (code === 3) return "☁️ Mendung";
    if (code <= 55) return "🌦️ Gerimis";
    if (code <= 65) return "🌧️ Hujan";
    if (code <= 75) return "❄️ Salju";
    if (code <= 82) return "🌧️ Hujan Lebat";
    if (code >= 95) return "⛈️ Badai";

    return "🌍 Tidak diketahui";

}

// ==============================
// Ambil Cuaca
// ==============================

async function getWeather(lat, lon) {

    const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

    const response = await fetch(url);

    const data = await response.json();

    temp.textContent =
        data.current.temperature_2m + "°C";

    humidity.textContent =
        data.current.relative_humidity_2m + "%";

    wind.textContent =
        data.current.wind_speed_10m + " km/jam";

    condition.textContent =
        weatherText(data.current.weather_code);

    tampilForecast(data.daily);

}

// =================================
// GPS Otomatis
// =================================

navigator.geolocation.getCurrentPosition(

function(pos){

const lat = pos.coords.latitude;

const lon = pos.coords.longitude;

cityName.textContent = "Lokasi Saya";

getWeather(lat,lon);

},

function(){

cityName.textContent="GPS Tidak Diizinkan";

}

);// ======================================
// WEATHER AI PREMIUM
// script.js - PART 2
// ======================================

// ==============================
// Forecast 7 Hari
// ==============================

function tampilForecast(daily){

    dailyForecast.innerHTML = "";

    for(let i = 0; i < daily.time.length; i++){

        const card = document.createElement("div");

        card.className = "card";

        const tanggal = new Date(daily.time[i]);

        const hari = tanggal.toLocaleDateString("id-ID",{
            weekday:"short"
        });

        card.innerHTML = `
            <h3>${hari}</h3>
            <h1>${weatherEmoji(daily.weather_code[i])}</h1>
            <p>Maks : ${daily.temperature_2m_max[i]}°C</p>
            <p>Min : ${daily.temperature_2m_min[i]}°C</p>
        `;

        dailyForecast.appendChild(card);

    }

}

// ==============================
// Emoji Cuaca
// ==============================

function weatherEmoji(code){

    if(code == 0) return "☀️";

    if(code <= 2) return "🌤️";

    if(code == 3) return "☁️";

    if(code <= 55) return "🌦️";

    if(code <= 65) return "🌧️";

    if(code <= 75) return "❄️";

    if(code <= 82) return "🌧️";

    if(code >= 95) return "⛈️";

    return "🌍";

}

// ==============================
// Cari Kota
// ==============================

searchBtn.addEventListener("click", cariKota);

searchInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        cariKota();

    }

});

async function cariKota(){

    const kota = searchInput.value.trim();

    if(kota === ""){

        alert("Masukkan nama kota.");

        return;

    }

    try{

        const url =
`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`;

        const response = await fetch(url);

        const data = await response.json();

        if(!data.results){

            alert("Kota tidak ditemukan.");

            return;

        }

        const hasil = data.results[0];

        cityName.textContent =
        hasil.name + ", " + hasil.country;

        getWeather(
            hasil.latitude,
            hasil.longitude
        );

    }

    catch(err){

        console.log(err);

        alert("Terjadi kesalahan.");

    }

}
