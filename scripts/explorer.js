const accessKeyCountry = 'H8ECoGw34rXidUKIXhb1UircpLTw3RV7pNRYe747';


const destinations = [
    {
        searchTerm: "Maldives tropical beach",
        name: "Maldives Beach",
        country: "Maldives",
        latitude: 3.2028,
        longitude: 73.2207,
        timezone: "Indian/Maldives"
    },
    {
        searchTerm: "Bali beach Indonesia",
        name: "Bali Beach",
        country: "Indonesia",
        latitude: -8.3405,
        longitude: 115.0920,
        timezone: "Asia/Makassar"
        
    },
    {
        searchTerm: "Nungwi beach Zanzibar",
        name: "Zanzibar Beach",
        country: "Tanzania",
        latitude: -5.7280,
        longitude: 39.2982,
        timezone: "Africa/Dar_es_Salaam"
    },
    {
        searchTerm: "El Nido Palawan Philippines",
        name: "Palawan Beach",
        country: "Philippines",
        latitude: 11.2027,
        longitude: 119.4573,
        timezone: "Asia/Manila"
    },
    {
        searchTerm: "Bora Bora beach",
        name: "Bora Bora Beach",
        country: "French Polynesia",
        latitude: -16.5004,
        longitude: -151.7415,
        timezone: "Pacific/Tahiti"
    },
    {
        searchTerm: "Mauritius beach",
        name: "Mauritius Beach",
        country: "Mauritius",
        latitude: -20.3484,
        longitude: 57.5522,
         timezone: "Indian/Mauritius"
    },
    {
        searchTerm: "Fernando de Noronha Brazil",
        name: "Fernando de Noronha",
        country: "Brazil",
        latitude: -3.8547,
        longitude: -32.4233,
        timezone: "America/Noronha"
        
    },
    {
        searchTerm: "Punta Cana beach",
        name: "Punta Cana",
        country: "Dominican Republic",
        latitude: 18.5601,
        longitude: -68.3725,
        timezone: "America/Santo_Domingo"
    },
    {
        searchTerm: "Seven Mile Beach Jamaica",
        name: "Seven Mile Beach",
        country: "Jamaica",
        latitude: 18.2746,
        longitude: -78.3692,
        timezone: "America/Jamaica"
    },
    {
        searchTerm: "Eagle Beach Aruba",
        name: "Eagle Beach",
        country: "Aruba",
        latitude: 12.5519,
        longitude: -70.0552,
        timezone: "America/Aruba"
    },
    {
        searchTerm: "Varadero beach Cuba",
        name: "Varadero Beach",
        country: "Cuba",
        latitude: 23.1790,
        longitude: -81.1890,
        timezone: "America/Havana"
    },
    {
        searchTerm: "Bahamas beach",
        name: "Bahamas Beach",
        country: "Bahamas",
        latitude: 25.0343,
        longitude: -77.3963,
        timezone: "America/Nassau"
    },
    {
        searchTerm: "St Lucia beach",
        name: "Sugar Beach",
        country: "Saint Lucia",
        latitude: 13.8567,
        longitude: -61.0569,
        timezone: "America/St_Lucia"
    }
];

function getWeatherDescription(code){

    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        48: "Fog 🌫️",
        51: "Light Drizzle 🌦️",
        61: "Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        80: "Rain Showers 🌦️",
        81: "Rain Showers 🌦️",
        95: "Thunderstorm ⛈️"
    };

    return weatherCodes[code] || "Unknown";
};

async function getWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
        );

        if (!response.ok) {
            throw new Error("Weather not found");
        }

        const data = await response.json();

        return {
            temperature: data.current?.temperature_2m ?? "N/A",
            weatherCode: data.current?.weather_code ?? 0
        };

    } catch (error) {

        console.error("Weather Error:", error);

        return {
            temperature: "N/A",
            weatherCode: 0
        };

    }
};

async function getCountryInfo(country) {

    try {

        const response = await fetch(
            `https://api.api-ninjas.com/v1/country?name=${country}`,
            {
                headers: {
                    "X-Api-Key": accessKeyCountry
                }
            }
        );

        const data = await response.json();

        return {
            capital: data[0]?.capital || "Unknown",
            population: data[0]?.population?.toLocaleString() || "Unknown"
        };

    } catch (error) {

        console.error(error);

        return {
            capital: "Unknown",
            population: "Unknown"
        };

    }

};

async function getLocalTime(timezone) {
    try {
        const response = await fetch(
            `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
        );

        if (!response.ok) {
            throw new Error("Timezone not found");
        }

        const data = await response.json();
        return data.time || "N/A";

    } catch (error) {
        console.error("Timezone Error:", timezone, error);
        return "N/A";

    }
};

function toggleFavorite(destinationName){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if(favorites.includes(destinationName)){
        favorites = favorites.filter(item => item !== destinationName);

    } else {
        favorites.push(destinationName);
    }
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
};

document.addEventListener("click", (event) => {
    if(event.target.classList.contains("favorite-btn")){
        const destinationName = event.target.dataset.name;
        toggleFavorite(destinationName);
        event.target.classList.toggle("active");
    }
});


async function getDestination(searchTerm,name,country,latitude, longitude, timezone){

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=1&client_id=${accessKey}`
    );

   

    const data = await response.json();
    const imageUrl = data.results[0].urls.small + "&fm=webp" || "images/default-beach.jpg";
    //console.log(data.results[0].urls);
    const countryInfo = await getCountryInfo(country);
    const weatherInfo = await getWeather(latitude,longitude);
    const celsius = weatherInfo.temperature;
    const fahrenheit = celsius !== "N/A" ? ((celsius * 9) / 5 + 32).toFixed(1): "N/A";
    const localTime = await getLocalTime(timezone);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = favorites.includes(name);
    //console.log("Creating card:", name);
    
    const gallery = document.querySelector("#gallery");

    gallery.insertAdjacentHTML(
            "beforeend",
             `
             <article class="card">
                <a href="destination.html?destination=${encodeURIComponent(name)}"><img src="${imageUrl}" alt="${name}"></a>
                <div class="card-content">
                    <h2>${name}</h2>
                    <p>🌎 ${country}</p>                    
                    <p>🏛️ Capital: ${countryInfo.capital}</p>
                    <p>👥 Country Population: ${countryInfo.population}</p>
                    <p>🌡️ ${celsius}°C | ${fahrenheit}°F</p>
                    <p>🌴 ${getWeatherDescription(weatherInfo.weatherCode)}</p>
                    <p>🕒 Local Time: ${localTime}</p>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}"data-name="${name}">❤️ Favorite</button>
                           
                </div>
            </article>
            `
        );
};


const select = document.querySelector("#destination-filter");
destinations.forEach(destination => {
    select.innerHTML += `<option value="${destination.name}">${destination.name}</option>`;
});

async function renderGallery(list){
    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = "";

    await Promise.all(list.map(destination => getDestination(
        destination.searchTerm,
            destination.name,
            destination.country,
            destination.latitude,
            destination.longitude,
            destination.timezone)
        )
    );
    
};

select.addEventListener("change", (event) => {
    const value = event.target.value;

    if(value === "all"){
        renderGallery(destinations);
        return;
    }
    const filtered = destinations.filter( destination => destination.name === value);
    renderGallery(filtered);

});

renderGallery(destinations);

