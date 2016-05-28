//load modal on page startup.
$(window).load(function(){
  $('#myModal').modal('show');
});

// offsets the mapcanvas by the height of the nav bar
var mapoffset = $('#navigation-Bar').height();
$('#map_canvas').css({'margin-top': mapoffset+"px"});

/* Place google map in map div */
var map_canvas = new google.maps.Map(document.getElementById('map_canvas'), {
zoom: 2,
center: new google.maps.LatLng(15.4539982,18.9227443),
mapTypeControl: true,
mapTypeControlOptions: {
  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
  position: google.maps.ControlPosition.TOP_RIGHT,
mapTypeIds:  [
  google.maps.MapTypeId.ROADMAP,
  google.maps.MapTypeId.HYBRID
]
}
});
console.log(5 + 6);

// Change markerClusterer styles
mcOptions = {styles: [{
  	textColor: 'white',
  	height: 53,
  	url: "img/black_cluster.png",
  	width: 53
  },
  {
  	textColor: 'white',
  	height: 50,
  	url: "img/black_cluster.png",
  	width: 50
  },
  {
  	textColor: 'white',
  	height: 50,
  	url: "img/black_cluster.png",
  	width: 50
  },
  {
  	textColor: 'white',
  	height: 45,
  	url: "img/black_cluster.png",
  	width: 45
  },
  {
  	textColor: 'white',
  	height: 45,
  	url: "img/black_cluster.png",
  	width: 45
  }]
}

/* function to put name of each movie and year of winning in the drop down list*/
function populateFilmList() {
	for (i=1; i<film.length; i++)
		document.forms["location"].filmTitle.options[i] =
		new Option(film[i][0]+" (" + film[i][1]+")", i);
}
populateFilmList();

// OverlappingMarkerSpiderfier - if markers share the exact location, this lets them pop out
// so each marker can be clicked on.
var oms = new OverlappingMarkerSpiderfier(map_canvas, {keepSpiderfied: true,
        event: 'mouseover'
    });

var markers  = [];
var marker, i, j;

// put all the initial markers on the map for all movies, including MarkerClustererand OverlappingMarkerSpiderfier
  for (i=0; i<film.length; i++){
    var locations = film[i][2];
    // go through all locations of a film
    for (j=0; j<locations.length; j++) {
      //variables from the array for each film
      var filmTitle = film[i][0];
      console.log(filmTitle);
      var lat = locations[j][0];
      var lng = locations[j][1];
      var description = locations[j][2];
      var extendedDescription = locations[j][3];
      if(extendedDescription) {
      var iwDescription = ("<p>"+ "<b>" + filmTitle + "</b>" +": "+ description + " " +"<i>"+ extendedDescription+"</i>"+"</p>");
      }
      else{
      var iwDescription = ("<p>"+ "<b>" + filmTitle + "</b>" +": "+ description +"</p>");
      }

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map_canvas,
        icon: 'img/film_marker.png'
      });

      marker.desc = iwDescription;

      markers.push(marker); // Saving Markers

      oms.addMarker(marker);  // Adds the Marker to OverlappingMarkerSpiderfier
      }
    }

// infowindow is the popup window with information about each movie
    var iw = new google.maps.InfoWindow( {
      maxWidth: 200
    });

    oms.addListener('click', function(marker, e) {
      iw.setContent(marker.desc);
      iw.open(map_canvas, marker);

    });

    oms.addListener('spiderfy', function(markers) {
      iw.close();
    });

    var markerCluster = new MarkerClusterer(map_canvas, markers, mcOptions);

    markerCluster.setMaxZoom(15);

// This function displays the markers for films chosen from the drop down menu.
  function displaySingleFilm(item) {
  	//this deletes the markers from the previous film chosen
  	deleteMarkers();

  	//clears markers from markerCluster
  	markerCluster.clearMarkers();

  	var positions = film[item.selectedIndex][2];

  	// go through all positions of a film
  	for (j = 0; j < positions.length; j++) {
  	//variables from the array for each film
      var lat = positions[j][0];
  	  var lng = positions[j][1];
  	  var description = positions[j][2];
  	  var extendedDescription = positions[j][3];

  	  // adds a marker for each filming location
  	  marker = new google.maps.Marker({
  		position: new google.maps.LatLng(lat, lng),
  		map: map_canvas,
  		icon: 'img/film_marker.png'
  	  });

  	 //push each marker to the new 'markers' array - then this array can be cleared when needed
  	  markers.push(marker);
  	  markerCluster.addMarkers(markers);

  	 /* Enable pop up info window for each marker */
  	  google.maps.event.addListener(marker, 'click',
  	  // needs the names of each variable that are going to be used in the pop-up window, passed here to the function
  	 (function(marker, description, extendedDescription) {
  		return function() {
  		  if(extendedDescription) {
  			iw.setContent("<p>"+description + " " +"<i>"+ extendedDescription+"</i>"+"</p>");
  		  }
  		  else{
  			iw.setContent(description);
  		  }
  		  iw.open(map_canvas, marker);
  		}
  	   }
  	  )
  	 (marker, description, extendedDescription)
  	 );

  	/* zooms to any marker on right click - used to check correct location*/
  	google.maps.event.addListener(marker, 'rightclick', function() {
  	map_canvas.panTo(this.getPosition());
  	map_canvas.setZoom(17);
  });
  }
  // zooms the map to the current markers only
    zoomToMarkers();
  }

  // These next three functions are needed to clear any
  // markers from the map when new markers are loaded.
    function setMapOnAll(map_canvas) {
      for (var i = 0; i < markers.length; i++)  {
        markers[i].setMap(map_canvas);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      markers = [];
    }

// Zooms to the current markers displayed on the screen
  function zoomToMarkers() {
    var bounds = new google.maps.LatLngBounds();
    for (var k = 0; k < markers.length; k++) {
      bounds.extend(markers[k].getPosition());
      map_canvas.fitBounds(bounds);
      }
  }
