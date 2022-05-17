var myMap;
var redIcon;
var blueIcon;
var LocationList = [];
var LastMarker;
var MarkerList = []
window.onload = function() {
	myMap = L.map('mapid').setView([49.250723, 7.377122], 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 23, // max. possible 23
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
	}).addTo(myMap);
	 redIcon = new L.Icon({
		iconUrl: './icon/marker-icon-red.png',
		shadowUrl: './icon/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
	blueIcon = new L.Icon({
		iconUrl: './icon/marker-icon-blue.png',
		shadowUrl: './icon/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
	var button = document.querySelector("#showBtn");
	button.onclick = setMarker;
}

function setMarker() {
	var street = document.querySelector("#street").value;
	var streetNr = document.querySelector("#streetNr").value;
	var zip = document.querySelector("#zip").value;
	var city = document.querySelector("#city").value;
	var query = "streetNr=" + streetNr +"&"
	query += "street=" + street + "&";
	query += "postalcode=" + zip + "&";
	query += "country=Germany" + "&";
	query += "city=" + city;
	console.log(query);
	const myInit = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		},
	};

	const myRequest = new Request('locationconverter?' + query, myInit);

	fetch(myRequest)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data.lat);
			console.log(data.lon);
			let marker = new L.Marker([data.lat, data.lon]); 
            marker.addTo(myMap);
            changeMarker(marker);
            data.marker = marker;
            MarkerList.push(marker)
            LocationList.push(data);
            showAllCoordinates(data);
            marker.on('click',  event => showCoordinates(event,data) );
		})
		.catch(function(error) {
			console.log("EXCEPTION");
			console.error(error);
		});
}

function showAllCoordinates(data) {
	let div = document.querySelector("#out");
	div.innerHTML = "<ul>";
	for (let i = 0 ; i<LocationList.length;i++){
		if(LocationList[i] == data) {
			div.innerHTML = div.innerHTML+'<li value="'+MarkerList.indexOf(data.marker)+'" onclick = "handleclick(this)"> <font color="#ff0000">Lat: ' + LocationList[i].lat + ' Lon: ' + LocationList[i].lon +'</font></a></li>'
		}
		else{
			div.innerHTML = div.innerHTML+'<li value="'+MarkerList.indexOf(LocationList[i]	.marker)+'" onclick = "handleclick(this)">Lat: ' + LocationList[i].lat + " Lon: " + LocationList[i].lon + "</li>"
		}
	}
	div.innerHTML = div.innerHTML+"</ul>"
}
	
function handleclick(listitem){
	var data = listitem.getAttribute('value');
	changeMarker(MarkerList[data]);
	showAllCoordinates( LocationList[data]); 
}

function showCoordinates(event,data){
	console.log(event);
	changeMarker(data.marker);
	showAllCoordinates(data); 
}

function changeMarker(newMarker){
	if(LastMarker){
		LastMarker.setIcon(blueIcon)  
		}
		newMarker.setIcon(redIcon)
		LastMarker = newMarker            
}