// Define arrays to hold created camera location markers
var cameraLocation = [];

// Streetmap Layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Lightmap Layer
var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

var torontoData = data;

// Loop through locations and create city and state markers
for (var i = 0; i < torontoData.length; i++) {
    // Set the marker radius for the state by passing population into the markerSize function
    cameraLocation.push(
      L.marker(torontoData[i].coordinates)
      .bindPopup("<h3>Intersection: " + torontoData[i].intersection + "</h3> <hr> <h3>Neighbourhood: " + torontoData[i].neighbourhood + "</h3>")
    );
};

var neighbourhood = L.layerGroup();
var cameraLayer = L.layerGroup(cameraLocation); 

var baseMaps = {
    "street": streetmap,
    "light": lightmap
};

var overlayMaps = {
    "Neighborhood": neighbourhood,
    "Speed Camera": cameraLayer
};

// Create the map object with center, zoom level and default layer.
let map = L.map('map', {
    center: [43.72, -79.3],
    zoom: 12,
    layers: [streetmap, neighbourhood, cameraLayer]
  })

  // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Accessing the Toronto GeoJSON URL
let torontoHoods = "https://raw.githubusercontent.com/shahkibria/Mapping_Earthquakes/main/Training/Mapping_GeoJSON_Polygons/torontoNeighborhoods.json" 

var myStyle = {
    color: "#00004c",
    fillColor: "#ffff00",
    fillOpacity: 0,
    weight: .3
}

// Grabbing our GeoJSON data with Pop Up.
d3.json(torontoHoods).then(function(data) {
    L.geoJson(data,{
        style: myStyle,
        onEachFeature: function(feature, layer) {
            console.log(layer)
            layer.on({
                click: function(event) {
                    map.fitBounds(event.target.getBounds());
                  }
            })}
        }).addTo(neighbourhood);

        neighbourhood.addTo(map);
});
