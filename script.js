"use strict";

function filterRestaurant(data) {
  return data.address;
}

var coordinates = [];
var getGoogleMapsLink = function getGoogleMapsLink(data) {
  console.log(data);
  var link = "<a class=\"button\" href=\"https://www.google.com/maps/dir//" + data.address + "?time=" + Math.floor(Date.now() / 1000) + "\"><i class=\"fab fa-google\"></i></a>";
  return link;
};
var getHslLink = function getHslLink(data) {
  console.log(data);
  var link = "<a class=\"button bluebg\" href=\"https://reittiopas.hsl.fi/reitti/" + coordinates.latitude + "," + coordinates.longitude + "/" + data.address + "?time=" + Math.floor(Date.now() / 1000) + "\"><i class=\"fas fa-bus\"></i></a>";
  return link;
};
var Location = function Location(data, map) {
  map.flyTo({
    center: [data.coords.longitude, data.coords.latitude]
  });
  coordinates = data.coords;
  var el = document.createElement("div");
  el.className = "fa fa-map-marker red";
  new mapboxgl.Marker(el).setLngLat([data.coords.longitude, data.coords.latitude]).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h2>Sijaintisi</h2>')).addTo(map);
};

function getMenu(data) {
  var html = "";
  for (i = 0; i < data.menuData.menus.length; i++) {
    //document.querySelector('#data').innerHTML = '<p>'+result.menuData.menus[i]+'</p>'
    html += "<h3>" + data.menuData.menus[i].date + '</h3>';
    for (j = 0; j < data.menuData.menus[i].data.length; j++) {
      html += "<p>" + data.menuData.menus[i].data[j].name + "</p>";
      console.log(data.menuData.menus[i].data[j].name);
    }
  }
  document.querySelector('#data').innerHTML = html;
}

(function () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib2JiMTIzIiwiYSI6ImNqdHBmY3U2ejAzczc0NGw1dmV0cmtkemcifQ.NYv9m8AnsqVHTop8Ay_k6w';
  var map = new mapboxgl.Map({
    container: 'map',
    center: [25, 60.2],
    zoom: 12,
    style: 'mapbox://styles/mapbox/streets-v11',
    pitchWithRotate: false,
    dragRotate: false,
    touchZoomRotate: false
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(function (data) {
      Location(data, map);
    });
  }
  axios.get('https://unicafe.fi/wp-json/swiss/v1/restaurants?lang=fi').then(function (response) {
    // handle success

    var result = response.data.filter(filterRestaurant);

    var _loop = function _loop(_i) {
      axios.get("https://api.digitransit.fi/geocoding/v1/search?text=" + result[_i].address + ",Helsinki").then(function (response) {
        console.log(response.data);
        var el = document.createElement("div");
        el.className = "fa fa-map-marker";
        el.addEventListener('click', function () {
          getMenu(result[_i]);
        });
        var hsl = getHslLink(result[_i]);
        var googleMaps = getGoogleMapsLink(result[_i]);
        new mapboxgl.Marker(el).setLngLat(response.data.features[0].geometry.coordinates).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h2>' + result[_i].title + '</h2>' + hsl + googleMaps)).addTo(map);
      }).catch(function (error) {
        console.log(error);
      });
    };

    for (var _i = 0; _i <= result.length; _i++) {
      _loop(_i);
    }
  }).catch(function (error) {
    // handle error
    console.log(error);
  }).finally(function () {
    // always executed
  });
})();
