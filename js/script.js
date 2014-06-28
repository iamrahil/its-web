map=0;
google.maps.visualRefresh = true;
currentTravelMode=google.maps.TravelMode.WALKING;
flights=[];
order=[];
temp_direction=[];
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
		center: new google.maps.LatLng(19.132975, 72.911786),
		zoom: 15,
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
	markerA = new google.maps.Marker({map:map,icon:"icons/letter_s.png",draggable:true});
	markerB = new google.maps.Marker({map:map,icon:"icons/letter_d.png",draggable:true});
	//markerA = new google.maps.Marker({map:map,draggable:true});
	//markerB = new google.maps.Marker({map:map,draggable:true});
	$.get('/api/api/v1/location/?format=json').success(
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
	var direction_val;
	elem = document.getElementById("directions");
	var div = document.createElement("div");
	div.setAttribute("class","direction-step head");
	var divn = document.createElement("span");
	var divd = document.createElement("span");
	divn.setAttribute("class","divn");
	divd.setAttribute("class","divd");
	divn.innerHTML = "Total Distance";
	divd.innerHTML = full+" m";

	div.appendChild(divn);
	div.appendChild(divd);
	elem.appendChild(div);
	for(i in flights){
		var con = flights[i];
			if(i==0){
				direction_val=""
			}
			else{
			direction_val = temp_direction[i-1];
			}
		var divv = document.createElement("div");
		var namespan = document.createElement("span");
		var lengthspan = document.createElement("span");
		namespan.setAttribute("class","pathname")
		lengthspan.setAttribute("class","lengthspan")
		if (direction_val=="Follow") {
			namespan.innerHTML = direction_val+" to Walk "+/*on : "+con.polylineName+*/"For ";
			} 
		else if (direction_val=="" ) {
			namespan.innerHTML = "Walk "+/*on : "+con.polylineName+*/"For ";
		}
		else{
			namespan.innerHTML = "Take "+direction_val+" turn and Walk "+/*on : "+con.polylineName+*/"For ";
		};
		
		lengthspan.innerHTML = Math.ceil( parseInt(con.length)/72) + " mins";
		divv.appendChild(namespan);
		divv.appendChild(lengthspan);
		divv.setAttribute("data-path",i);
		divv.setAttribute("class","direction-step");
		$(divv).hover(function(event){
			var i=parseInt(this.getAttribute("data-path"));
			flights[i].setOptions({strokeWeight:8,strokeColor: "#DD2222"});
		}, function(event){
			var i=parseInt(this.getAttribute("data-path"));
			flights[i].setOptions({strokeWeight:5,strokeColor: "#0099FF"});
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
	var temp_bearing = [];
	temp_direction = [];
	//Clear Directions
	$("#directions").html("");
	var from_lat = markerA.position.lat();
	var from_lng = markerA.position.lng();
	var to_lat = markerB.position.lat();
	var to_lng = markerB.position.lng();
	console.log("/api/etch?from_lat="+from_lat+"&from_lng="+from_lng+"&to_lat="+to_lat+"&to_lng="+to_lng+"&access="+traveler[currentTravelMode]);
	$.get("/api/etch?from_lat="+from_lat+"&from_lng="+from_lng+"&to_lat="+to_lat+"&to_lng="+to_lng+"&access="+traveler[currentTravelMode])
	 .success(function(data){
		var i=0;
        drawPath(data.details["init"].path,data.details["init"].points,data.details["init"].length,data.details["init"].time,data.details["init"]['path_name'],i)
        //console.log(data.details["init"].points);
        //console.log(data.details["init"].points[0]);
        //console.log(data.details["init"].points[data.details["init"].points.length-1]);
        //console.log( getBearing(data.details["init"].points[0]['k'],data.details["init"].points[0]['A'],data.details["init"].points[data.details["init"].points.length-1]['k'] , data.details["init"].points[data.details["init"].points.length-1]['A'] ) );
        temp_bearing.push(getBearing(data.details["init"].points[0]['k'],data.details["init"].points[0]['A'],data.details["init"].points[data.details["init"].points.length-1]['k'] , data.details["init"].points[data.details["init"].points.length-1]['A'] ) );
		for(i in data.array){
			var segment = data.details[data.array[i]];
			if(segment != undefined){
                drawPath(segment.path,segment.points,segment.length,segment.time,segment['path_name'],i+1)
                //console.log(segment.points[0]);
                //console.log(segment.points[segment.points.length - 1]);
                //console.log( getBearing(segment.points[0]['k'],segment.points[0]['A'],segment.points[segment.points.length - 1]['k'],segment.points[segment.points.length - 1]['A']) );
                temp_bearing.push(getBearing(segment.points[0]['k'],segment.points[0]['A'],segment.points[segment.points.length - 1]['k'],segment.points[segment.points.length - 1]['A']));
			}
		}
        drawPath(data.details["fin"].path,data.details["fin"].points,data.details["fin"].length,data.details["init"].time,data.details["fin"]['path_name'],i+1)
        //console.log(data.details["fin"].points[0]);
        //console.log(data.details["fin"].points[data.details["fin"].points.length-1]);
        //console.log( getBearing(data.details["fin"].points[0]['k'],data.details["fin"].points[0]['A'],data.details["fin"].points[data.details["fin"].points.length-1]['k'],data.details["fin"].points[data.details["fin"].points.length-1]['A'] ) );
        temp_bearing.push(getBearing(data.details["fin"].points[0]['k'],data.details["fin"].points[0]['A'],data.details["fin"].points[data.details["fin"].points.length-1]['k'],data.details["fin"].points[data.details["fin"].points.length-1]['A'] ));
	 	/*for(var seg in data.details){
                drawPath(data.details[seg].path,data.details[seg].points,data.details[seg].length,data.details[seg].time,data.details[seg]['path_name'],seg)
                order = data.array;
        }*/
        console.log(temp_bearing);
       for(var i=0;i<temp_bearing.length;i++ ){
       	var diff_val = temp_bearing[i]-temp_bearing[i+1];
       	if(diff_val<180 && diff_val>-180){
       		if(diff_val<0){
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Right");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       			console.log(i+" Right "+diff_val);
       		}
       		else{
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Left");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       			console.log(i+" left "+diff_val);
       		}
       	}
       	else if (diff_val>180){
       		diff_val=diff_val-360;
       		if (diff_val<0) {
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Right");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       			console.log(i+" Else Right "+diff_val);
       			} 
       		else {
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Left");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       				console.log(i+" Else left "+diff_val);
       			}
       	}
       	else {
       		diff_val = diff_val+360;
       		if (diff_val<0) {
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Right");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       			console.log(i+" Else 2 Right "+diff_val);
       			} 
       		else {
       			if(Math.abs(diff_val)>45 && Math.abs(diff_val)<135){
       				temp_direction.push("Left");
       			}
       			else {
       				temp_direction.push("Follow");
       			}
       				console.log(i+" Else 2 left "+diff_val);
       			}
       	}

       }
       console.log(temp_direction);
	   directionsupdate(data.length)
	 })
}

function drawPath(path,points,length,time,name,init){

    var locarray=[];
    for(p in points){
        var loc = new google.maps.LatLng(points[p]['k'],points[p]['A']);
        locarray.push(loc);
    }
    var flightPath = new google.maps.Polyline({
        path: locarray,
        geodesic: true,

        strokeColor: '#0099FF',
        strokeOpacity: 1.0,
        strokeWeight: 5,

        polylineID: path,
        length: length,
        time: time,
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

/* created by akshay */

 function getBearing (src_lat , src_long , dest_lat , dest_long){
 	var lat1 = src_lat.toRadians();
	var lat2 = dest_lat.toRadians();
	var long2 = dest_long.toRadians();
	var long1 = src_long.toRadians();
	var delta_lat = ( dest_lat- src_lat ).toRadians();
	var delta_long = ( dest_long - src_long ).toRadians();
 	var y = Math.sin(long2-long1) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1);
	var brng = Math.atan2(y, x).toDegrees();
	return brng;
 }

 /** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; }
}


/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; }
}

