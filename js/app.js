jQuery(function($) {
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJJurn0-6dPezxsjYCd2hMwMsDOvkxwTs&callback=initialize";

    document.body.appendChild(script);
});

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    // Multiple Markers
    var markers = [
        {'name' : 'Universal Studios', 'lat' : 28.4815571, 'lon' : -81.5088358},
        {'name' : 'Disney World', 'lat' : 28.3373568, 'lon' : -81.5383608},
        {'name' : 'Orlando Executive Airport', 'lat' : 28.5488172, 'lon' : -81.3342713},
        {'name' : 'Orlando International Airport', 'lat' : 28.4311577, 'lon' : -81.308083},
        {'name' : 'Amtrack Station', 'lat' : 28.5259191, 'lon' : -81.3816598},
        {'name' : 'Beacham Theatre', 'lat' : 28.5376574, 'lon' : -81.38183317}
    ];

    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Universal Studios</h3>' +
        '<p>Attractions</p>'+'</div>'],
        ['<div class="info_content">' +
        '<h3>Disney World</h3>' +
        '<p>Attractions</p>' + '</div>'],
        ['<div class="info_content">' +
        '<h3>Orlando Executive Airport</h3>' +
        '<p>Transportations</p>' +'</div>'],
        ['<div class="info_content">' +
        '<h3>Orlando International Airport</h3>' +
        '<p>Transportations</p>' +'</div>'],
        ['<div class="info_content">' +
        '<h3>Orlando Amtrack Station</h3>' +
        '<p>Transportations</p>' +'</div>'],
        ['<div class="info_content">' +
        '<h3>Beacham Theatre</h3>' +
        '<p>Historic-landmarks</p>' +'</div>']
    ];

    var listContent = [
    '<li>Universal Studios</li>',
    '<li>Disney World</li>',
    '<li>Orlando Executive Airport</li>',
    '<li>Orlando International Airport</li>',
    '<li>Amtrack Station</li>',
    '<li>Beacham Theatre</li>'
    ];

    $("#markerList").append(listContent);

    var infoWindow = new google.maps.InfoWindow(), marker, i;

    function loadThingy(marker, i){
        return function() {
            var nyt = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + markers[i].name + '&sort=newest&api-key=3e375014f5a743deb6f606692260ef6a';
            var nytContent = infoWindowContent[i] + '<div>New York Times Articles About ' + markers[i].name;
            //infoWindowContent[i] += '<div>New York Times Articles About ' + markers[i].name;

            $.getJSON(nyt, nytContent, function(data){
                    articles = data.response.docs;
                    for (var j = 0; j < 2 ; j++) { //articles.length
                        var article = articles[j];
                        nytContent += '<li class="article">'+
                            '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                            '<p>' + article.snippet + '</p>'+
                        '</li></div>';
                        console.log(nytContent);
                        infoWindow.setContent(nytContent);
                    };
                }).error(function(e){
                    nytContent += 'New York Times Articles Could Not Be Loaded</div>';
                });

            console.log(infoWindowContent[i]);
            //infoWindow.setContent(infoWindowContent[i]);
            infoWindow.open(map, marker);
             if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                  } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                  }
        }
            for (var k = 0; k < markerList.length; k++) {
                if (k = i) {
                    document.getElementById("markerList").childNodes[i].style.color="blue";
                } else {
                    document.getElementById("markerList").childNodes[i].style.color="#333";
            }};
    }

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i].lat, markers[i].lon);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: markers[i].name
        });

        document.getElementById("markerList").childNodes[i].addEventListener("click", loadThingy(marker, i-1));
        // document.getElementById('markerList').childNodes[i].addEventListener('click', function() {
        //    loadThingy(marker, i-1);
        //    doCommand('bold');
        //});

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', loadThingy(marker, i));


        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }



    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(10);
        google.maps.event.removeListener(boundsListener);
    });

}

