const searchForm = document.querySelector('form');

const ipAddress = document.querySelector('.ip-address');
const locatione = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const ISP = document.querySelector('.isp');

// I decided to use "locatione" instead of "location" above because that name is already
// defined elsewhere by JavaScript. Write console.log(location) to see its contents
// which include things like host name, host, domain, etc.

// I know I could've put the Tracker class in a separate file, but I chose to keep it
// here since there isn't that much code in this file. I also used this approach to 
// practice some OOP in JS.

class Tracker {
    constructor() {
        this.key = 'Your IP Geolocation API key goes here';  // <-- Removed the one I used for security reasons
        this.endpoint = 'https://geo.ipify.org/api/v1';
    }

    async getIpAddress(address) {
        const query = `?apiKey=${this.key}&ipAddress=${address}`;

        const response = await fetch(this.endpoint + query);
        const data = await response.json();
        
        return data;
    }

    async getClientIpAddress() {
        const query= `?apiKey=${this.key}`;

        const response = await fetch(this.endpoint + query);
        const data = await response.json();

        return data;
    }
}

const myMap = L.map('mapId2')
const tracker = new Tracker();

const updateUI = data => {
    ipAddress.textContent = data.ip;
    locatione.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezone.textContent = data.location.timezone;
    ISP.textContent = data.isp;
    
    myMap.setView([data.location.lat, data.location.lng], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'You Mapbox access token goes here' // <-- Removed the one I used for security reasons
    }).addTo(myMap);

    const myIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconAnchor: [23,56]
    });

    const myMarker = L.marker([data.location.lat, data.location.lng],{
        icon: myIcon
    }).addTo(myMap);

    const circle = L.circle([data.location.lat, data.location.lng],{
        color: 'green',
        fillColor: 'limegreen',
        fillOpcatiy: .1,
        radius: 300
    }).addTo(myMap);

    myMarker.bindPopup('IP Address location');
    circle.bindPopup('This is the general area of the address.');
};


tracker.getClientIpAddress()
    .then(data => updateUI(data))
    .catch(err => console.log(err));


searchForm.addEventListener('submit', e => {
    e.preventDefault();

    const addressSearched = searchForm.searchInput.value.trim();

    tracker.getIpAddress(addressSearched)
        .then(data => updateUI(data))
        .catch(err => console.log(err));

    searchForm.reset();
});
