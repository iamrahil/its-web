$(document).ready(function(){
	$('input[type=hidden]').select2({
		data:[{id:'0',text:'enchance'},{id:'1',text:'craps'},{id:'2',text:'scraps'}],
		width:"150px",
		minimumInputLength: 1,
		allowClear:true,
		multiple:true,
		maximumSelectionSize : 2,
		containerCssClass : "classOverride",
		dropdownCssClass : "huhu",
		formatSelectionTooBig : function(){return ""},
		formatInputTooShort : function(){return ""}
	})
});
map=0;
google.maps.visualRefresh = true;

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
			url="letter_x.png"
	}
	return "icons/"+url;
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
	markerA = new google.maps.Marker({map:map,icon:"icons/letter_a.png"});
	markerB = new google.maps.Marker({map:map,icon:"icons/letter_b.png"});
	$.ajax({url: "echo.php"}).done(
		function(data){
			data_array=JSON.parse(data);
			markers = [];
			for (i in data_array){
				var latlng = new google.maps.LatLng(data_array[i]["latitude"], data_array[i]["longitude"]);
				markers[i] = new google.maps.Marker(
									{
										position : latlng,
										map : map,
										title : data_array[i]["name"].toString(),
										icon : typeIconUrl(data_array[i]["type"].toString())
									}
								);
			}

		}
	)
}
google.maps.event.addDomListener(window, 'load', initialize);

function placeMarker(marker,location){
	// var marker = new google.maps.Marker({position:location,map:map});
	marker.setPosition(location);
	// console.log(marker.getPosition());
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
function direct() {
	// s = new google.maps.LatLng(markerA.position.lb,markerA.position.mb);
	// d = new google.maps.LatLng(markerB.position.lb,markerB.position.mb);
	var directionsDisplay=new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(map);
	var request = { origin:markerA.position , destination:markerB.position, travelMode:google.maps.TravelMode.WALKING};
	directionsService.route(request,function(result,status) {
		if(status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		}
	});

}