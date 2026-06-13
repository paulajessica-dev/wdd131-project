const year = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");
const accessKey = '241ahQyoSJQq-cRXworzMkLszIP8g18599EIpRxHB5U';
const secretKey = '9jfPavFE8pXgn6C980SzIZoSXMiSs_j67HPoP3w-bVs'

year.textContent = new Date().getFullYear();

lastModified.textContent =
    `Last Modification: ${document.lastModified}`;

const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});


const form = document.querySelector("#suggestion-form");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const suggestion = {destination:document.querySelector("#destination-name").value,
        country: document.querySelector("#country").value,
        comments: document.querySelector("#comments").value,
        date:new Date().toLocaleDateString()
    };

    const suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];

    suggestions.push(suggestion);
    localStorage.setItem(
        "suggestions",
        JSON.stringify(suggestions)
    );

    window.location.href = "suggestions.html";
});