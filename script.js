function filterRestaurant(data) {
return data.address
}

function getMenu(data) {
  var html = "";
  for (i = 0; i < data.menuData.menus.length; i++){
    //document.querySelector('#data').innerHTML = '<p>'+result.menuData.menus[i]+'</p>'
    html += "<h3>"+data.menuData.menus[i].date+'</h3>';
    for (j = 0; j < data.menuData.menus[i].data.length; j++){
      html += "<p>"+data.menuData.menus[i].data[j].name+"</p>"
      console.log(data.menuData.menus[i].data[j].name)
    }
  }
  document.querySelector('#data').innerHTML = html;

}

(function() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib2JiMTIzIiwiYSI6ImNqdHBmY3U2ejAzczc0NGw1dmV0cmtkemcifQ.NYv9m8AnsqVHTop8Ay_k6w';
  var map = new mapboxgl.Map({
  container: 'map',
  center:[25,60.2],
  zoom:12,
  style: 'mapbox://styles/mapbox/streets-v11',
    pitchWithRotate: false,
    dragRotate: false,
    touchZoomRotate: false
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()
  if (Modernizr.geolocation) {
   navigator.geolocation.getCurrentPosition(function (data) {
     Location(data,map)
   });
 }
  axios.get('https://unicafe.fi/wp-json/swiss/v1/restaurants?lang=fi')
  .then(function (response) {
    // handle success

    const result = response.data.filter(filterRestaurant);

  for (let i = 0; i <= result.length; i++) {
      axios.get("https://api.digitransit.fi/geocoding/v1/search?text="+ result[i].address + ",Helsinki").then(function(response) {
        console.log(response.data)
          var el = document.createElement("div");
        el.className ="fa fa-map-marker";
        el.addEventListener('click', () =>
        {
          getMenu(result[i])
          //document.querySelector('#data').innerHTML = '<p>'+result[i].title+'</p>'
        })
        new mapboxgl.Marker(el)
        .setLngLat(response.data.features[0].geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML('<h2>'+result[i].title+'</h2>')).addTo(map);

        }).catch(function (error) {

          console.log(error);
        })
  }

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}());
