const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

    buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		})
		

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)


const marker = L.marker(this.coordinates)
marker.addTo(this.map).bindPopup('<p1><b>You Are Here</b></p1>').openPopup()

    },
}


async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}


window.onload = async () => {
	const coords = await getCoords()
	console.log(coords)
	myMap.coordinates = coords
	myMap.buildMap()
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'fsq3OsGMBwP5jb6kwkQp3Z2bOvG1AXXqCfkdtSofODjakHg='
    }
  };
  
  fetch('https://api.foursquare.com/v3/places/search?ll=32.8257913%2C-96.9466963&limit=5', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));         
	
	

async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	const businesses = await getFoursquare(business)
	myMap.businesses = processBusinesses(businesses)
	myMap.addMarkers()
})


