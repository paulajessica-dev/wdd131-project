const accessKeyCountry = 'H8ECoGw34rXidUKIXhb1UircpLTw3RV7pNRYe747';


const params = new URLSearchParams(window.location.search);
const destinationName = params.get("destination");
console.log(destinationName);


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

        0: {
            description: "Clear Sky",
            icon: "images/weather.svg"
        },

        1: {
            description: "Mainly Clear",
            icon: "images/cloudy-1.svg"
        },

        2: {
            description: "Partly Cloudy",
            icon: "images/cloudy-2.svg"
        },

        3: {
            description: "Overcast",
            icon: "images/cloudy.svg"
        },

        45: {
            description: "Fog",
            icon: "images/cloudy.svg"
        },

        61: {
            description: "Rain",
            icon: "images/rainy-4.svg"
        },

        63: {
            description: "Moderate Rain",
            icon: "images/rainy-5.svg"
        },

        65: {
            description: "Heavy Rain",
            icon: "images/rainy-6.svg"
        },

        95: {
            description: "Thunderstorm",
            icon: "images/thunder.svg"
        }
    };

    return weatherCodes[code] || {
        description: "Unknown",
        icon: "images/weather/unknown.svg"
    };
};



async function getHeroImage(searchTerm){

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=1&client_id=${accessKey}`
    );

    const data = await response.json();

    return data.results[0]?.urls?.regular + "&fm=webp";
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


async function getGalleryImages(searchTerm){

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=8&client_id=${accessKey}`
    );

    const data = await response.json();

    return data.results;
};

async function loadGallery(){

    const photos = await getGalleryImages(destination.searchTerm);
    const gallery = document.querySelector("#gallery-grid");
    gallery.innerHTML = "";

    photos.forEach(photo => {gallery.insertAdjacentHTML(
        "beforeend",
            `
            <img
                src="${photo.urls.small}&fm=webp"
                alt="${destination.name}"
                loading="lazy">
            `
        );

    });

};

const destination = destinations.find(item => item.name === destinationName);
//console.log(destination);
if (!destination) { window.location.href = "explorer.html";}

async function loadHero() {

    const imageUrl = await getHeroImage(destination.searchTerm);

    const hero = document.querySelector("#destination-hero");

    hero.innerHTML = `
        <img
            src="${imageUrl}"
            alt="${destination.name}">

        <div class="hero-overlay">
            <h3>${destination.name}</h1>
            <p>${destination.country}</p>
        </div>
    `;
};

async function loadCards() {

    const countryInfo = await getCountryInfo(destination.country);
    const weatherInfo = await getWeather( destination.latitude,destination.longitude );
    const weather = getWeatherDescription(weatherInfo.weatherCode);

    const localTime = await getLocalTime(destination.timezone);
    document.querySelector(".destination-details")
        .innerHTML = 
        `
        <article class="info-card">
            <img src="images/globe.svg" alt="Country">
            <h3>Country</h3>
            <p>${destination.country}</p>
        </article>

        <article class="info-card">
            <img src="images/building.svg" alt="Capital">
            <h3>Capital</h3>
            <p>${countryInfo.capital}</p>
        </article>

        <article class="info-card">
            <img src="images/user.svg" alt="Population">
            <h3>Population</h3>
            <p>${Number(countryInfo.population) * 1000}</p>
        </article>

        <article class="info-card">
            <img src="${weather.icon}" alt="${weather.description}" class="weather-icon">
            <h3>Weather</h3>
            <p>${weather.description}</p>
        </article>

        <article class="info-card">
            <img src="images/thermometer.svg" alt="Temperature">
            <h3>Temperature</h3>
            <p>${weatherInfo.temperature}°C</p>
        </article>

        <article class="info-card">
            <img src="images/clock.svg" alt="Local Time">
            <h3>Local Time</h3>
            <p>${localTime}</p>
        </article>
        `;
}

async function init() {

    await Promise.all([
        loadHero(),
        loadCards(),
        loadGallery()
    ]);

}

init();






























