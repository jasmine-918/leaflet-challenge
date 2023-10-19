// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Define base layers (including additional base maps)
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '© <a href="https://www.google.com/permissions/geoguidelines/attr-guide.html">Google Maps</a> contributors'
});

// Create an object for base layers
var baseMaps = {
    'OpenStreetMap': openStreetMap,
    'Satellite Map': satelliteMap
};

// Add a base map layer (e.g., OpenStreetMap) by default
openStreetMap.addTo(map);

// Load earthquake data from the provided JSON URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => response.json())
    .then(data => {
        var earthquakeLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var coords = feature.geometry.coordinates;
                var magnitude = feature.properties.mag;
                var depth = coords[2];

                // Update the depthColor function with new colors
                function depthColor(depth) {
                    if (depth < 10) return 'teal';  // Change to teal
                    else if (depth < 30) return 'coral';  // Change to coral
                    else if (depth < 70) return 'purple';  // Change to purple
                    else return 'pink';  // Change to pink
                }

                // Define the marker size based on magnitude
                var markerSize = magnitude * 5;

                // Create a circle marker for earthquakes with updated fillColor
                return L.circleMarker(latlng, {
                    radius: markerSize,
                    fillColor: depthColor(depth),  // Use the depthColor function
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(`
                    Magnitude: ${magnitude}<br>
                    Depth: ${depth} km
                `);
            }
        });

        // Add earthquake layer to the map as an overlay
        earthquakeLayer.addTo(map);

        // Create an object for overlays
        var overlayMaps = {
            'Earthquakes': earthquakeLayer
        };

        // Load tectonic plate data (replace 'plates.json' with your dataset URL)
        fetch('plates.json') // Replace 'plates.json' with the actual URL to your tectonic plate data.
            .then(response => response.json())
            .then(plateData => {
                var tectonicPlateLayer = L.geoJSON(plateData, {
                    style: {
                        color: 'red', // Customize the line color for tectonic plate boundaries
                        weight: 2    // Line weight
                    }
                });

                // Add tectonic plate layer to the map as an overlay
                overlayMaps['Tectonic Plates'] = tectonicPlateLayer;

                // Create layer control and add it to the map
                L.control.layers(baseMaps, overlayMaps).addTo(map);
            });
    });



