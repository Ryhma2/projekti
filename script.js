function filterRestaurant(data) {
return data.address
}
(function() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib2JiMTIzIiwiYSI6ImNqdHBmY3U2ejAzczc0NGw1dmV0cmtkemcifQ.NYv9m8AnsqVHTop8Ay_k6w';
  var map = new mapboxgl.Map({
  container: 'map',
  center:[25,60.2],
  zoom:9,
  style: 'mapbox://styles/mapbox/streets-v11'
  });
  map.addControl(new mapboxgl.NavigationControl());
  axios.get('https://unicafe.fi/wp-json/swiss/v1/restaurants?lang=fi')
  .then(function (response) {
    // handle success

    const result = response.data.filter(filterRestaurant);

  for (item of result) {
      axios.get("https://api.digitransit.fi/geocoding/v1/search?text="+ item.address + ",Helsinki").then(function(response) {
        console.log(response.data.features[0])
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
