map=0;
google.maps.visualRefresh = true;
currentTravelMode=google.maps.TravelMode.WALKING;
flights=[];
order=[];
function typeIconUrl(type_t) {
	switch(type_t){
		case "D":
			url="cramschool.png";
			break;
		case "A":
			url="university.png";
			break;
		case "H":
			url="home-2.png";
			break;
		case "E":
			url="restaurant.png"
			break;
		default:
			url=""
	}
	return "icons/"+url;
}
traveler = {"WALKING":3,"DRIVING":1};
function toggler(e){
	switch(e){
		case 'car':
			$("#mode-icon-walk").css("background-position","20px 156px");
			$("#mode-icon-car").css("background-position","20px 215px");
			currentTravelMode=google.maps.TravelMode.DRIVING
			break;
		case 'walk':
			$("#mode-icon-walk").css("background-position","20px 136px");
			$("#mode-icon-car").css("background-position","20px 235px");
			currentTravelMode=google.maps.TravelMode.WALKING

	}
}

function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(19.13285,72.915317),
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		}
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
	// google.maps.event.addListener(map, 'click', function(event) {
	//placeMarker(event.latLng);
	//});
	// markerA = new google.maps.Marker({map:map,icon:"icons/letter_a.png",draggable:true});
	// markerB = new google.maps.Marker({map:map,icon:"icons/letter_b.png",draggable:true});
	markerA = new google.maps.Marker({map:map,draggable:true});
	markerB = new google.maps.Marker({map:map,draggable:true});
	$.get('/api/v1/location/?format=json').success(
		function(data){
			data_array=data.objects;
			markers = [];
			for (i in data_array){
				//Create Options for search
				var option = document.createElement('option');
				option.setAttribute("value",data_array[i]['id']);
				option.innerHTML = data_array[i]['name'].toString().replace("_"," ");
				$(".selectorsgroup").append(option);
				//Create markers
				var latlng = new google.maps.LatLng(data_array[i]["latitude"], data_array[i]["longitude"]);
				
				var whiteCircle = {
				    path: google.maps.SymbolPath.CIRCLE,
				    fillOpacity: 1.0,
				    fillColor: "white",
				    strokeOpacity: 1.0,
				    strokeColor: "white",
				    strokeWeight: 1.0,
				    scale: 3.0
				};
				markers[data_array[i].id] = new google.maps.Marker(
									{
										position : latlng,
										map : map,
										title : data_array[i]["name"].toString().replace("_"," "),
										type_t : data_array[i]["field_type"].toString(),
										icon : whiteCircle
									}
								);
				
			}
			$(".selectors").select2({containerCssClass : "classOverride",width : "80%"}).on("change",function(e){
				if(this.getAttribute("id")=="origin_select"){
					markerA.setPosition(markers[e.val].position);
				}
				else{
					markerB.setPosition(markers[e.val].position);
				}
				console.log(this,e);
			});
		}
	)
}
google.maps.event.addDomListener(window, 'load', initialize);

function placeMarker(marker,location){
	// var marker = new google.maps.Marker({position:location,map:map});
	marker.setPosition(location);
	// console.log(marker.getPosition());
	google.maps.event.removeListener(clickHandler);
}

function clicka(){
	//clickHandler = google.maps.event.addListener(map,'click',activate(event,0));
	clickHandler = google.maps.event.addListener(map, 'click', function(event) {
	placeMarker(markerA,event.latLng);

	});
}

function clickb(){
	clickHandler = google.maps.event.addListener(map,'click',activate(event,1));
}

function focusA(){
	if(typeof clickHandler != "undefined"){
		google.maps.event.removeListener(clickHandler);
	}
	clickHandler = google.maps.event.addListener(map, 'click', function(event) {
	placeMarker(markerA,event.latLng);
	});
}

function blurrA(){
	// clickHandler.removeListener();
}

function focusB(){
	if(typeof clickHandler != "undefined"){
		google.maps.event.removeListener(clickHandler);
	}
	clickHandler = google.maps.event.addListener(map, 'click', function(event) {
	placeMarker(markerB,event.latLng);
	});
}
function twinkle(classname){
	element = $(document.getElementById(classname));
	if(element.hasClass("on")){
		element.removeClass("on").animate({"height":"0%"},300);
	}
	else {
		$(".on").animate({"height":"0%"},200).removeClass("on");
		element.delay(250).animate({"height":"100%"},300).addClass("on");
	}
	// element.setAttribute("class",element.getAttribute("class")+" on");
}
function updateDirections(display){
	yaourt=display;
	steps=display.directions.routes[0].legs[0].steps;
	elem = document.getElementById("directions");
	for (i in steps) {
		var div = document.createElement("div");
		div.innerHTML=steps[i].instructions;
		div.setAttribute("class","directionSteps");
		krypton = $(div).children("div");
		elem.appendChild(div);
	}

}


