var myMap;
var redIcon;
var blueIcon;
var LocationList = [];
var LastMarker;
var MarkerList = [];
var IsInLoginView;

function initMap(){
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
}
window.onload = function() {
	
	var RegisterButton = document.getElementById("Register");
	RegisterButton.onclick = showRegisterView;
	var RegistrierenKnopf = document.getElementById("Registrieren");
	RegistrierenKnopf.onclick = register;
	var CancelRegisterButton = document.getElementById("CancelRegister");
	CancelRegisterButton.onclick = hideRegisterView;
	var loginButton = document.getElementById("loginButton");
	loginButton.onclick = login;
	var logoutButton = document.getElementById("logoutButton");
	logoutButton.onclick = logout;
	var Password = document.querySelector("#Passwort");
	Password.addEventListener("keyup",function() {var passwd = Password.value;checkPassword( passwd ); },false );
	var VorName = document.querySelector("#Vorname");
	VorName.addEventListener("keyup",function() {var Vname = VorName.value;checkName( Vname,"Vorname" ); },false );
	var NachName = document.querySelector("#Nachname");
	NachName.addEventListener("keyup",function() {var Nname = NachName.value;checkName( Nname,"Nachname" ); },false );
	var EMail = document.querySelector("#EMail");
	EMail.addEventListener("keyup",function() {var EMailvalue = EMail.value;checkMail(EMailvalue); },false );
	var Postleihzahl = document.querySelector("#PLZ");
	Postleihzahl.addEventListener("keyup",function() {var PLZ = Postleihzahl.value;checkEscherPLZ(PLZ); },false );
	var Suchenbutton= document.getElementById("Suchen");
	Suchenbutton.onclick = sucheMitfahrgelegenheit;
	var StundenplanButton= document.getElementById("StundenplanButton");
	StundenplanButton.onclick = showStundenplan;
	var KartenButton= document.getElementById("KartenButton");
	KartenButton.onclick = showLoggedinView;
	
	
	
	var Hackerbutton= document.getElementById("Hackerbutton");
	Hackerbutton.onclick = showLoggedinView;
	
	
	let token = sessionStorage.getItem('loginToken');
	
	
	
	if (token != null) {
		console.log(token)
		showLoggedinView();
	
	}
	else {
		showLoginView();
	}
	
}


function showRegisterView() {
	document.querySelector("#registerError").innerHTML = "";
	let Register = document.getElementById('RegisterContainer');
	let map = document.getElementById('mapid');
	Register.style.display = "block";
	map.style.zIndex = 7;
	Register.style.zIndex = 8;
}
function hideRegisterView() {
	let Register = document.getElementById('RegisterContainer');
	Register.style.display = "none";
		document.querySelector("#Vorname").value = "";
		document.querySelector("#Nachname").value = "";
		document.querySelector("#Straße").value = ""; 
		document.querySelector("#NR").value = "";
		document.querySelector("#PLZ").value = "";
		document.querySelector("#Ort").value = "";
		document.querySelector("#EMail").value = "";
		document.querySelector("#BenutzerID").value = "";
		document.querySelector("#Passwort").value = "";
		document.getElementById("Profilbild").value = "";
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

function setVisibility(elementId, visible) {
    const element = document.getElementById(elementId);
    if(visible === true) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden")
    }
}

function showLoginView(){
	console.log("login view")
	IsInLoginView = true
	setVisibility("aside", false);
	setVisibility("login", true);
	setVisibility("loggedIn", false);
	setVisibility("StundenplanContainer", false);
	setVisibility("mapid", true);
	if(myMap== null){
		initMap();
	}
}

function showLoggedinView(){
	console.log("logged in view")
	showImage();
	setVisibility("aside", true);
	setVisibility("login", false);
	setVisibility("loggedIn", true);
	setVisibility("StundenplanContainer", false);
	setVisibility("mapid", true);
}

function login(){
	let data = {
		username: document.querySelector("#userNameLogin").value,
		password: document.querySelector("#passwordLogin").value
	};
	fetch('app/access', {
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(data => {
			console.log("Login Token " + data);
			sessionStorage.setItem('loginToken', data.token);
			showLoggedinView()
		})
		.catch((error) => {
			console.error('Error:', error);
			sessionStorage.removeItem('loginToken');
			document.querySelector("#loginError").innerHTML = "Es ist ein Fehler aufgetreten!";
		});
}
	
function logout(){
	let token = sessionStorage.getItem('loginToken')
	fetch('app/access?token='+token, {
		method: 'delete',
		headers: {
			'Content-type': 'application/json'
		},
	})
		.then(response => {
			console.log("Logout Token " + response);
			sessionStorage.removeItem('loginToken');
			showLoginView();
		})
		.catch((error) => {
			console.error('Error:', error);
			showLoginView();
		});
}

function register() {
console.log("register")
	let file = document.getElementById("Profilbild").files[0];
	console.log(file)
	var reader = new FileReader();

	if (file) {
		reader.readAsDataURL(file);
		reader.onload = function() {
			console.log(JSON.stringify(reader.result))
			let data = {
				firstname: document.querySelector("#Vorname").value,
				lastname: document.querySelector("#Nachname").value,
				street: document.querySelector("#Straße").value,
				streetNumber:document.querySelector("#NR").value,
				zip: document.querySelector("#PLZ").value,
				city: document.querySelector("#Ort").value,
				email: document.querySelector("#EMail").value,
				username: document.querySelector("#BenutzerID").value,
				password: document.querySelector("#Passwort").value,
				profileImage: reader.result
			};
			console.log(data)
			registerUser(data);
		};
		reader.onerror = function(error) {
			console.log('Error: ', error);
		}
	}
	else {
		let data = {
			
			
			username: document.querySelector("#BenutzerID").value,
			password: document.querySelector("#Passwort").value,
			firstname: document.querySelector("#Vorname").value,
			lastname: document.querySelector("#Nachname").value,
			email: document.querySelector("#EMail").value,
			street: document.querySelector("#Straße").value,
			streetNumber: document.querySelector("#NR").value,
			zip: document.querySelector("#PLZ").value,
			city: document.querySelector("#Ort").value,
			profileImage: ""
		};
		registerUser(data);
	}
}

function registerUser(data) {
	console.log(JSON.stringify(data))
	fetch('app/user', {
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(response => {
			if (!response.ok) {
				document.querySelector("#registerError").innerHTML = "Ein Fehler ist aufgetreten!";
				throw Error(response.statusText);
			}
			return response.json();
		})
		.then(data => {
			console.log("Login Token " + data);
			sessionStorage.setItem('loginToken', data.token);
			showLoggedinView()
		})
		.catch(error => {
			if(sessionStorage.getItem('loginToken')!=null){
			sessionStorage.removeItem('loginToken');	
			}
			console.error('Error:', error);
		});
}

function resetpwdGradient(){
	var c = document.querySelector("#pwdCanvas");
	var ctxt = c.getContext("2d");
	var grdt = ctxt.createLinearGradient(0, 0, 0, 0);
	ctxt.fillStyle=grdt;
	ctxt.fillRect(0, 0, 155, 10);
}

function checkPassword( passwd )
{
	resetpwdGradient();
	var len = getPasswordStrength(passwd);
	var c = document.querySelector("#pwdCanvas");
	var ctx = c.getContext("2d");
	ctx.fillstyle = 0;
	var grd = ctx.createLinearGradient(0, 0, len*50+1, 0);
	grd.addColorStop(0, "green");
	grd.addColorStop(1, "red");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 100, 10);
	switch(len){
		case 0: document.querySelector("#PasswortError").innerHTML = " Nicht Sicher"; break;
		case 1: document.querySelector("#PasswortError").innerHTML = " Akzeptabel";break;
		case 2: document.querySelector("#PasswortError").innerHTML = " Mittel Sicher";break;
		case 3: document.querySelector("#PasswortError").innerHTML = " Sicher";break;
		case 4: document.querySelector("#PasswortError").innerHTML = " Sehr Sicher";break;
	}
}


function getPasswordStrength(psswd){
	var pswdstrength = 0
	var	re = new RegExp("[A-Z]");
	var	re2 = new RegExp("[a-z]");
	var re3 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
	var re4 = new RegExp("[_]");
	var re5 = new RegExp("[0-9]");
	if(psswd.length<5){
		return 0
	}
	else if(re.test(psswd)&re2.test(psswd)){
		pswdstrength=2
		if(re5.test(psswd)&(re3.test(psswd)||re4.test(psswd))){
			pswdstrength=pswdstrength+1
			if(psswd.length>7){
				pswdstrength=pswdstrength+1
			}
		}
	}else {pswdstrength = 1
	}
	return pswdstrength
}
function checkName(Name,StringToPrint){
	var	re = new RegExp("\\b[^A-Z]");
	var re2 = new RegExp("[^a-z]\\b")
	var re3 = new RegExp("[0-9§,$,%,&,!,?.]")
	var check3 = re3.test(Name)
	var check2 = re2.test(Name)
	var check = re.test(Name);
	if(check|check2|check3) {
		document.querySelector("#registerError").innerHTML = StringToPrint+" ist nicht korrekt!";
	}
	else if(document.querySelector("#registerError").innerHTML == StringToPrint+" ist nicht korrekt!") {
	 	document.querySelector("#registerError").innerHTML = "";
	}
}
function checkMail(Mail){
	var	re = new RegExp("@hs-kl.de");
	var re2 = new RegExp("@stud.hs-kl.de")
	var check2 = re2.test(Mail)
	var check = re.test(Mail);
	console.log("Mailcheck")
	if(check|check2) {
		if(document.querySelector("#registerError").innerHTML == "E-Mail ist nicht korrekt!") {
	 	document.querySelector("#registerError").innerHTML = "";
	}
	}
	else {
	 	document.querySelector("#registerError").innerHTML = "E-Mail ist nicht korrekt!";
	}
}
function checkPLZ(PLZ){
	if(PLZ.length==5){
	var client = new XMLHttpRequest();
	client.open("GET", "http://api.zippopotam.us/de/"+PLZ, true);
	client.onreadystatechange = function() {
	if(client.readyState == 4) {
		if(client.responseText != "{}"&document.querySelector("#registerError").innerHTML == "PLZ ist nicht korrekt!"){
	 		document.querySelector("#registerError").innerHTML = "";
		}
		else {
			document.querySelector("#registerError").innerHTML = "PLZ ist nicht korrekt!";
		}
	};
};

client.send();
}
else {
			document.querySelector("#registerError").innerHTML = "PLZ ist nicht korrekt!";
		}
}

function checkEscherPLZ(PLZ){
	if(PLZ.length==5){
	var client = new XMLHttpRequest();
	client.open("GET", "http://escher.informatik.hs-kl.de:8080/PlzService/ort?plz="+PLZ, true);
	client.setRequestHeader("Accept","application/json");
	client.onreadystatechange = function() {
	if(client.readyState == 4) {
		console.log(client.responseText)
		if(client.responseText != "{}"&document.querySelector("#registerError").innerHTML == "PLZ ist nicht korrekt!"){
	 		document.querySelector("#registerError").innerHTML = "";
		}
		else {
			document.querySelector("#registerError").innerHTML = "PLZ ist nicht korrekt!";
		}
	};
};

client.send();
}
else {
			document.querySelector("#registerError").innerHTML = "PLZ ist nicht korrekt!";
		}
}


function sucheMitfahrgelegenheit(){
	showLoggedinView;
	let Fahrart = document.querySelector('input[name="Fahrart"]:checked').value;
	let Wochentag = document.getElementById("Wochentag").value;	
	let Zeit = document.getElementById("Zeit").value;
	console.log(Fahrart);
		let data = {
				distance:document.getElementById("Umkreis").value,
				token: sessionStorage.getItem('loginToken')
			};
	fetch('app/user', {
		method: 'get',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(response => {
			if (!response.ok) {
				document.querySelector("#registerError").innerHTML = "Ein Fehler ist aufgetreten!";
				throw Error(response.statusText);
			}
			return response.json();
		})
		.then(data => {
			checkWeekTime(data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

function checkWeekTime(data){
	console.log(data);
	showMitfahrgelegenheiten(data);
}

function showMitfahrgelegenheiten(data){
	document.getElementById("out").value=data
}

function showStundenplan(){
	let Adresse = "PLACEHOLDER"
	document.getElementById("MyAdress").innerHTML=Adresse;
	setVisibility("aside", true);
	setVisibility("login", false);
	setVisibility("loggedIn", true);
	setVisibility("StundenplanContainer", true);
	setVisibility("mapid", false);
}

function showImage(){
	let image = getImage();
	let ProfileImage = document.getElementById("ProfileImage");
	ProfileImage.src=image;
}

function getImage(){
	console.log("getImage");
	let user = getUser();
	if(user){
	let token = sessionStorage.getItem('loginToken')
	fetch('app/image/{'+user.userID+'}?token='+token, {
		method: 'get',
		headers: {
			'Content-type': 'application/json'
		},
	})
		.then(response => {
			console.log("Image: " + response);
			return response;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	
	}
}

function getUser(){
	let token = sessionStorage.getItem('loginToken')
	fetch('app/access?token='+token, {
		method: 'get',
		headers: {
			'Content-type': 'application/json'
		},
	})
		.then(response => {
			console.log("User: " + response);
			return response;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	
}