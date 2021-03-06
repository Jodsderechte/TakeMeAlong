var myMap;
var redIcon;
var blueIcon;
var homeIcon;
var LastDiv;
var LastMarker;
var IsInLoginView;
var homeMarker;
var OrtListe = [];
var MarkerList = [];

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
	homeIcon = new L.Icon({
		iconUrl: './icon/marker-icon-home.png',
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
	Password.addEventListener("keyup",function() {var passwd = Password.value.escape();checkPassword( passwd ); },false );
	var VorName = document.querySelector("#Vorname");
	VorName.addEventListener("keyup",function() {var Vname = VorName.value.escape();checkName( Vname,"Vorname" ); },false );
	var NachName = document.querySelector("#Nachname");
	NachName.addEventListener("keyup",function() {var Nname = NachName.value.escape();checkName( Nname,"Nachname" ); },false );
	var EMail = document.querySelector("#EMail");
	EMail.addEventListener("keyup",function() {var EMailvalue = EMail.value.escape();checkMail(EMailvalue); },false );
	var Postleihzahl = document.querySelector("#PLZ");
	Postleihzahl.addEventListener("keyup",function() {var PLZ = Postleihzahl.value.escape();checkEscherPLZ(PLZ); },false );
	var Stadt = document.querySelector("#Ort");
	Stadt.addEventListener('input', (event) => {checkStadtInfo()});
	var NutzerName = document.querySelector('#BenutzerID');
	NutzerName.addEventListener('input',(event) => {checkUserName(NutzerName.value.escape())});
	
	
	var Suchenbutton= document.getElementById("Suchen");
	Suchenbutton.onclick = sucheMitfahrgelegenheit;
	var StundenplanButton= document.getElementById("StundenplanButton");
	StundenplanButton.onclick = showStundenplan;
	var KartenButton= document.getElementById("KartenButton");
	KartenButton.onclick = showLoggedinView;
	var SuchenButton = document.getElementById("Suchen");
	SuchenButton.onclick = sucheMitfahrgelegenheit;
	var SpeichernButton = document.getElementById("Speichern");
	SpeichernButton.onclick= speicherStundenplan;
	
	
	
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

function fahrtArtSelect(){
	if(document.querySelector('input[name="Fahrart"]:checked')){
	let Fahrart = document.querySelector('input[name="Fahrart"]:checked').value; 
	if(Fahrart == 1){
		setVisibility("TimeHin", true);
		setVisibility("TimeBack", false);
		
	}
	else if(Fahrart == 2){
		setVisibility("TimeHin", false);
		setVisibility("TimeBack", true);
	}
	else {
		setVisibility("TimeHin", true);
		setVisibility("TimeBack", true);
	}
}	
}

function setMarker(data,newdiv) {
	let street = data.street;
	let streetNr = data.streetNumber;
	let zip = data.zip;
	let city = data.city;
	let token = sessionStorage.getItem('loginToken');
	let query = "streetNr=" + streetNr +"&"
	query += "street=" + street + "&";
	query += "postalcode=" + zip + "&";
	query += "country=Germany" + "&";
	query += "city=" + city+"&token="+token;
	fetch('app/location?' + query)
		.then(response => response.json())
		.then(data => {
			let marker = new L.Marker([data.lat, data.lon]); 
            marker.addTo(myMap);
          	MarkerList.push(marker);
          	let DataToHighlight = []
          	DataToHighlight.marker = marker;
          	DataToHighlight.div = newdiv;

            marker.on('click',  event => changeHighlight(DataToHighlight));

            newdiv.onclick = function() {changeHighlight(DataToHighlight);
};
		})
		.catch(function(error) {
			console.log("EXCEPTION");
			console.error(error);
		});
}

function setOwnMarker(data) {
	let token = sessionStorage.getItem('loginToken');
	let street = data.street;	
	let streetNr = data.streetNumber;
	let zip = data.zip;
	let city = data.city;
	let query = "streetNr=" + streetNr +"&"
	query += "street=" + street + "&";
	query += "postalcode=" + zip + "&";
	query += "country=Germany" + "&";
	query += "city=" + city+"&token="+token;
	
	fetch('app/location?' + query)
		.then(response => response.json())
		.then(data => {
			let marker = new L.Marker([data.lat, data.lon], {icon:homeIcon});
			 marker.addTo(myMap);
            homeMarker = marker
            
		})
		.catch(function(error) {
			console.log("EXCEPTION");
			console.error(error);
		});
}

function changeHighlight(data){
	if(!LastMarker || LastMarker!= data.marker){
	data.div.classList.remove("MitfahrgelegenheitenOutput");
	data.div.classList.add("highlighted");
	if(LastDiv){
    LastDiv.classList.remove("highlighted");
    LastDiv.classList.add("MitfahrgelegenheitenOutput");
    }
    LastDiv = data.div;
	changeMarker(data.marker);
	}
}

function changeMarker(newMarker){
	if(LastMarker){
		LastMarker.setIcon(blueIcon)  
		}
		newMarker.setIcon(redIcon)
		LastMarker = newMarker            
}

function removeMarker(marker){
	myMap.removeLayer(marker);
}

function removeAllMarkers(){
	if(MarkerList){
	for(let marker in MarkerList){
	removeMarker(MarkerList[marker]);
	}
	MarkerList = [];
}}
function removeHomeMarker(){
	if(homeMarker){
	removeMarker(homeMarker);
	homeMarker= "";
	}
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
	removeAllMarkers();
	removeHomeMarker();
	clearMitfahrgelegenheiten()
	
}

function showLoggedinView(){
	hideRegisterView();
	showOwnImage();
	hideStundenplan()
	loadStundenplan()
	setVisibility("aside", true);
	setVisibility("login", false);
	setVisibility("loggedIn", true);
	setVisibility("StundenplanContainer", false);
	setVisibility("mapid", true);
}

function login(){
	let data = {
		username: document.querySelector("#userNameLogin").value.escape(),
		password: document.querySelector("#passwordLogin").value.escape()
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
	let data = {
			username: document.querySelector("#BenutzerID").value.escape(),
			password: document.querySelector("#Passwort").value.escape(),
			firstname: document.querySelector("#Vorname").value.escape(),
			lastname: document.querySelector("#Nachname").value.escape(),
			email: document.querySelector("#EMail").value.escape(),
			street: document.querySelector("#Straße").value.escape(),
			streetNumber: document.querySelector("#NR").value.escape(),
			zip: document.querySelector("#PLZ").value.escape(),
			city: document.querySelector("#Ort").value.escape(),
			imageId: "1",
		};
		if (file) {
			document.getElementById("Profilbild").value="";
			registerUserWithImage(data,file);
		}
		else{
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

function registerUserWithImage(data,file){
	
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
			fetch('app/image?token='+data.token, {
					method: 'post',
					headers: {
						'Content-type': 'image/jpeg'
					}, body: file
				}) .then(response => {
			  		 if (!response.ok) {
			   		 	console.error('Fehler bei der Bild Registrierung!');
			        	 throw Error(response.statusText);
			          }  
			          showLoggedinView();
			         })
			  		.catch(error => {
			          console.error('Error:', error);
					});
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
	var check = re.test(Name);;
	if(Name.length==0|check|check2|check3) {
		document.getElementById(StringToPrint+"Check").innerHTML = "&#10060;";
	}
	else {
	 	document.getElementById(StringToPrint+"Check").innerHTML = "&#10004";
	}
}
function checkMail(Mail){
	var	re = new RegExp("@hs-kl.de");
	var re2 = new RegExp("@stud.hs-kl.de")
	var check2 = re2.test(Mail)
	var check = re.test(Mail);
	console.log("Mailcheck")
	if(check|check2) {
		document.getElementById("MailCheck").innerHTML = "&#10004";
	
	}
	else {
	 	document.getElementById("MailCheck").innerHTML = "&#10060;"
	}
}

function checkUserName(Name){
	console.log('checkUserName');	
	fetch('app/user/CheckUser/'+Name, {
		method: 'get',
	})
		.then(response => {
			if(response.ok){
				document.getElementById("UserCheck").innerHTML = "&#10004";
			}
			else{
				document.getElementById("UserCheck").innerHTML = "&#10060;";
			}
		})
		.catch(error => {
			console.error('Error:', error)
			document.getElementById("UserCheck").innerHTML = "&#10060;";
			});
}

function checkEscherPLZ(PLZ){
	if(PLZ.length>=3){
	var client = new XMLHttpRequest();
	client.open("GET", "http://escher.informatik.hs-kl.de:8080/PlzService/ort?plz="+PLZ, true);
	client.setRequestHeader("Accept","application/json");
	client.onreadystatechange = function() {
	if(client.readyState == 4) {
		let data = JSON.parse(client.responseText)
		if(client.responseText != "{}"){
		let Orte = document.getElementById('Orte');
			let Städte = []
			for(let i in data){
				if(Städte.includes(data[i])==false)
				Städte.push(data[i]);
			}
			OrtListe = [];
			if(Städte.length==1){
				document.getElementById("Ort").value=Städte[0].ort;
				document.getElementById("PLZCheck").innerHTML = "&#10004";
			}
			else{
			for(let k in Städte){
				let option = document.createElement("option");
				option.value = Städte[k].ort;
				option.text = Städte[k].ort;
				Orte.append(option);
				OrtListe.push(Städte[k]);
			}	
			}
		}
		else {
			document.getElementById("PLZCheck").innerHTML = "&#10060;";
		}
	};
};


client.send();
}
else {
			document.getElementById("PLZCheck").innerHTML = "&#10060;";
		}
}

function checkStadtInfo(){
	console.log("Checking stadtinfo")
	let Stadt = document.getElementById("Ort").value; 
	for(let i in OrtListe){
		if(Stadt==OrtListe[i].ort){
			document.getElementById("PLZ").value = OrtListe[i].plz;
			break;
		}	
	}
}
function clearMitfahrgelegenheiten(){
	let out=document.getElementById("out");
	out.innerHTML="";
	LocationList = [];
}

function sucheMitfahrgelegenheit(){
	removeAllMarkers();
	clearMitfahrgelegenheiten();
	let Fahrart = ""
	if(document.querySelector('input[name="Fahrart"]:checked')){
	Fahrart = document.querySelector('input[name="Fahrart"]:checked').value; 
	console.log(document.querySelector('input[name="Fahrart"]:checked'));
	document.querySelector('input[name="Fahrart"]:checked').checked = false;
	}
	let Wochentag = document.getElementById("Wochentag").value;	
	document.getElementById("Wochentag").value='';
	let Zeithin = document.getElementById("ZeitHin").value;
	document.getElementById("ZeitHin").value=''
	let ZeitZurück = document.getElementById("ZeitZurück").value;
	document.getElementById("ZeitZurück").value=''
	let token = sessionStorage.getItem('loginToken');
	let Umkreis = document.getElementById("Umkreis").value;
	document.getElementById("Umkreis").value='';
	console.log(Fahrart);
	console.log("Weekday "+Wochentag);
	fetch('app/user?token='+token+'&distance='+Umkreis, {
		method: 'get',
		headers: {
			'Content-type': 'application/json'
		},
	})
		.then(response => {
			if (!response.ok) {
				document.querySelector("#suchenError").innerHTML = "Keine Ergebnisse Vorhanden!";
				throw Error(response.statusText);
			}
			return response.json();
		})
		.then(data => {
			checkWeekTime(data,Zeithin,ZeitZurück,Wochentag,Fahrart);
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

function checkWeekTime(UserTable,Timehin,Timeback,wochentag,Fahrart){
	let token = sessionStorage.getItem('loginToken');
	let DataVorhanden = false;
	for (let i in UserTable) {
		fetch('app/time?userId='+UserTable[i].userId+'&token='+token+'&weekday='+wochentag, {
		method: 'get',
	})
		.then(response => response.json())
		.then(data => {
			
		if(Fahrart==1) {
			console.log("FAHRART 1");	
			if(data.start_Time<=Timehin){
				DataVorhanden = true;
				showMitfahrgelegenheiten(data);
				}
			}
		else if(Fahrart==2) {
			if(data.end_time>=Timeback){
				DataVorhanden = true;
				showMitfahrgelegenheiten(data);
				console.log("FAHRART 2");
				}
			}	
		else { 
			if(data.end_time>=Timeback&&data.start_Time<=Timehin){
				DataVorhanden = true;
				console.log("FAHRART 3");
				showMitfahrgelegenheiten(data);
				}
			}				
		})
		.catch(error =>{});
}	
		console.log('datavorhanden' + DataVorhanden)
		if(DataVorhanden == false){
			document.getElementById("suchenError").innerHTML = "Keine Ergebnisse vorhanden"
		}
}
function speicherStundenplan(){
	let BeginnMontag= document.getElementById("BeginnMontag").value;
	let EndeMontag= document.getElementById("EndeMontag").value;
	let BeginnDienstag = document.getElementById("BeginnDienstag").value;
	let EndeDienstag = document.getElementById("EndeDienstag").value;
	let BeginnMittwoch = document.getElementById("BeginnMittwoch").value;
	let EndeMittwoch = document.getElementById("EndeMittwoch").value;
	let BeginnDonnerstag = document.getElementById("BeginnDonnerstag").value;
	let EndeDonnerstag = document.getElementById("EndeDonnerstag").value;
	let BeginnFreitag = document.getElementById("BeginnFreitag").value;
	let EndeFreitag = document.getElementById("EndeFreitag").value;
	
	if(BeginnMontag&&EndeMontag){
		speicherWochentag(1,BeginnMontag,EndeMontag);		
	}
	if(BeginnDienstag&&EndeDienstag){
		speicherWochentag(2,BeginnDienstag,EndeDienstag);		
	}
	if(BeginnMittwoch&&EndeMittwoch){
		speicherWochentag(3,BeginnMittwoch,EndeMittwoch);		
	}
	if(BeginnDonnerstag&&EndeDonnerstag){
		speicherWochentag(4,BeginnDonnerstag,EndeDonnerstag);		
	}
	if(BeginnFreitag&&EndeFreitag){
		speicherWochentag(5,BeginnFreitag,EndeFreitag);		
	}
	}
function speicherWochentag(wochentag,start_time,end_time){
	let token = sessionStorage.getItem('loginToken');

	fetch('app/time?end_time='+end_time+'&start_time='+start_time+'&token='+token+'&weekday='+wochentag, {
		method: 'post',
	})
	.then(response=>{
		console.log(response);
	})
	.catch(error =>{console.log(error)});
}

function showMitfahrgelegenheiten(userTable){
	console.log("SHOWING MITFAHRGELEGENHEITEN");
	let token = sessionStorage.getItem('loginToken');
	let out=document.getElementById("out");
	
		let newdiv = document.createElement("div")
		newdiv.className= "MitfahrgelegenheitenOutput"
		out.append(newdiv);
		fetch('app/user/'+userTable.user_id+'?token='+token, {
		method: 'get',
	})
		.then(response => response.json())
		.then(User => {
		fetch('app/image/user/'+User.userId+'?token=' + token)
         .then(response => response.arrayBuffer())
         .then(imageData => {
            return {
            	"imageContent": imageData
                 };
             })
         .then(data => {
		console.log('IMAGE RETRIEVED')+data
			let image = document.createElement("img");
			image.src = URL.createObjectURL(
				new Blob([data.imageContent],
				 {type: 'image/jpeg'}));
			image.height = "100";
			image.width = "100"
			image.classList.add('BildBox');
			newdiv.append(image);
			
			
			let userBox = document.createElement("span");
			userBox.classList.add("userBox");
			userBox.innerHTML = User.firstname.escape()+' '+User.lastname.escape();
			let MailBox = document.createElement("span");
			MailBox.classList.add("eMailBox");
			MailBox.innerHTML = User.email.escape();
			let TimeBox = document.createElement("span");
			TimeBox.classList.add("TimeBox");
			TimeBox.innerHTML = userTable.start_Time+" - "+userTable.end_time;
			let AdressBox = document.createElement("span");
			AdressBox.classList.add("AdressBox");
			AdressBox.innerHTML = User.street.escape()+' '+User.streetNumber+" "+User.zip+" "+User.city.escape();
			newdiv.append(userBox);
			newdiv.append(MailBox);
			newdiv.append(TimeBox);
			newdiv.append(AdressBox);
			document.getElementById("suchenError").innerHTML = '';
			setMarker(User,newdiv);
            })
          .catch(error => console.error('Error: ', error));
		})	
}


function showStundenplan(){
	loadStundenplan()
	setVisibility("aside", true);
	setVisibility("login", false);
	setVisibility("loggedIn", true);
	setVisibility("StundenplanContainer", true);
	setVisibility("mapid", false);

}

function hideStundenplan(){
	document.getElementById("BeginnMontag").value='';
	document.getElementById("EndeMontag").value='';
	document.getElementById("BeginnDienstag").value='';
	document.getElementById("EndeDienstag").value='';
	document.getElementById("BeginnMittwoch").value='';
	document.getElementById("EndeMittwoch").value='';
	document.getElementById("BeginnDonnerstag").value='';
	document.getElementById("EndeDonnerstag").value='';
	document.getElementById("BeginnFreitag").value='';
	document.getElementById("EndeFreitag").value='';
			
}
function loadStundenplan(){
	let Adresse = "PLACEHOLDER"
	let token = sessionStorage.getItem('loginToken')
	fetch('app/access?token='+token, {
		method: 'get',
		headers: {
			'Content-type': 'application/json'
		},
	})
		.then(response => response.json())
		.then(data => {
		getStundenplanData(data);
		fetch('app/user/'+data+'?token='+token, {
		method: 'get',
	})
		.then(response => response.json())
		.then(data => {
		setOwnMarker(data);
		Adresse= data.street.escape()+' '+data.streetNumber+ ' '+data.zip+ ' ' +data.city
		document.getElementById("MyAdress").innerHTML=Adresse;
		})
		.catch(error => console.error('Error:', error));
		})
		.catch(error => console.error('Error:', error));
		
}

function getStundenplanData(userId){
	let token = sessionStorage.getItem('loginToken')
	console.log("getStundenplanData " +userId);
	fetch('app/time/'+userId+'?token='+token, {
		method: 'get',
	})
		.then(response => response.json())
		.then(data => {
		for (let i in data) {
			switch(data[i].weekday) {
				case 1: {
					document.getElementById("BeginnMontag").value=data[i].start_Time;
					document.getElementById("EndeMontag").value=data[i].end_time;
					break;
					}
				case 2: {
					document.getElementById("BeginnDienstag").value=data[i].start_Time;
					document.getElementById("EndeDienstag").value=data[i].end_time;
					break;
					}
				case 3: {
					document.getElementById("BeginnMittwoch").value=data[i].start_Time;
					document.getElementById("EndeMittwoch").value=data[i].end_time;
					break;
					}	
				case 4: {
					document.getElementById("BeginnDonnerstag").value=data[i].start_Time;
					document.getElementById("EndeDonnerstag").value=data[i].end_time;
					break;
					}
				case 5: {
					document.getElementById("BeginnFreitag").value=data[i].start_Time;
					document.getElementById("EndeFreitag").value=data[i].end_time;
					break;
					}
				default: {
					console.log('Weekday does not exist');
					console.log(data[i].weekday);
					break;
				}
	
			}
			
			}
		})
		.catch(error => console.error('Error:', error));

}


function getImage(userID){
	console.log("getImage");
	if(userID){
	let token = sessionStorage.getItem('loginToken')
	fetch('/app/image/'+userID+'/?token='+token)
		.then(response  => {
			})
		.then(data => {
				showImage(data)
		})
		.catch(error => console.error('Error:', error));
		}
	
}

	
function showOwnImage(){
	let token = sessionStorage.getItem('loginToken')
	 fetch('app/image/?token=' + token)
         .then(response => response.arrayBuffer())
         .then(imageData => {
            return {
            	"imageContent": imageData
                 };
             })
         .then(data => {
			let div = document.getElementById("ProfileImage");
			div.textContent = '';
			let image = document.createElement("img");
			image.src = URL.createObjectURL(
				new Blob([data.imageContent],
				 {type: 'image/jpeg'}));
			image.height = "60";
			div.append(image);
            })
          .catch(error => console.error('Error: ', error));
	
}

String.prototype.escape = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};
	