function directionsupdate(full){
	elem = document.getElementById("directions");
	var div = document.createElement("div");
	div.innerHTML="Total Distance "+full+" meters";
	elem.appendChild(div);
	for(i in flights){
		var con = flights[i];
		var divv = document.createElement("div");
		divv.innerHTML = con.polylineName + " : "+ parseInt(con.length) + "m";
		divv.setAttribute("data-path",i);
		$(divv).hover(function(event){
			var i=parseInt(this.getAttribute("data-path"));
			flights[i].setOptions({strokeWeight:8,strokeColor: "#DD2222"});
		}, function(event){
			var i=parseInt(this.getAttribute("data-path"));
			flights[i].setOptions({strokeWeight:5,strokeColor: "#AABBCC"});
		})
		elem.appendChild(divv);
	}
}

function direct(){
	//Clear previous things
	//Clear Path
	for(i in flights){
		flights[i].setMap(null);
	}

	//Clear Directions
	$("#directions").html("");
	var from_lat = markerA.position.lat();
	var from_lng = markerA.position.lng();
	var to_lat = markerB.position.lat();
	var to_lng = markerB.position.lng();
	console.log("/etch?from_lat="+from_lat+"&from_lng="+from_lng+"&to_lat="+to_lat+"&to_lng="+to_lng+"&access="+traveler[currentTravelMode]);
	$.get("/etch?from_lat="+from_lat+"&from_lng="+from_lng+"&to_lat="+to_lat+"&to_lng="+to_lng+"&access="+traveler[currentTravelMode])
	 .success(function(data){
	 	for(var seg in data.details){
                drawPath(data.details[seg].path,data.details[seg].points,data.details[seg].length,data.details[seg]['path_name'],seg)
                order = data.array;
        }
		directionsupdate(data.length)
	 })
}

function drawPath(path,points,length,name,init){

    var locarray=[];
    for(p in points){
        var loc = new google.maps.LatLng(points[p]['k'],points[p]['A']);
        locarray.push(loc);
    }
    var flightPath = new google.maps.Polyline({
        path: locarray,
        geodesic: true,

        strokeColor: '#AABBCC',
        strokeOpacity: 1.0,
        strokeWeight: 5,

        polylineID: path,
        length: length,
        polylineName: name,
        init: init,
    });
    flights.push(flightPath);
    flightPath.setMap(map);
}
function old_direct() {
	// s = new google.maps.LatLng(markerA.position.lb,markerA.position.mb);
	// d = new google.maps.LatLng(markerB.position.lb,markerB.position.mb);
	if(typeof(directionsDisplay)!="undefined"){
		directionsDisplay.set("directions",null)
		document.getElementById("directions").innerHTML="";
	}
	directionsDisplay=new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(map);
	var request = { origin:markerA.position , destination:markerB.position, travelMode:currentTravelMode};
	directionsService.route(request,function(result,status) {
		if(status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			updateDirections(directionsDisplay);
		}
	});
	

}

function toggleMarkers(element) {
	type_t=$(element).parent().parent().attr("id");
	for (flag in markers) {
		if(markers[flag].type_t==type_t) {
			markers[flag].setVisible(element.checked);
		}
	}	
}

function databasePath(origin,destin) {
	init=0;
	$.get("backend/interface1.php",{origin:origin,destination:destin},function(data){
		init=data;
		path=[]
		path[0]=markers[origin].position;
		waypoints=[];
		for(i in data.paths){
			path[parseInt(i)+1]=markers[data.paths[i].id].position;
			waypoints[i] = {location : markers[data.paths[i].id].position, stopover : false};
		}
		// polyLine = new google.maps.Polyline({path:path,map:map});
		directWay(origin,destin,waypoints,path);
		// console.log(path,data.paths);
	});

}
function call(){
	databasePath($('#origin_select').val(),$('#destination_select').val());
}

function directWay(origin,destin,waypoints,path) {
	// s = new google.maps.LatLng(markerA.position.lb,markerA.position.mb);
	// d = new google.maps.LatLng(markerB.position.lb,markerB.position.mb);
	if(typeof(directionsDisplay)!="undefined"){
		directionsDisplay.set("directions",null)
		document.getElementById("directions").innerHTML="";
	}
	directionsDisplay=new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(map);
	var request = { 
		origin:markers[origin].position ,
		destination:markers[destin].position,
		travelMode:currentTravelMode, 
		waypoints:waypoints,
		optimizeWaypoints : true
	};
	directionsService.route(request,function(result,status) {
		if(status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			updateDirections(directionsDisplay);
		}
	});
	

}
