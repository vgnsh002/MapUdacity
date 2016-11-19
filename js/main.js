//NavBar
jQuery(function($) {
    $('.menu-btn').click(function() {
        $('.responsive-menu').toggleClass('expand')
    })
})
var map;
var marker;
var informationPopUp;
var labels = '1234567890'; //Labels Marker
var labelIndex = 0;

var famousPlaces = [{
    title: 'Meenakshi Amman Temple',
    location: {
        lat: 9.919504, // latitude and longitude
        lng: 78.119364
    },
    img: 'img/00.temple-min.png',
    web: 'https://www.maduraimeenakshi.org/',
}, {
    title: 'Jigarthanda(Drink)',
    location: {
        lat: 9.917927,
        lng: 78.124907
    },
    img: 'img/02.jigathanda-min.png',
    web: 'http://www.famousjigarthanda.com/',
}, {
    title: 'Thirumalai Nayakar Mahal',
    location: {
        lat: 9.915119,
        lng: 78.123774
    },
    img: 'img/03.mahal-min.png',
    web: 'http://www.madurai.com/palace.htm',
}, {
    title: 'Gandhi Memorial Museum',
    location: {
        lat: 9.930147,
        lng: 78.138614
    },
    img: 'img/04.Gandhi-Museum-Madurai-150x150-min.png',
    web: 'www.gandhimmm.org/',
}, {
    title: 'Koodal Azhagar Temple',
    location: {
        lat: 9.914408,
        lng: 78.113818
    },
    img: 'img/05.katemple-min.png',
    web: 'koodalalagartemple.tnhrce.in/',
}, {
    title: 'Murugan Idli Shop',
    location: {
        lat: 9.916218,
        lng: 78.115625
    },
    img: 'img/06.idly-kadai-1-min.png',
    web: 'koodalalagartemple.tnhrce.in/',
}, {
    title: "St. Mary's Cathedral",
    location: {
        lat: 9.914210,
        lng: 78.125664
    },
    img: 'img/07.cathedral-min.png',
    web: 'http://www.hoparoundindia.com/tamilnadu/madurai-attractions/st.-mary%E2%80%99s-cathedral-church.aspx',
}];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.919504,
            lng: 78.119364
        },
        zoom: 15
    });

    informationPopUp = new google.maps.InfoWindow();

    //Displays markers with Animation
    var j = famousPlaces.length;
    for (var i = 0; i < j; i++) {
        var position = famousPlaces[i].location;
        var title = famousPlaces[i].title;
        var web = famousPlaces[i].web;
        var img = famousPlaces[i].img;
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            web: web,
            label: labels[labelIndex++ % labels.length],
            img: img,
            animation: google.maps.Animation.DROP,
            info: famousPlaces[i].informationPopUp,
            img: famousPlaces[i].img,
        });
        famousPlaces[i].markerObject = marker;
        marker.addListener('click', function() {
            openInfo(this, informationPopUp);
        });
    }
};

//Opens Wiki-Info on CLicking the marker

function openInfo(marker, informationPopUp) {
    //Associating marker with Wikipedia API

    var marker = marker;
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        alert("Could Not get wikipedia resources. Try again later.");
    }, 9000); // 9 second TimeOut

    $.ajax({
        url: wikiUrl,
       dataType: "jsonp",
          success: function(response) {
           var wikiVar = response[1]; // Cause for incorrect links corrected
            var url = 'http://en.wikipedia.org/wiki/' + wikiVar;

            if (informationPopUp.marker != marker) {
                informationPopUp.marker = marker;
                marker.addListener('click', toggleBounce(marker));
                informationPopUp.setContent("<div><img class='info-pic' src='" + marker.img + "'/><br /></div><div class='window'>" + marker.title + "</div><br /><br /><a href='" + url + "'>" + url + "</a></p>");
                informationPopUp.open(map, marker);
                informationPopUp.addListener("closeclick", function() {});
            }
            clearTimeout(wikiRequestTimeout); // Clears the timeout if wikiUrl has returned 200
        }
    });
}


//Fun Animation Thanks to Google ! : https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);// A Tip from Udacity Reviwer for perfect bounce
    }
}




var AppViewModel = function() {
    var self = this;
    self.famousPlaces = ko.observable(famousPlaces);
    self.clickOver = function(famousPlaces) { // Makes the marker available for display
        map.setZoom(25); // Zoom is Set on Google Maps.
        map.setCenter(famousPlaces.location);

        openInfo(famousPlaces.markerObject, informationPopUp);
    };

    self.inputLoc = ko.observable('');
    self.locSearch = ko.computed(function() {
        var newArray = ko.utils.arrayFilter(self.famousPlaces(), function(newPlace) {
            if (newPlace.title.toLowerCase().indexOf(self.inputLoc().toLowerCase()) >= 0) {
                if (newPlace.markerObject) {
                    newPlace.markerObject.setVisible(true);
                }
                return true;
            } else {
                if (newPlace.markerObject) {
                    newPlace.markerObject.setVisible(false);
                }
                return false;
            }
        });
        return newArray;
    });

};

// If Google Map fails to load...Browser Throws window alert..
var googleAlert = function() {
    alert('Ahhhhhhh.. Snap.....Google Maps hates slowwwwww server');
};


// Activates knockout.js
ko.applyBindings(new AppViewModel());
