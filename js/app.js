
// Error handling
function mapError() {
        alert("Map could Not Be Loaded");
    };


function initialize() {
//initialize = () => {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

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
    //Sidebar list
    var listContent = [
    '<li>Universal Studios</li>',
    '<li>Disney World</li>',
    '<li>Orlando Executive Airport</li>',
    '<li>Orlando International Airport</li>',
    '<li>Amtrack Station</li>',
    '<li>Beacham Theatre</li>'
    ];

    var infoWindow = new google.maps.InfoWindow(), marker, i;
    //Loading Newyorktimes article links in the info window
    function loadThingy(marker, i){
        return function() {
            var nyt = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + vm.locations()[i].name + '&sort=newest&api-key=3e375014f5a743deb6f606692260ef6a';
            var nytContent = infoWindowContent[i] + '<div>New York Times Articles About ' + vm.locations()[i].name;

            $.getJSON(nyt, nytContent, function(data){
                    articles = data.response.docs;
                    for (var j = 0; j < 2 ; j++) { //articles.length
                        var article = articles[j];
                        nytContent += '<li class="article">'+
                            '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                            '<p>' + article.snippet + '</p>'+ '</li></div>';
                        infoWindow.setContent(nytContent);
                    };
                })//.error(function(e){ //error handler
                    //nytContent += '<br/><br/>New York Times Articles Could Not Be Loaded</div>';
                    //infoWindow.setContent(nytContent);
                //})
                    .fail(function(e){
                        nytContent += '<br/><br/><p style="color:red;"">New York Times Articles Could Not Be Loaded</p></div>';
                        infoWindow.setContent(nytContent);
                });

            infoWindow.open(map, marker);
            //marker animation
            marker.setAnimation(google.maps.Animation.BOUNCE);
            //marker moves only 3 times
            window.setTimeout(function() {
                marker.setAnimation(null);
            }, 2100);
        }
    }

    // Loop through our array of markers & place each one on the map, vm.locations = markers on the map
    for( i = 0; i < vm.locations().length; i++ ) {
        var position = new google.maps.LatLng(vm.locations()[i].lat, vm.locations()[i].lon);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: vm.locations()[i].name
        });

        vm.locations()[i].marker = marker;

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

function viewModel() {
    var self = this;
    //Location data
    self.locations = ko.observableArray([
        {name : 'Universal Studios', lat : 28.4815571, lon : -81.5088358, selected : ko.observable(false), type : 'Attractions', value : ko.observable(true)},
        {name : 'Disney World', lat : 28.3373568, lon : -81.5383608, selected : ko.observable(false), type : 'Attractions', value : ko.observable(true)},
        {name : 'Orlando Executive Airport', lat : 28.5488172, lon : -81.3342713, selected : ko.observable(false), type : 'Transportations', value : ko.observable(true)},
        {name : 'Orlando International Airport', lat : 28.4311577, lon : -81.308083, selected : ko.observable(false), type : 'Transportations', value : ko.observable(true)},
        {name : 'Amtrack Station', lat : 28.5259191, lon : -81.3816598, selected : ko.observable(false), type : 'Transportations', value : ko.observable(true)},
        {name : 'Beacham Theatre', lat : 28.5376574, lon : -81.38183317, selected : ko.observable(false), type : 'Historic Landmarks', value : ko.observable(true)}
    ]);

    self.locSize = self.locations().length;
    //Click event, if this is clicked, it changes colors by knockout binding and show info window on the map
    self.listItemClick = function(location) {
        google.maps.event.trigger(location.marker, 'click');
        for ( i = 0; i < self.locations().length; i++){
            if (self.locations()[i].name == location.name)
                self.locations()[i].selected(true);
            else
                self.locations()[i].selected(false);
        }
    };
    //Filter array list
    self.filters = ko.observableArray([
        {type : 'Display all'},
        {type : 'Attractions'},
        {type : 'Transportations'},
        {type : 'Historic Landmarks'}
        ]);

    //Filter click event, it filters by type
    self.filterClick = function(filter) {
        console.log(filter.type);
        for ( i = 0; i < self.locations().length; i++){
            if (filter.type == 'Display all') {
                self.locations()[i].value(true);
                self.locations()[i].marker.setVisible(true);
            }
            else if (self.locations()[i].type == filter.type) {
                self.locations()[i].value(true);
                self.locations()[i].marker.setVisible(true);
            }
            else {
                self.locations()[i].value(false);
                self.locations()[i].marker.setVisible(false);
            }
        }
    }
}

var vm = new viewModel();
//Without this Knockout does not work
ko.applyBindings(vm);

//Hamburger button - sidebar folding
$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });